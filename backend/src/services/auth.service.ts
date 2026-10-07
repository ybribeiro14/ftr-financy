import { prisma } from '../lib/prisma'
import { comparePassword, hashPassword } from '../utils/hash'
import { signJwt } from '../utils/jwt'
import type { LoginInput, RegisterInput, UpdateProfileInput } from '../dtos/input/auth.input'

const publicUser = { id: true, name: true, email: true, createdAt: true, updatedAt: true } as const

export class AuthService {
  async register({ name, email, password }: RegisterInput) {
    const normalized = email.trim().toLowerCase()
    if (await prisma.user.findUnique({ where: { email: normalized } })) {
      throw new Error('E-mail já cadastrado')
    }

    const user = await prisma.user.create({
      data: { name: name.trim(), email: normalized, password: await hashPassword(password) },
      select: publicUser,
    })
    return { token: signJwt(user.id), user }
  }

  async login({ email, password }: LoginInput) {
    const found = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (!found || !(await comparePassword(password, found.password))) {
      throw new Error('E-mail ou senha inválidos')
    }

    const { password: _password, ...user } = found
    return { token: signJwt(user.id), user }
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUser })
    if (!user) throw new Error('Usuário não encontrado')
    return user
  }

  updateProfile(userId: string, { name }: UpdateProfileInput) {
    return prisma.user.update({ where: { id: userId }, data: { name: name.trim() }, select: publicUser })
  }
}
