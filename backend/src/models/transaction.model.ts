import { Field, ID, Int, ObjectType, registerEnumType } from 'type-graphql'
import { TransactionType } from '@prisma/client'

registerEnumType(TransactionType, { name: 'TransactionType' })

@ObjectType()
export class TransactionCategory {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  icon!: string

  @Field(() => String)
  color!: string
}

@ObjectType('Transaction')
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  description!: string

  @Field(() => Int)
  amount!: number

  @Field(() => Date)
  date!: Date

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => ID)
  categoryId!: string

  @Field(() => TransactionCategory)
  category!: TransactionCategory

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}

@ObjectType()
export class TransactionsPage {
  @Field(() => [TransactionModel])
  items!: TransactionModel[]

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  perPage!: number
}

@ObjectType()
export class DashboardSummary {
  @Field(() => Int)
  totalBalance!: number

  @Field(() => Int)
  monthIncome!: number

  @Field(() => Int)
  monthExpense!: number
}
