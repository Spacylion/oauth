import {
	Body,
	Controller,
	HttpCode,
	HttpException,
	HttpStatus,
	Post,
	Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfirmationDto } from './dto/confirmation.dto';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
	constructor(
		private readonly emailConfirmationService: EmailConfirmationService
	) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	public async newVerification(
		@Req() req: Request,
		@Body() dto: ConfirmationDto
	) {
        try {
            const result = await this.emailConfirmationService.newVerification(req, dto);
            return { message: 'Verification successful', result };
        } catch (error) {
            throw new HttpException('Verification failed', HttpStatus.BAD_REQUEST);
        }
	}
}
