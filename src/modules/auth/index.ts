export { AuthModule } from './auth.module';
export { CurrentUser } from './presentation/http/decorators/current-user.decorator';
export { JwtAuthGuard } from './presentation/http/guards/jwt-auth.guard';
export type {
  AuthenticatedRequest,
  JwtRequestUser,
} from './presentation/http/types/authenticated-request';
