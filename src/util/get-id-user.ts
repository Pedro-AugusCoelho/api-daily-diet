import { knex } from "../database"

export async function GetIdUserByCookie (cookie: string) {
    if (cookie) {
        const idUser = await knex('users').where('session_id', cookie).select('id').first()

        if (!idUser) {
            return null
        }

        return idUser.id
    }
}