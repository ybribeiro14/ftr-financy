import { createParameterDecorator } from 'type-graphql'
import type { GraphQLContext } from './context'

export const CurrentUserId = () =>
  createParameterDecorator<GraphQLContext>(({ context }) => context.userId)
