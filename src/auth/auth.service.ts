import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { $Enums, User } from '@prisma/__generated__'
import { verify } from 'argon2'
import { Request, Response } from 'express'
import { RegisterDto } from '@/auth/dto/register.dto'
import { LoggerService } from '@/logger/logger.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { LoginDto } from './dto/login.dto'
import { ProviderService } from './provider/provider.service'

import AuthMethod = $Enums.AuthMethod

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly logger: LoggerService,
		private readonly configService: ConfigService,
		private readonly providerService: ProviderService
	) {}

	async register(req: Request, dto: RegisterDto) {
		const existingUser = await this.userService.findByEmail(dto.email)
		if (existingUser) {
			throw new ConflictException('Email already exists')
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			'',
			AuthMethod.CREDENTIALS,
			false
		)

		return this.saveSession(req, newUser)
	}

	async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !user.password) {
			throw new NotFoundException(`User not found, please check data`)
		}
		const isValidPassword = await verify(user.password, dto.password)

		if (!isValidPassword) {
			throw new UnauthorizedException(
				`Invalid password check or restore password`
			)
		}
		return this.saveSession(req, user)
	}

	async extractProfileFromCode(req: Request, provider: string, code: string) {
		try {
			const providerInstance =
				this.providerService.findByService(provider)
			const profile = await providerInstance.findUserByCode(code)

			const account = await this.prismaService.account.findFirst({
				where: {
					id: profile.id,
					provider: profile.provider
				}
			})

			let user = account?.userId
				? await this.userService.findById(account.userId)
				: null

			if (user) {
				return this.saveSession(req, user)
			}

			user = await this.userService.create(
				profile.email,
				'',
				profile.name,
				profile.picture,
				AuthMethod[provider.toUpperCase()],
				true
			)

			if (!account) {
				await this.prismaService.account.create({
					data: {
						userId: user.id,
						type: 'oauth',
						provider: profile.provider,
						accessToken: profile.access_token,
						refreshToken: profile.refresh_token,
						expiresAt: profile.expires_at
					}
				})
			}

			return this.saveSession(req, user)
		} catch (error) {
			console.error('Error extracting profile from code:', error)
			throw new Error('Could not extract profile from code.')
		}
	}

	async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							`Can't end session, maybe server error or it was already finished`
						)
					)
				}
				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve()
			})
		})
	}

	private async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(`Can't save session`)
					)
				}
				resolve({ user })
			})
		})
	}
}
