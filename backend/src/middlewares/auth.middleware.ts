import type { MiddlewareFn } from 'type-graphql'
import type { GraphQLContext } from '../graphql/context'

export const IsAuth: MiddlewareFn<GraphQLContext> = ({ context }, next) => {
  if (!context.userId) throw new Error('Não autenticado')
  return next()
}
