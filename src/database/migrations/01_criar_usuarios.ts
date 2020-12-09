import Knex from 'knex'

export async function up(Knex: Knex) {
	return Knex.schema.createTable('usuarios', table => {
		table.increments()
		table.integer('foto').notNullable().defaultTo(0)
		table.string('nome').notNullable()
		table.string('email').notNullable().unique()
		table.timestamp('created_at', { precision: 0 }).defaultTo(Knex.fn.now(0))
		table.timestamp('updated_at', { precision: 0 }).defaultTo(Knex.fn.now(0))
	})
}

export async function down(Knex: Knex) {
	return Knex.schema.dropTable('usuarios')
}