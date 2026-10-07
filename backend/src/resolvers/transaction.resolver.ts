import { Arg, ID, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { TransactionFiltersInput, TransactionInput } from '../dtos/input/transaction.input'
import { CurrentUserId } from '../graphql/decorators'
import { IsAuth } from '../middlewares/auth.middleware'
import { TransactionModel, TransactionsPage } from '../models/transaction.model'
import { TransactionService } from '../services/transaction.service'

@Resolver()
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()

  @Query(() => TransactionsPage)
  transactions(
    @CurrentUserId() userId: string,
    @Arg('filters', () => TransactionFiltersInput, { nullable: true }) filters: TransactionFiltersInput | undefined,
    @Arg('page', () => Int, { defaultValue: 1 }) page: number,
    @Arg('perPage', () => Int, { defaultValue: 10 }) perPage: number,
  ) {
    return this.transactionService.list(userId, filters, page, perPage)
  }

  @Mutation(() => TransactionModel)
  createTransaction(@CurrentUserId() userId: string, @Arg('data', () => TransactionInput) data: TransactionInput) {
    return this.transactionService.create(userId, data)
  }

  @Mutation(() => TransactionModel)
  updateTransaction(
    @CurrentUserId() userId: string,
    @Arg('id', () => ID) id: string,
    @Arg('data', () => TransactionInput) data: TransactionInput,
  ) {
    return this.transactionService.update(userId, id, data)
  }

  @Mutation(() => Boolean)
  deleteTransaction(@CurrentUserId() userId: string, @Arg('id', () => ID) id: string) {
    return this.transactionService.delete(userId, id)
  }
}
