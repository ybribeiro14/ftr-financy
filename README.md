# Financy

Aplicação de gestão de finanças pessoais: cadastro e login, categorias e transações, com dashboard, filtros e paginação.

| Pasta | Conteúdo |
|---|---|
| [`backend/`](backend) | API GraphQL: TypeScript, Apollo Server, type-graphql, Prisma e SQLite |
| [`frontend/`](frontend) | React 19, Vite, TypeScript, Apollo Client, Tailwind CSS v4, React Hook Form e Zod |

## Como executar

Pré-requisito: Node.js 20 ou superior.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # ajuste JWT_SECRET se quiser
npx prisma migrate deploy   # cria o banco SQLite
npm run seed                # opcional: usuário e dados de exemplo
npm run dev                 # http://localhost:4000/graphql
```

Usuário criado pelo seed: `conta@teste.com` / `12345678`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

## Variáveis de ambiente

**backend/.env**

| Chave | Descrição | Exemplo |
|---|---|---|
| `JWT_SECRET` | Segredo usado para assinar os tokens (obrigatória) | `troque-por-um-segredo-longo-e-aleatorio` |
| `DATABASE_URL` | Caminho do banco SQLite (obrigatória) | `file:./dev.db` |
| `PORT` | Porta da API | `4000` |
| `CORS_ORIGIN` | Origem liberada no CORS | `http://localhost:5173` |

**frontend/.env**

| Chave | Descrição | Exemplo |
|---|---|---|
| `VITE_BACKEND_URL` | URL base do backend (o app acrescenta `/graphql`) | `http://localhost:4000` |

## Scripts

| Onde | Comando | O que faz |
|---|---|---|
| backend | `npm run dev` | Sobe a API com recarga automática |
| backend | `npm test` | Roda os testes de integração em um banco separado (`prisma/test.db`) |
| backend | `npm run typecheck` | Verifica os tipos |
| frontend | `npm run dev` | Sobe o app em modo de desenvolvimento |
| frontend | `npm run build` | Verifica os tipos e gera o build de produção |
| frontend | `npm run lint` | Roda o lint |

O script `npm test` do backend usa sintaxe de shell POSIX (Linux, macOS ou WSL).

## Funcionalidades

- Cadastro e login com JWT. Cada usuário vê e altera apenas os próprios dados.
- Categorias: criar, editar, excluir e listar, com título, descrição opcional, ícone e cor.
- Transações: criar, editar, excluir e listar, com filtros por busca, tipo, categoria e período e paginação.
- Dashboard com saldo total, receitas e despesas do mês, transações recentes e resumo por categoria.
- Perfil: editar o nome e sair da conta.

## API GraphQL

Endpoint: `POST /graphql`. O token vai no cabeçalho `Authorization: Bearer <token>`. O schema gerado fica em [`backend/schema.graphql`](backend/schema.graphql).

| Tipo | Operações |
|---|---|
| Autenticação | `register`, `login`, `me`, `updateProfile` |
| Categorias | `categories`, `categoriesSummary`, `createCategory`, `updateCategory`, `deleteCategory` |
| Transações | `transactions(filters, page, perPage)`, `createTransaction`, `updateTransaction`, `deleteTransaction` |
| Dashboard | `dashboardSummary(month, year)` |

## Decisões de projeto

- **Valores em centavos.** Os valores são guardados como inteiros para evitar erros de ponto flutuante. O frontend converte na exibição e na digitação.
- **Excluir categoria com transações é bloqueado**, com mensagem clara, para não perder histórico.
- **Datas em UTC.** O frontend envia a data da transação ao meio-dia UTC para que o dia não mude por causa de fuso horário. Os filtros de período também usam UTC.
- **Isolamento por usuário.** Toda consulta e alteração filtra pelo usuário autenticado, e há testes para isso.
- **Validação no servidor** com class-validator e mensagens em português, repassadas pelo frontend.
- **Busca por descrição:** no SQLite a comparação ignora maiúsculas apenas para letras sem acento.
- **"Lembrar-me" e "Recuperar senha"** aparecem na tela de login conforme o layout, mas não fazem parte dos requisitos e ainda não têm funcionalidade.
