import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template';
import { render } from '@react-email/components';


@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    async sendConfirmationEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(ConfirmationTemplate({ domain, token }))

        return this.sendMail(email, 'Подтверждение почты', html)
    }

    public async sendPasswordResetEmail(email: string, token: string) {
        const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
        const html = await render(ResetPasswordTemplate({ domain, token }))

        return this.sendMail(email, 'Сброс пароля', html)
    }

    async sendTwoFactorTokenEmail(email: string, token: string) {
        const html = await render(TwoFactorAuthTemplate({ token }))

        return this.sendMail(email, 'Подтверждение вашей личности', html)
    }

    private sendMail(email: string, subject: string, html: string) {
        return this.mailerService.sendMail({
            to: email,
            subject,
            html
        })
    }
}
