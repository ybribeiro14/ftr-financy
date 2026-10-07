import { ApolloClient, ApolloLink, CombinedGraphQLErrors, HttpLink, InMemoryCache } from '@apollo/client'
import { ErrorLink } from '@apollo/client/link/error'
import { SetContextLink } from '@apollo/client/link/context'
import { useAuthStore } from '@/stores/auth'

const httpLink = new HttpLink({ uri: `${import.meta.env.VITE_BACKEND_URL}/graphql` })

const authLink = new SetContextLink(({ headers }) => {
  const token = useAuthStore.getState().token
  return { headers: { ...headers, ...(token ? { authorization: `Bearer ${token}` } : {}) } }
})

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error) && error.errors.some((e) => e.message === 'Não autenticado')) {
    useAuthStore.getState().logout()
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } },
})

useAuthStore.subscribe((state, previous) => {
  if (previous.token && !state.token) void apolloClient.clearStore()
})
