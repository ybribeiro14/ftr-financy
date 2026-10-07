import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { AuthOutput } from '../dtos/output/auth.output'
import { LoginInput, RegisterInput, UpdateProfileInput } from '../dtos/input/auth.input'
import { CurrentUserId } from '../graphql/decorators'
import { IsAuth } from '../middlewares/auth.middleware'
import { UserModel } from '../models/user.model'
import { AuthService } from '../services/auth.service'

@Resolver()
export class AuthResolver {
  private authService = new AuthService()

  @Mutation(() => AuthOutput)
  register(@Arg('data', () => RegisterInput) data: RegisterInput) {
    return this.authService.register(data)
  }

  @Mutation(() => AuthOutput)
  login(@Arg('data', () => LoginInput) data: LoginInput) {
    return this.authService.login(data)
  }

  @Query(() => UserModel)
  @UseMiddleware(IsAuth)
  me(@CurrentUserId() userId: string) {
    return this.authService.me(userId)
  }

  @Mutation(() => UserModel)
  @UseMiddleware(IsAuth)
  updateProfile(
    @CurrentUserId() userId: string,
    @Arg('data', () => UpdateProfileInput) data: UpdateProfileInput,
  ) {
    return this.authService.updateProfile(userId, data)
  }
}
