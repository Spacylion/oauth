<<<<<<< HEAD
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
			envFilePath: `${process.cwd()}/${process.env.NODE_ENV}.env`,
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
=======
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { IS_DEV_ENV } from '@/libs/common/is-dev-env'

@Module({
  imports: [
      ConfigModule.forRoot({

        isGlobal: true,
        ignoreEnvFile: !IS_DEV_ENV
      })
  ],
  controllers: [],
  providers: [],
>>>>>>> 08bc9a4 (feat: docker compose, db, prettier, ts config set up)
})
export class AppModule {}
