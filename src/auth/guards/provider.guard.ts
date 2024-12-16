import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { Request } from 'express';

import { ProviderService } from '../provider/provider.service';

@Injectable()
export class AuthProviderGuard implements CanActivate {
    constructor(private readonly providerService: ProviderService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = this.getRequest(context);
        const provider = this.getProviderFromRequest(request);

        this.validateProvider(provider);

        return true;
    }

    private getRequest(context: ExecutionContext): Request {
        return context.switchToHttp().getRequest<Request>();
    }

    private getProviderFromRequest(request: Request): string {
        return request.params.provider;
    }

    private validateProvider(provider: string): void {
        const providerInstance = this.providerService.findByService(provider);
        if (!providerInstance) {
            throw new NotFoundException(
                `Provider >>> "${provider}" <<< not found. Please check input data.`
            );
        }
    }
}
