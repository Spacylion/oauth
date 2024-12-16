import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
	GoogleRecaptchaModule,
	GoogleRecaptchaModuleOptions,
} from '@nestlab/google-recaptcha';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { getProviderConfig } from '@/config/provider.config';
import { getRecaptchaConfig } from '@/config/recaptcha.config';
import { LoggerService } from '@/logger/logger.service';
import { UserService } from '@/user/user.service';

import { ProviderModule } from './provider/provider.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { MailService } from '@/libs/mail/mail.service';

@Module({
	imports: [
		ConfigModule,
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				try {
					return await getProviderConfig(configService);
				} catch (error) {
					console.error('Error loading provider config', error);
					throw error; 
				}
			},
			inject: [ConfigService],
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService): Promise<GoogleRecaptchaModuleOptions> => {
				try {
					const recaptchaOptions = await getRecaptchaConfig(configService);
					return {
						...recaptchaOptions,
					};
				} catch (error) {
					console.error('Error loading recaptcha config', error);
					throw error; 
				}
			},
			inject: [ConfigService],
		}),
		forwardRef(() => EmailConfirmationModule)
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, LoggerService, MailService],
	exports: [AuthService],
})
export class AuthModule {}
