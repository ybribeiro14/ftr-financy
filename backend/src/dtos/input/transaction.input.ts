import { Field, InputType, Int } from 'type-graphql'
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, Max, MaxLength, Min } from 'class-validator'
import { TransactionType } from '@prisma/client'
import '../../models/transaction.model'

@InputType()
export class TransactionInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Informe a descrição' })
  @MaxLength(120, { message: 'A descrição deve ter no máximo 120 caracteres' })
  description!: string

  @Field(() => Int, { description: 'Valor em centavos' })
  @IsInt({ message: 'Valor inválido' })
  @IsPositive({ message: 'O valor deve ser maior que zero' })
  amount!: number

  @Field(() => Date)
  @IsDate({ message: 'Data inválida' })
  date!: Date

  @Field(() => TransactionType)
  @IsEnum(TransactionType, { message: 'Tipo inválido' })
  type!: TransactionType

  @Field(() => String)
  @IsNotEmpty({ message: 'Selecione a categoria' })
  categoryId!: string
}

@InputType()
export class TransactionFiltersInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string | null

  @Field(() => TransactionType, { nullable: true })
  @IsOptional()
  @IsEnum(TransactionType, { message: 'Tipo inválido' })
  type?: TransactionType | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  categoryId?: string | null

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1, { message: 'Mês inválido' })
  @Max(12, { message: 'Mês inválido' })
  month?: number | null

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1970, { message: 'Ano inválido' })
  @Max(9999, { message: 'Ano inválido' })
  year?: number | null
}
