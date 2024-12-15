import { DynamicModule, Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { AsyncOptionsType, OptionsType } from './services/lib/types/provider-options.types';
import { ProviderOptionsSymbol } from './services/lib/constants';

@Module({})
export class ProviderModule {
  static register (options: OptionsType) : DynamicModule {
    return {
      module: ProviderModule,
      providers: [
        {
          useValue: options.services, 
          provide:ProviderOptionsSymbol
        },
        ProviderService
      ],
      exports: [ProviderService]
    }
  }
  static registerAsync(options: AsyncOptionsType): DynamicModule {
    return {
      module: ProviderModule,
      imports: options.imports,
      providers: [
        {
          useFactory: options.useFactory, 
          provide:ProviderOptionsSymbol,
          inject: options.inject
        },
        ProviderService
      ],
      exports: [ProviderService]
    }
  }
}
