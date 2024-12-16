import { isDev } from '@/libs/utils/is-dev.util';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const getMailerConfig = async (
    configService: ConfigService
): Promise<MailerOptions> => {
    const host = configService.getOrThrow<string>('MAIL_HOST');
    const port = configService.getOrThrow<number>('MAIL_PORT');
    const user = configService.getOrThrow<string>('MAIL_LOGIN');
    const pass = configService.getOrThrow<string>('MAIL_PASSWORD');

    return {
        transport: {
            host,
            port,
            secure: !isDev(),
            auth: {
                user,
                pass,
            },
        },
        defaults: {
            from: `"German Kosach Team" <${user}>`,
        },
    };
};
