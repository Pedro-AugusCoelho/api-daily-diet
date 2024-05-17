import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { AuthRoutes } from './routes/auth'
import { UserRoutes } from './routes/user'
import { MealsRoutes } from './routes/meals'

export const app = fastify()

app.register(cookie)

app.register(AuthRoutes, {
    prefix: 'auth'
})

app.register(UserRoutes, {
    prefix: 'user'
})

app.register(MealsRoutes, {
    prefix: 'meal'
})