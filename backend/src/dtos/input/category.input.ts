import { Field, InputType } from 'type-graphql'
import { IsIn, IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator'

export const CATEGORY_COLORS = ['green', 'blue', 'purple', 'pink', 'red', 'orange', 'yellow']

@InputType()
export class CategoryInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Informe o título' })
  @MaxLength(60, { message: 'O título deve ter no máximo 60 caracteres' })
  title!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(200, { message: 'A descrição deve ter no máximo 200 caracteres' })
  description?: string | null

  @Field(() => String)
  @Matches(/^[a-z0-9-]+$/, { message: 'Ícone inválido' })
  icon!: string

  @Field(() => String)
  @IsIn(CATEGORY_COLORS, { message: 'Cor inválida' })
  color!: string
}
