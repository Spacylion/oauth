import { ModuleMetadata } from '@nestjs/common'

import { BaseOAuthService } from '../../services/base-oauth.service'

export type ProviderOptionsType = {
	scopes: string[]
	client_id: string
	client_secret: string
}

export type OptionsType = {
	baseUrl: string
	services: BaseOAuthService[]
}

export type AsyncOptionsType = Pick<ModuleMetadata, 'imports'> & {
	useFactory: (...args: any[]) => Promise<OptionsType>
	inject?: any[]
}
