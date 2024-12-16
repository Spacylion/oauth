import { Injectable, NotFoundException } from '@nestjs/common'
import { $Enums } from '@prisma/__generated__'
import { hash } from 'argon2'

import { LoggerService } from '@/logger/logger.service'
import { PrismaService } from '@/prisma/prisma.service'

import AuthMethod = $Enums.AuthMethod

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly logger: LoggerService
	) {
		this.logger.log('UserService initialized')
	}

	async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			include: { accounts: true }
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email },
			include: { accounts: true }
		})
		// Return null if no user is found
		return user // No need to throw an exception here
	}

	async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethod,
		isVerified: boolean
	) {
		return this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				displayName,
				picture,
				method,
				isVerified
			},
			include: { accounts: true }
		})
	}
}
