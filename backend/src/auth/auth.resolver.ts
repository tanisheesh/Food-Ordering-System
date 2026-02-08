import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Query(() => User, { nullable: true })
  async me(@Context() context: any) {
    const userId = context.req.headers['user-id'];
    if (!userId) return null;
    return this.authService.validateUser(userId);
  }
}
