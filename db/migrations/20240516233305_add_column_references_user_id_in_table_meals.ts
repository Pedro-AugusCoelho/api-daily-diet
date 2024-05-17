import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('meals', function(table) {
        table.foreign('user_id').references('id').inTable('users')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('meals', function(table) {
        table.dropForeign('user_id');
    })
}

