import { FastifyReply, FastifyRequest } from "fastify"
import { knex } from "../database"

export async function checkSessionIdExist(request: FastifyRequest, reply: FastifyReply) {
    const sessionId = request.cookies.sessionId
    
    if (!sessionId) {
        return reply.status(401).send({
            error: 'Não autorizado'
        })
    }

    // const convertCookie = reply.unsignCookie(sessionId);

    // if (convertCookie.valid === false) {
    //     const findUser = await knex('users').where('session_id', sessionId).select('id').first()

    //     if (findUser) {
    //         await knex('users').where('id', findUser.id).update({
    //             session_id: null,
    //         })
    //     }
        
    //     return reply.status(401).send({
    //         error: 'Sua sessão expirou'
    //     })
    // }
}

// CRIAR UMA FUNÇÃO QUE AO PEGAR O SESSION ID RETORNAR O ID DO USUSARIO PARA PREENCHER NO SISTEMA