import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { buildSchema } from 'type-graphql'
import { env } from './utils/env'
import { buildContext } from './graphql/context'
import { HealthResolver } from './resolvers/health.resolver'
import { AuthResolver } from './resolvers/auth.resolver'

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [HealthResolver, AuthResolver],
    validate: { forbidUnknownValues: false, validationError: { target: false, value: false } },
    emitSchemaFile: './schema.graphql',
  })

  const server = new ApolloServer({
    schema,
    formatError: (formatted) => {
      const details = formatted.extensions?.validationErrors as
        | { constraints?: Record<string, string> }[]
        | undefined
      const message = details?.[0]?.constraints && Object.values(details[0].constraints)[0]
      return message ? { ...formatted, message } : formatted
    },
  })
  await server.start()

  const app = express()
  app.use(cors({ origin: env.corsOrigin, credentials: true }))
  app.use('/graphql', express.json(), expressMiddleware(server, { context: buildContext }))

  app.listen(env.port, () => {
    console.log(`API rodando em http://localhost:${env.port}/graphql`)
  })
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
