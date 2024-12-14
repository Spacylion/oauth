import * as Joi from 'joi'

export interface Config {
	NODE_ENV: 'development' | 'production'
	APPLICATION_PORT: number
	APPLICATION_URL: string
	ALLOWED_ORIGIN: string
	COOKIES_SECRET: string
	SESSION_SECRET: string
	SESSION_NAME: string
	SESSION_DOMAIN: string
	SESSION_MAX_AGE: string
	SESSION_HTTP_ONLY: boolean
	SESSION_SECURE: boolean
	SESSION_FOLDER: string
	POSTGRES_USER: string
	POSTGRES_PASSWORD: string
	POSTGRES_HOST: string
	POSTGRES_PORT: number
	POSTGRES_DB: string
	POSTGRES_URI: string
	REDIS_USER: string
	REDIS_PASSWORD: string
	REDIS_HOST: string
	REDIS_PORT: number
	REDIS_URI: string
	GOOGLE_RECAPTCHA_SECRET_KEY: string
}

export const validationSchema = Joi.object<Config>({
	NODE_ENV: Joi.string().valid('development', 'production').required(),
	APPLICATION_PORT: Joi.number().required(),
	APPLICATION_URL: Joi.string().uri().required(),
	ALLOWED_ORIGIN: Joi.string().uri().required(),
	COOKIES_SECRET: Joi.string().required(),
	SESSION_SECRET: Joi.string().required(),
	SESSION_NAME: Joi.string().required(),
	SESSION_DOMAIN: Joi.string().required(),
	SESSION_MAX_AGE: Joi.string().required(),
	SESSION_HTTP_ONLY: Joi.boolean().required(),
	SESSION_SECURE: Joi.boolean().required(),
	SESSION_FOLDER: Joi.string().required(),
	POSTGRES_USER: Joi.string().required(),
	POSTGRES_PASSWORD: Joi.string().required(),
	POSTGRES_HOST: Joi.string().required(),
	POSTGRES_PORT: Joi.number().required(),
	POSTGRES_DB: Joi.string().required(),
	POSTGRES_URI: Joi.string()
		.custom((value, helpers) => {
			const user = helpers.state.ancestors[0].POSTGRES_USER
			const password = helpers.state.ancestors[0].POSTGRES_PASSWORD
			const host = helpers.state.ancestors[0].POSTGRES_HOST
			const port = helpers.state.ancestors[0].POSTGRES_PORT
			const db = helpers.state.ancestors[0].POSTGRES_DB

			const expectedValue = `postgresql://${user}:${password}@${host}:${port}/${db}`
			if (value !== expectedValue) {
				return helpers.error('any.invalid')
			}

			return value
		})
		.required(),

	REDIS_USER: Joi.string().required(),
	REDIS_PASSWORD: Joi.string().required(),
	REDIS_HOST: Joi.string().required(),
	REDIS_PORT: Joi.number().required(),
	REDIS_URI: Joi.string()
		.custom((value, helpers) => {
			const user = helpers.state.ancestors[0].REDIS_USER
			const password = helpers.state.ancestors[0].REDIS_PASSWORD
			const host = helpers.state.ancestors[0].REDIS_HOST
			const port = helpers.state.ancestors[0].REDIS_PORT
			const expectedValue = `redis://${user}:${password}@${host}:${port}`
			if (value !== expectedValue) {
				return helpers.error('any.invalid')
			}

			return value
		})
		.required(),
	GOOGLE_RECAPTCHA_SECRET_KEY: Joi.string().required()
})
