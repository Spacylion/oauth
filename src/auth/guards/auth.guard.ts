import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly userService: UserService) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const userId = request.session?.userId; 

		if (!userId) {
			throw new UnauthorizedException('User not authorized. Please login to proceed.');
		}

		const user = await this.userService.findById(userId);

		if (!user) {
			throw new UnauthorizedException('User not found.');
		}

		request.user = user;
		return true;
	}
}
