import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ProviderOptionsSymbol } from './lib/constants'
import { OptionsType } from './lib/types/provider-options.types'
import { BaseOAuthService } from './services/base-oauth.service'

@Injectable()
export class ProviderService implements OnModuleInit {
	constructor(
		private configService: ConfigService,
		@Inject(ProviderOptionsSymbol) private readonly options: OptionsType
	) {}

	onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	findByService(service: string): BaseOAuthService | null {
		return this.options.services.find(s => s.name === service) ?? null
	}
}
