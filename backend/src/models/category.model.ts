import { Field, ID, Int, ObjectType } from 'type-graphql'

@ObjectType('Category')
export class CategoryModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String)
  icon!: string

  @Field(() => String)
  color!: string

  @Field(() => Int)
  transactionCount!: number

  @Field(() => Int)
  totalAmount!: number

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}

@ObjectType()
export class CategoriesSummary {
  @Field(() => Int)
  totalCategories!: number

  @Field(() => Int)
  totalTransactions!: number

  @Field(() => CategoryModel, { nullable: true })
  mostUsedCategory?: CategoryModel | null
}
