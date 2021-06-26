import Knex from 'knex'

const { onUpdateTrigger } = require('../../../knexfile')

export async function up(Knex: Knex) {
  return Knex.schema.createTable('pascom', table => {
    table.increments()
    table.string('nome').notNullable().unique()
    table.string('senha').notNullable()
    table.timestamp('created_at', { precision: 0 }).defaultTo(Knex.fn.now(0))
    table.timestamp('updated_at', { precision: 0 }).defaultTo(Knex.fn.now(0))
  }).then(() => Knex.raw(onUpdateTrigger('pascom')))
}

export async function down(Knex: Knex) {
  return Knex.schema.dropTable('pascom')
}
