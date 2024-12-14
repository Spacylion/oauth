import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express'
import { $Enums, User } from '@prisma/__generated__';

import { RegisterDto } from '@/auth/dto/register.dto';
import { LoggerService } from '@/logger/logger.service';
import { UserService } from '@/user/user.service';

import AuthMethod = $Enums.AuthMethod;
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly logger: LoggerService,
        private readonly configService: ConfigService
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

    async login (req: Request, dto: LoginDto) {
const user = await this.userService.findByEmail(dto.email)

    if(!user || !user.password) {
    throw new NotFoundException(`User not found, please check data`)
    }
    const isValidPassword = await verify(user.password, dto.password)

    if(!isValidPassword) {
        throw new UnauthorizedException(`Invalid password check or restore password`)
    }
    return this.saveSession(req, user)

    }

    async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) {
                    return reject(new InternalServerErrorException(`Can't end session, maybe server error or it was already finished`));
                }
                res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
                resolve();
            });
        });
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
