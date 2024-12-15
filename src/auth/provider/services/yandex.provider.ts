import { BaseOAuthService } from "./base-oauth.service";
import { YandexProfile } from "./lib/interfaces/yandex-profile.interface";
import { ProviderOptionsType } from "./lib/types/provider-options.types";
import { UserInfoType } from "./lib/types/user-info.types";

export class YandexProvider extends BaseOAuthService {
    constructor(
        options: ProviderOptionsType
    ) {
        super({
            name: 'yandex', 
            authorize_url: 'https://oauth.yandex.ru/authorize',
            access_url: 'https://oauth.yandex.ru/token',
            profile_url: 'https://login.yandex.ru/info?format=json',
            scopes: options.scopes,
            client_id: options.client_id,
            client_secret: options.client_secret
        });
    }

    async extractUserInfo(data: YandexProfile): Promise<UserInfoType> {
        return super.extractUserInfo({
            email: data.emails?.[0], 
            name: data.display_name,
            picture: data.default_avatar_id
                ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`
                : undefined,
        });
    }
}
