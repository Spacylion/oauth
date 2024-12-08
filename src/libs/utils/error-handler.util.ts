import { LoggerService } from '@/logger/logger.service'

export const handleError = (
	logger: LoggerService,
	message: string,
	error: any
) => {
	logger.error(`${message}: ${error.stack || error}`)
}
