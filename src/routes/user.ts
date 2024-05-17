import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z, string } from "zod"

export async function UserRoutes(app: FastifyInstance) {
    app.get('/', async (request, reply) => {
        const users = await knex('users').select()

        return reply.send({ users })
    })

    app.get('/:id', async (request, reply) => {
        const getUserSchema = z.object({
            id: string().uuid()
        })

        const { id } = getUserSchema.parse(request.params)

        const user = await knex('users').where('id', id).first()

        if (!user) {
            return reply.status(401).send('Usuário não existe')
        }

        return reply.send({ user })
    })
}