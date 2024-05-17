// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        meals: {
            id: string
            name: string
            description: string
            created_at: string
            is_diet: boolean
            user_id: string
        },
        users: {
            id: string
            session_id?: string | null
            email: string
            name: string
            password: string
            created_at: string
            updated_at: string
        }
    }
}