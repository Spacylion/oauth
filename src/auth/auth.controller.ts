import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { RegisterDto } from '@/auth/dto/register.dto';
import { AuthService } from './auth.service';
import { LoggerService } from '@/logger/logger.service';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly logger: LoggerService
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Req() req:Request, @Body() dto: RegisterDto) {
        return this.authService.register(req, dto);
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Req() req:Request, @Body() dto: LoginDto) {
        return this.authService.login(req, dto);
    }


    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
        try {
            await this.authService.logout(req, res);
            res.status(HttpStatus.OK).send({ message: 'Logout successful' });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
        }
    }
}