import { Module } from '@nestjs/common'

import { AuthController } from '@/auth/auth.controller'
import { AuthService } from '@/auth/auth.service'
import { UserService } from '@/user/user.service'
import { LoggerService } from '@/logger/logger.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { getRecaptchaConfig } from '@/config/recaptcha.config'

@Module({
	imports: [
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getRecaptchaConfig,
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, LoggerService, ConfigService],
	exports: [AuthService],
  })
  export class AuthModule {}