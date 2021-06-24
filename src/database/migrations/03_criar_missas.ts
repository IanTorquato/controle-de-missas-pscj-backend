import Knex from 'knex'

export async function up(Knex: Knex) {
	return Knex.schema.createTable('missas', table => {
		table.increments()
		table.string('nome').notNullable()
		table.integer('local_id').notNullable().references('id').inTable('locais').onDelete('CASCADE').onUpdate('CASCADE')
		table.timestamp('data_hora', { precision: 0 }).notNullable()
		table.integer('max_pessoas').notNullable()
		table.integer('pessoas_cadastradas').notNullable().defaultTo(0)
	})
}

export async function down(Knex: Knex) {
	return Knex.schema.dropTable('missas')
}