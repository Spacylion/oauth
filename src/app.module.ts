import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { configuration } from '@/config/configuration'
import { validationSchema } from '@/config/validation'

import { AuthModule } from './auth/auth.module'
import { LoggerModule } from './logger/logger.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `${process.cwd()}/src/config/env/.env.${process.env.NODE_ENV}`,
			load: [configuration],
			validationSchema
		}),
		LoggerModule,
		PrismaModule,
		AuthModule,
		UserModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
