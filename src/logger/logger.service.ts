import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class LoggerService {
	private readonly logger = new Logger(LoggerService.name)
	log(message: string) {
		this.logger.log(message) // Log without additional context
	}

	error(message: string) {
		this.logger.error(message)
	}

	warn(message: string) {
		this.logger.warn(message)
	}

	debug(message: string) {
		if (process.env.NODE_ENV !== 'production') {
			this.logger.debug(message)
		}
	}
}
