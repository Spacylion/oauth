import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma/__generated__'

import { ROLES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])

		if (!roles) return true

		const request = context.switchToHttp().getRequest()
		const userRole = request.user?.role

		if (!userRole || !roles.includes(userRole)) {
			throw new ForbiddenException('No access rights.')
		}

		return true
	}
}
