import { isDev } from "@/libs/utils/is-dev.util";
import { ConfigService } from "@nestjs/config";
import { GoogleRecaptchaModuleOptions } from "@nestlab/google-recaptcha";

export const getRecaptchaConfig = async (
    configService: ConfigService
): Promise<GoogleRecaptchaModuleOptions | null> => {
    if (isDev()) {
        return null; 
    }

    return {
        secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
        response: req => req.headers.recaptcha,
        skipIf: false
    };
};