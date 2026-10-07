import { Arg, Int, Query, Resolver, UseMiddleware } from 'type-graphql'
import { CurrentUserId } from '../graphql/decorators'
import { IsAuth } from '../middlewares/auth.middleware'
import { DashboardSummary } from '../models/transaction.model'
import { DashboardService } from '../services/dashboard.service'

@Resolver()
@UseMiddleware(IsAuth)
export class DashboardResolver {
  private dashboardService = new DashboardService()

  @Query(() => DashboardSummary)
  dashboardSummary(
    @CurrentUserId() userId: string,
    @Arg('month', () => Int, { nullable: true }) month?: number,
    @Arg('year', () => Int, { nullable: true }) year?: number,
  ) {
    return this.dashboardService.summary(userId, month, year)
  }
}
