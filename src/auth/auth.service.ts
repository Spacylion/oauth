import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express'
import { $Enums, User } from '@prisma/__generated__';

import { RegisterDto } from '@/auth/dto/register.dto';
import { LoggerService } from '@/logger/logger.service';
import { UserService } from '@/user/user.service';

import AuthMethod = $Enums.AuthMethod;

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly logger: LoggerService
    ) {}

    async register(req: Request, dto: RegisterDto) {
        const existingUser = await this.userService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            '', 
            AuthMethod.CREDENTIALS,
            false
        );

        return this.saveSession(req, newUser);
    }
    private async saveSession(req: Request, user: User) {
        return new Promise((resolve, reject) => {
            req.session.userId = user.id; 
        
            req.session.save(err => {
                if (err) {
                    return reject(new InternalServerErrorException(`Can't save session`));
                }
                resolve({ user });
            });
        });
    }
    
    
}
