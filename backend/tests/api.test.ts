import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'

const URL = `http://localhost:${process.env.PORT}/graphql`

type Res = { data?: any; errors?: { message: string }[] }

async function gql(query: string, token?: string): Promise<Res> {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query }),
  })
  return res.json() as Promise<Res>
}

const errorOf = (r: Res) => r.errors?.[0]?.message

async function register(name: string) {
  const email = `${name}${Date.now()}@teste.com`
  const r = await gql(`mutation{register(data:{name:"${name}",email:"${email}",password:"12345678"}){token}}`)
  return { email, token: r.data.register.token as string }
}

const createTransaction = (token: string, categoryId: string, fields: string) =>
  gql(
    `mutation{createTransaction(data:{${fields},categoryId:"${categoryId}"}){id amount category{title}}}`,
    token,
  )

before(async () => {
  await import('../src/index')
  for (let i = 0; i < 50; i++) {
    if ((await gql('{health}').catch(() => null))?.data?.health === 'ok') return
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error('API não subiu')
})

describe('auth', () => {
  it('registra, faz login e retorna o usuário logado', async () => {
    const { email, token } = await register('ana')
    const login = await gql(`mutation{login(data:{email:"${email}",password:"12345678"}){token}}`)
    assert.ok(login.data.login.token)
    assert.equal((await gql('{me{email}}', token)).data.me.email, email)
  })

  it('rejeita e-mail duplicado, senha curta e login inválido', async () => {
    const { email } = await register('bia')
    const dup = await gql(`mutation{register(data:{name:"x",email:"${email}",password:"12345678"}){token}}`)
    assert.equal(errorOf(dup), 'E-mail já cadastrado')

    const short = await gql(`mutation{register(data:{name:"x",email:"novo@teste.com",password:"123"}){token}}`)
    assert.equal(errorOf(short), 'A senha deve ter no mínimo 8 caracteres')

    const bad = await gql(`mutation{login(data:{email:"${email}",password:"errada123"}){token}}`)
    assert.equal(errorOf(bad), 'E-mail ou senha inválidos')
  })

  it('exige token nas rotas protegidas', async () => {
    for (const q of ['{me{id}}', '{categories{id}}', '{transactions{total}}', '{dashboardSummary{totalBalance}}']) {
      assert.equal(errorOf(await gql(q)), 'Não autenticado')
    }
  })

  it('atualiza o nome do perfil', async () => {
    const { token } = await register('caio')
    const r = await gql('mutation{updateProfile(data:{name:"Caio Novo"}){name}}', token)
    assert.equal(r.data.updateProfile.name, 'Caio Novo')
  })
})

describe('categorias e transações', () => {
  let token: string
  let categoryId: string
  let transactionId: string

  before(async () => {
    token = (await register('dani')).token
  })

  it('cria, edita e lista categorias', async () => {
    const created = await gql(
      'mutation{createCategory(data:{title:"Mercado",icon:"shopping-cart",color:"orange"}){id}}',
      token,
    )
    categoryId = created.data.createCategory.id

    const updated = await gql(
      `mutation{updateCategory(id:"${categoryId}",data:{title:"Supermercado",icon:"shopping-cart",color:"green"}){title}}`,
      token,
    )
    assert.equal(updated.data.updateCategory.title, 'Supermercado')
    assert.equal((await gql('{categories{id}}', token)).data.categories.length, 1)
  })

  it('valida os dados da categoria e da transação', async () => {
    const color = await gql('mutation{createCategory(data:{title:"X",icon:"a",color:"preto"}){id}}', token)
    assert.equal(errorOf(color), 'Cor inválida')

    const zero = await createTransaction(token, categoryId, 'description:"X",amount:0,date:"2025-11-10T12:00:00Z",type:EXPENSE')
    assert.equal(errorOf(zero), 'O valor deve ser maior que zero')

    const noCategory = await createTransaction(token, 'inexistente', 'description:"X",amount:100,date:"2025-11-10T12:00:00Z",type:EXPENSE')
    assert.equal(errorOf(noCategory), 'Categoria não encontrada')
  })

  it('cria, edita e lista transações', async () => {
    const t1 = await createTransaction(token, categoryId, 'description:"Almoço",amount:5000,date:"2025-11-10T12:00:00Z",type:EXPENSE')
    transactionId = t1.data.createTransaction.id
    await createTransaction(token, categoryId, 'description:"Salário",amount:300000,date:"2025-11-05T12:00:00Z",type:INCOME')
    await createTransaction(token, categoryId, 'description:"Cinema",amount:4000,date:"2025-10-20T12:00:00Z",type:EXPENSE')

    const updated = await gql(
      `mutation{updateTransaction(id:"${transactionId}",data:{description:"Almoço 2",amount:6000,date:"2025-11-10T12:00:00Z",type:EXPENSE,categoryId:"${categoryId}"}){amount}}`,
      token,
    )
    assert.equal(updated.data.updateTransaction.amount, 6000)

    const list = await gql('{transactions{total items{description}}}', token)
    assert.equal(list.data.transactions.total, 3)
    assert.equal(list.data.transactions.items[0].description, 'Almoço 2')
  })

  it('filtra por tipo, busca, categoria e período', async () => {
    const total = async (args: string) => (await gql(`{transactions(${args}){total}}`, token)).data.transactions.total

    assert.equal(await total('filters:{type:INCOME}'), 1)
    assert.equal(await total('filters:{search:"cine"}'), 1)
    assert.equal(await total(`filters:{categoryId:"${categoryId}"}`), 3)
    assert.equal(await total('filters:{month:11,year:2025}'), 2)
    assert.equal(await total('filters:{month:10,year:2025}'), 1)
  })

  it('pagina os resultados', async () => {
    const r = await gql('{transactions(page:2,perPage:2){total page items{id}}}', token)
    assert.equal(r.data.transactions.total, 3)
    assert.equal(r.data.transactions.page, 2)
    assert.equal(r.data.transactions.items.length, 1)
  })

  it('calcula resumo de categorias e dashboard', async () => {
    const cats = await gql('{categories{transactionCount totalAmount} categoriesSummary{totalCategories totalTransactions mostUsedCategory{title}}}', token)
    assert.deepEqual(cats.data.categories[0], { transactionCount: 3, totalAmount: 310000 })
    assert.equal(cats.data.categoriesSummary.mostUsedCategory.title, 'Supermercado')

    const dash = await gql('{dashboardSummary(month:11,year:2025){totalBalance monthIncome monthExpense}}', token)
    assert.deepEqual(dash.data.dashboardSummary, { totalBalance: 290000, monthIncome: 300000, monthExpense: 6000 })
  })

  it('não permite usar nem alterar dados de outro usuário', async () => {
    const other = (await register('edu')).token

    assert.equal((await gql('{transactions{total}}', other)).data.transactions.total, 0)
    assert.equal((await gql('{categories{id}}', other)).data.categories.length, 0)
    assert.equal(errorOf(await gql(`mutation{deleteTransaction(id:"${transactionId}")}`, other)), 'Transação não encontrada')
    assert.equal(errorOf(await gql(`mutation{deleteCategory(id:"${categoryId}")}`, other)), 'Categoria não encontrada')
    assert.equal(
      errorOf(await createTransaction(other, categoryId, 'description:"X",amount:100,date:"2025-11-10T12:00:00Z",type:EXPENSE')),
      'Categoria não encontrada',
    )
  })

  it('bloqueia excluir categoria com transações e exclui quando vazia', async () => {
    const blocked = await gql(`mutation{deleteCategory(id:"${categoryId}")}`, token)
    assert.equal(errorOf(blocked), 'Não é possível excluir uma categoria que possui transações')

    const ids = (await gql('{transactions{items{id}}}', token)).data.transactions.items as { id: string }[]
    for (const { id } of ids) {
      assert.equal((await gql(`mutation{deleteTransaction(id:"${id}")}`, token)).data.deleteTransaction, true)
    }
    assert.equal((await gql(`mutation{deleteCategory(id:"${categoryId}")}`, token)).data.deleteCategory, true)
  })
})
