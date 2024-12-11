import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { RegisterDto } from '@/auth/dto/register.dto';
import { AuthService } from './auth.service';
import { LoggerService } from '@/logger/logger.service';
import { Request } from 'express';
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
}