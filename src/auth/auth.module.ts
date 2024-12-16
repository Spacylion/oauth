import { Module } from '@nestjs/common'
// Ensure you have a logger service
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
	GoogleRecaptchaModule,
	GoogleRecaptchaModuleOptions
} from '@nestlab/google-recaptcha'

import { AuthController } from '@/auth/auth.controller'
import { AuthService } from '@/auth/auth.service'
import { getProviderConfig } from '@/config/provider.config'
import { getRecaptchaConfig } from '@/config/recaptcha.config'
import { LoggerService } from '@/logger/logger.service'
import { UserService } from '@/user/user.service'

import { ProviderModule } from './provider/provider.module'

@Module({
	imports: [
		ConfigModule,
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) =>
				await getProviderConfig(configService),
			inject: [ConfigService]
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (
				configService: ConfigService
			): Promise<GoogleRecaptchaModuleOptions> => {
				const recaptchaOptions = await getRecaptchaConfig(configService)
				return {
					...recaptchaOptions
				}
			},
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, LoggerService],
	exports: [AuthService]
})
export class AuthModule {}
