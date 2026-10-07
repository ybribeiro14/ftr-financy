import { Field, InputType } from 'type-graphql'
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Informe o nome' })
  @MaxLength(120, { message: 'O nome deve ter no máximo 120 caracteres' })
  name!: string

  @Field(() => String)
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string

  @Field(() => String)
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password!: string
}

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string

  @Field(() => String)
  @IsNotEmpty({ message: 'Informe a senha' })
  password!: string
}

@InputType()
export class UpdateProfileInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Informe o nome' })
  @MaxLength(120, { message: 'O nome deve ter no máximo 120 caracteres' })
  name!: string
}
