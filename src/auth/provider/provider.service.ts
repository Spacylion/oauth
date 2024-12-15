import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ProviderOptionsSymbol } from './services/lib/constants';
import { OptionsType } from './services/lib/types/provider-options.types';
import { BaseOAuthService } from './services/base-oauth.service';

@Injectable()
export class ProviderService implements OnModuleInit {
    constructor(
        @Inject(ProviderOptionsSymbol) private readonly options: OptionsType
    ) { }

    onModuleInit() {
        for (const provider of this.options.services) {
            provider.baseUrl = this.options.baseUrl
        }
    }

    findByService(service: string): BaseOAuthService | null {
        return this.options.services.find(s => s.name === service) ?? null

    }
}
