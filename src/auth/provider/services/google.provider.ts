import { BadRequestException } from "@nestjs/common";
import { BaseOAuthService } from "./base-oauth.service";
import { GoogleProfile } from "./lib/interfaces/google-profile.interface";
import { ProviderOptionsType } from "./lib/types/provider-options.types";
import { UserInfoType } from "./lib/types/user-info.types";

export class GoogleProvider extends BaseOAuthService {
    constructor(
        options: ProviderOptionsType
    ) {
        super({
            name: 'google',
            authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
            access_url: 'https://oauth2.googleapis.com/token',
            profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
            scopes: options.scopes,
            client_id: options.client_id,
            client_secret: options.client_secret
        });
    }

    async extractUserInfo(data: GoogleProfile): Promise<UserInfoType> {
        if (!data.email || !data.name) {
            throw new BadRequestException('Missing required user information');
        }
    
        return super.extractUserInfo({
            email: data.email,
            name: data.name,
            picture: data.picture || undefined
        });
    }
    
}
