import { Module } from '@nestjs/common'

import { AuthController } from '@/auth/auth.controller'
import { AuthService } from '@/auth/auth.service'
import { UserService } from '@/user/user.service'
import { LoggerService } from '@/logger/logger.service'
import { ConfigService } from '@nestjs/config'

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserService, LoggerService, ConfigService],
	exports: [AuthService],
  })
  export class AuthModule {}