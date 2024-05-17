import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { string, z } from "zod"
import { randomUUID } from 'node:crypto'
import { checkSessionIdExist } from "../middlewares/check-session-id-exist"
import { GetIdUserByCookie } from '../util/get-id-user'

export async function MealsRoutes(app: FastifyInstance) {
    app.get('/', {
        preHandler: [ checkSessionIdExist ]
    }, async (request, reply) => {
        
        const { sessionId } = request.cookies
        const idUser = await GetIdUserByCookie(sessionId!)
        
        const meals = await knex('meals').where('user_id', idUser).select('*')

        return reply.send({ meals })
    })

    app.get('/:id', {
        preHandler: [ checkSessionIdExist ]
    }, async (request, reply) => {
        const getMeatParamsSchema = z.object({
            id: string().uuid()
        })

        const { sessionId } = request.cookies

        const idUser = await GetIdUserByCookie(sessionId!)

        const { id } = getMeatParamsSchema.parse(request.params)
        
        const meal = await knex('meals')
            .where('id', id)
            .where('user_id', idUser)
            .first()
            .select('*')

        return reply.send({ meal })
    })

    app.get('/is-diet', {
        preHandler: [ checkSessionIdExist ]
    }, async (request, reply) => {
        
        const { sessionId } = request.cookies
        const idUser = await GetIdUserByCookie(sessionId!)
        
        const meals = await knex('meals').where('user_id', idUser).where('is_diet', true).count('id as total').first()

        return reply.send({ meals })
    })

    app.get('/off-diet', {
        preHandler: [ checkSessionIdExist ]
    }, async (request, reply) => {
        
        const { sessionId } = request.cookies
        const idUser = await GetIdUserByCookie(sessionId!)
        
        const meals = await knex('meals').where('user_id', idUser).where('is_diet', false).count('id as total').first()

        return reply.send({ meals })
    })

    app.get('/total', {
        preHandler: [ checkSessionIdExist ]
    }, async (request, reply) => {
        
        const { sessionId } = request.cookies
        const idUser = await GetIdUserByCookie(sessionId!)
        
        const meals = await knex('meals').where('user_id', idUser).count('id as total').first()

        return reply.send({ meals })
    })

    app.get('/best-is-diet-sequence', {
        preHandler: [ checkSessionIdExist ]
    }, async (request, reply) => {
        
        const { sessionId } = request.cookies
        const idUser = await GetIdUserByCookie(sessionId!)
        
        const meals = await knex('meals').where('user_id', idUser).select()

        const { bestOnDietSequence } = meals.reduce(
            (acc, meal) => {
              if (meal.is_diet) {
                acc.currentSequence += 1
              } else {
                acc.currentSequence = 0
              }
    
              if (acc.currentSequence > acc.bestOnDietSequence) {
                acc.bestOnDietSequence = acc.currentSequence
              }
    
              return acc
            },
            { bestOnDietSequence: 0, currentSequence: 0 },
          )

        return reply.send({ bestOnDietSequence })
    })

    app.post('/', {
        preHandler: [ checkSessionIdExist ]
    }, async (request, reply) => {
        const createMeatSchema = z.object({
            name: z.string(),
            description: z.string(),
            created_at: z.string(),
            is_diet: z.boolean()
        })

        const { name, description, created_at, is_diet } = createMeatSchema.parse(request.body)
        const { sessionId } = request.cookies
        const idUser = await GetIdUserByCookie(sessionId!)

        if (!idUser) {
            return reply.status(401).send("Usuário inválido")  
        }

        await knex('meals').insert({
            id: randomUUID(),
            user_id: idUser,
            name,
            description,
            created_at,
            is_diet,
        })

        return reply.status(201).send()
    })

    app.put('/:id', {
        preHandler: [ checkSessionIdExist ]
    }, async (request, reply) => {
        const { sessionId } = request.cookies

        const getMeatParamsSchema = z.object({
            id: string().uuid()
        })

        const getMeatBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            created_at: z.string(),
            is_diet: z.boolean()
        })

        const idUser = await GetIdUserByCookie(sessionId!)

        if (!idUser) {
            return reply.status(401).send("Usuário inválido")  
        }

        const { id } = getMeatParamsSchema.parse(request.params)
        const { name, description, created_at, is_diet } = getMeatBodySchema.parse(request.body)
        
        await knex('meals').where('id', id).where('user_id', idUser).update({
            name,
            description,
            created_at,
            is_diet
        })

        return reply.send()
    })

    app.delete('/:id', {
        preHandler: [ checkSessionIdExist ]
    }, async (request, reply) => {
        const getMeatParamsSchema = z.object({
            id: string().uuid()
        })

        const { id } = getMeatParamsSchema.parse(request.params)
        
        await knex('meals').where('id', id).first().delete()

        return reply.send()
    })
}