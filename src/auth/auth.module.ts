import { Module } from '@nestjs/common'

import { AuthController } from '@/auth/auth.controller'
import { AuthService } from '@/auth/auth.service'
import { UserService } from '@/user/user.service'
import { LoggerService } from '@/logger/logger.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserService, LoggerService],
	exports: [AuthService],
  })
  export class AuthModule {}