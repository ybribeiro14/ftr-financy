import { Arg, ID, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { CategoryInput } from '../dtos/input/category.input'
import { CurrentUserId } from '../graphql/decorators'
import { IsAuth } from '../middlewares/auth.middleware'
import { CategoriesSummary, CategoryModel } from '../models/category.model'
import { CategoryService } from '../services/category.service'

@Resolver()
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()

  @Query(() => [CategoryModel])
  categories(@CurrentUserId() userId: string) {
    return this.categoryService.list(userId)
  }

  @Query(() => CategoriesSummary)
  categoriesSummary(@CurrentUserId() userId: string) {
    return this.categoryService.summary(userId)
  }

  @Mutation(() => CategoryModel)
  createCategory(@CurrentUserId() userId: string, @Arg('data', () => CategoryInput) data: CategoryInput) {
    return this.categoryService.create(userId, data)
  }

  @Mutation(() => CategoryModel)
  updateCategory(
    @CurrentUserId() userId: string,
    @Arg('id', () => ID) id: string,
    @Arg('data', () => CategoryInput) data: CategoryInput,
  ) {
    return this.categoryService.update(userId, id, data)
  }

  @Mutation(() => Boolean)
  deleteCategory(@CurrentUserId() userId: string, @Arg('id', () => ID) id: string) {
    return this.categoryService.delete(userId, id)
  }
}
