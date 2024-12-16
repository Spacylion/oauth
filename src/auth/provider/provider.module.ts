import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ProviderOptionsSymbol } from './lib/constants'
import {
	AsyncOptionsType,
	OptionsType
} from './lib/types/provider-options.types'
import { ProviderService } from './provider.service'

@Module({})
export class ProviderModule {
	static register(options: OptionsType): DynamicModule {
		return {
			module: ProviderModule,
			imports: [ConfigModule],
			providers: [
				{
					useValue: options.services,
					provide: ProviderOptionsSymbol
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}

	static registerAsync(options: AsyncOptionsType): DynamicModule {
		return {
			module: ProviderModule,
			imports: options.imports
				? [...options.imports, ConfigModule]
				: [ConfigModule], // Ensure ConfigModule is included
			providers: [
				{
					useFactory: options.useFactory,
					provide: ProviderOptionsSymbol,
					inject: options.inject
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}
}
