import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configuration } from '@/config/index'
import { validationSchema } from '@/config/validation'

import { AuthModule } from './auth/auth.module'
import { ProviderModule } from './auth/provider/provider.module'
import { LoggerModule } from './logger/logger.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { MailModule } from './libs/mail/mail.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
			load: [configuration],
			validationSchema
		}),
		LoggerModule,
		PrismaModule,
		AuthModule,
		UserModule,
		ProviderModule,
		MailModule
	],
	controllers: [],
	providers: []
})
export class AppModule {
	constructor() {
		if (process.env.NODE_ENV === 'development') {
			console.log('Running in development mode. Skipping certain checks.')
		}
	}
}
