import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No authorization token provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded: any = this.authService.verifyToken(token);
    
    req.user = decoded;
    return true;
  }
}
