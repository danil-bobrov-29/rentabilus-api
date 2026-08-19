import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type {
  AuthenticatedRequest,
  JwtRequestUser,
} from '@auth/presentation/http/types/authenticated-request';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtRequestUser => {
    return context.switchToHttp().getRequest<AuthenticatedRequest>().user;
  },
);
