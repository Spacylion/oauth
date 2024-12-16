import { ConfigService } from '@nestjs/config'

import { OptionsType } from '@/auth/provider/lib/types/provider-options.types'
import { GoogleProvider } from '@/auth/provider/services/google.provider'
import { YandexProvider } from '@/auth/provider/services/yandex.provider'

export const getProviderConfig = async (
	configService: ConfigService
): Promise<OptionsType> => {
	return {
		baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
		services: [
			new GoogleProvider({
				client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
				client_secret: configService.getOrThrow<string>(
					'GOOGLE_CLIENT_SECRET'
				),
				scopes: ['email', 'profile']
			}),
			new YandexProvider({
				client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
				client_secret: configService.getOrThrow<string>(
					'YANDEX_CLIENT_SECRET'
				),
				scopes: ['login:email', 'login:avatar', 'login:info']
			})
		]
	}
}
