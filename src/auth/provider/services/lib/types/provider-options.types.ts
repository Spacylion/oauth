import { FactoryProvider, ModuleMetadata } from "@nestjs/common"
import { BaseOAuthService } from "../../base-oauth.service"

export type ProviderOptionsType = {
    scopes: string[]
    client_id: string
    client_secret: string
}


export type OptionsType = {
    baseUrl: string
    services: BaseOAuthService[]
}

export type AsyncOptionsType = Pick<ModuleMetadata, 'imports'> &
Pick<FactoryProvider<OptionsType>, 'useFactory' | 'inject'>