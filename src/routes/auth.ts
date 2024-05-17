import { FastifyInstance } from "fastify";
import { knex } from "../database"
import { z } from "zod";
import { randomUUID } from "crypto";


export async function AuthRoutes(app: FastifyInstance) {
    app.post('/register', async (request, reply) => {
        const createAuthBodySchema = z.object({
            email: z.string(),
            name: z.string(),
            password: z.string(),
        })

        const { email, password, name } = createAuthBodySchema.parse(request.body)

        const findUser = await knex('users').where('email', email).first().select()

        if (findUser) {
            return reply.status(401).send('Email ja cadastrado')
        }

        await knex('users').insert({
            id: randomUUID(),
            email,
            name,
            password,
        })

        return reply.status(201).send()
    })

    app.post('/sign-in', async (request, reply) => {
        const createAuthBodySchema = z.object({
            email: z.string(),
            password: z.string(),
        })

        const { email, password } = createAuthBodySchema.parse(request.body)

        const findUser = await knex('users').where('email', email).where('password', password).first().select()

        if (!findUser) {
            return reply.status(400).send('Email ou senha inválidos')
        }

        const sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        await knex('users').where('id', findUser.id).update({
            session_id: sessionId
        })

        return reply.status(201).send()
    })

    app.post('/sign-out/:id', async (request, reply) => {
        const singOutParamsSchema = z.object({
            id: z.string(),
        })

        const { id } = singOutParamsSchema.parse(request.params)

        const findUser = await knex('users').where('id', id).first()

        if (!findUser) {
            return reply.status(400).send('Usuário não encontrado')
        }

        await knex('users').where('id', findUser.id).update({
            session_id: null
        })

        reply.clearCookie('sessionId');

        return reply.status(200).send()
    })
}