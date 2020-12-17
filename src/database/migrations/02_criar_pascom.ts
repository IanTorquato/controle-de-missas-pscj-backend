import Knex from 'knex'

export async function up(Knex: Knex) {
  return Knex.schema.createTable('pascom', table => {
    table.increments()
    table.string('nome').notNullable().unique()
    table.string('senha').notNullable()
  })
}

export async function down(Knex: Knex) {
  return Knex.schema.dropTable('pascom')
}