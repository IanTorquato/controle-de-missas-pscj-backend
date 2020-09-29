import Knex from 'knex'

export async function up(Knex: Knex) {
	return Knex.schema.createTable('usuarios', table => {
		table.increments('id').primary()
		table.integer('foto').notNullable().defaultTo(0)
		table.string('nome').notNullable()
		table.string('email').notNullable().unique()
	})
}

export async function down(Knex: Knex) {
	return Knex.schema.dropTable('usuarios')
}