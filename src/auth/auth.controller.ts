import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { Request, Response } from 'express'

import { RegisterDto } from '@/auth/dto/register.dto'
import { LoggerService } from '@/logger/logger.service'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { AuthProviderGuard } from './guards/provider.guard'
import { ProviderService } from './provider/provider.service'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly logger: LoggerService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService
	) {}

	@Recaptcha()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto)
	}

	@Recaptcha()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto)
	}
	@UseGuards(AuthProviderGuard)
	@Get('/oauth/callback/:provider')
	public async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string
	) {
		if (!code) {
			throw new BadRequestException(
				'Не был предоставлен код авторизации.'
			)
		}

		await this.authService.extractProfileFromCode(req, provider, code)

		return res.redirect(
			`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`
		)
	}
 
	@UseGuards(AuthProviderGuard)
	@Get('/oauth/connect/:provider')
	public async connect(@Param('provider') provider: string) {
		const providerInstance = this.providerService.findByService(provider)

		return {
			url: providerInstance.getAuthUrl()
		}
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	): Promise<void> {
		try {
			await this.authService.logout(req, res)
			res.status(HttpStatus.OK).send({ message: 'Logout successful' })
		} catch (error) {
			res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
				message: error.message
			})
		}
	}
}
