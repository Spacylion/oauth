import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'

export const getRecaptchaConfig = async (
	configService: ConfigService
): Promise<GoogleRecaptchaModuleOptions> => {
	// Ensure this key is set in your environment
	const secretKey = configService.get<string>('GOOGLE_RECAPTCHA_SECRET_KEY')

	if (!secretKey) {
		throw new Error(
			'GOOGLE_RECAPTCHA_SECRET_KEY is not defined in the environment variables.'
		)
	}

	return {
		secretKey, // Ensure this key is included
		response: req => req.headers.recaptcha,
		skipIf: process.env.NODE_ENV !== 'production', // Optional: skip recaptcha in development
		logger: new Logger() // Optional logger
		// Add other necessary configuration options here
	}
}
