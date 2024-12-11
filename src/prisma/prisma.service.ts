import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/__generated__'

import { handleError } from '@/libs/utils/error-handler.util'
import { LoggerService } from '@/logger/logger.service'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor(private readonly logger: LoggerService) {
		super()
	}

	async onModuleInit(): Promise<void> {
		this.logger.debug('PrismaService module initialized')
		try {
			await this.$connect()
			this.logger.log('Connected to the database successfully')
		} catch (error) {
			handleError(this.logger, 'Failed to connect to the database', error)
		}
	}

	async onModuleDestroy(): Promise<void> {
		this.logger.debug('PrismaService module destroyed')
		try {
			await this.$disconnect()
			this.logger.log('Disconnected from the database successfully')
		} catch (error) {
			handleError(
				this.logger,
				'Failed to disconnect from the database',
				error
			)
		}
	}
}
