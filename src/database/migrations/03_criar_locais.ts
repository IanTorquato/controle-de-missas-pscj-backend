import Knex from 'knex'

export async function up(Knex: Knex) {
	return Knex.schema.createTable('locais', table => {
		table.increments('id').primary()
		table.string('nome').notNullable()
		table.string('imagem').notNullable()
	})
}

export async function down(Knex: Knex) {
	return Knex.schema.dropTable('locais')
}