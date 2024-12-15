import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { BaseProviderOptionsType } from "./lib/types/base-provider.options.types";
import { UserInfoType } from "./lib/types/user-info.types";

@Injectable()
export class BaseOAuthService {
    private BASE_URL: string;

    constructor(private readonly options: BaseProviderOptionsType) {}

    protected async extractUserInfo(data: any): Promise<UserInfoType> {
        return {
            ...data,
            provider: this.options.name,
        };
    }

    getAuthUrl(): string {
        const query = new URLSearchParams({
            response_type: 'code',
            client_id: this.options.client_id,
            redirect_uri: this.getRedirectUrl(),
            scope: (this.options.scopes ?? []).join(' '),
            access_type: 'offline',
            prompt: 'select_account',
        });

        return `${this.options.authorize_url}?${query.toString()}`;
    }

    async findUserByCode(code: string): Promise<UserInfoType> {
        const { client_id, client_secret } = this.options;

        const tokenQuery = new URLSearchParams({
            client_id,
            client_secret,
            redirect_uri: this.getRedirectUrl(),
            grant_type: 'authorization_code',
            code, 
        });

        const tokenRequest = await fetch(this.options.access_url, {
            method: 'POST',
            body: tokenQuery.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
        });

        if (!tokenRequest.ok) {
            throw new BadRequestException(`Can't get data for user from ${this.options.profile_url}. Please check token access.`);
        }

        const tokenResponse = await tokenRequest.json();

        if (!tokenResponse.access_token) {
            throw new BadRequestException(`No tokens received from ${this.options.profile_url}. Please check if this code is valid.`);
        }

        const userRequest = await fetch(this.options.profile_url, {
            headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
            },
        });

        if (!userRequest.ok) {
            throw new UnauthorizedException(`Can't get user from ${this.options.profile_url}. Check access token.`);
        }

        const user = await userRequest.json();
        const userData = await this.extractUserInfo(user);

        return {
            ...userData,
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token,
            expires_at: tokenResponse.expires_at || tokenResponse.expires_in,
            provider: this.options.name,
        };
    }

    getRedirectUrl(): string {
        return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
    }

    set baseUrl(value: string) {
        this.BASE_URL = value;
    }

    get name() {
        return this.options.name;
    }

    get accessUrl() {
        return this.options.access_url;
    }

    get profileUrl() {
        return this.options.profile_url;
    }

    get scopes() {
        return this.options.scopes;
    }
}
