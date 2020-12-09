import Knex from 'knex'

export async function up(Knex: Knex) {
	return Knex.schema.createTable('missas', table => {
		table.increments()
		table.string('nome').notNullable()
		table.integer('local_id').notNullable().references('id').inTable('locais').onDelete('CASCADE').onUpdate('CASCADE')
		table.dateTime('data_hora', { useTz: false, precision: 0 }).notNullable()
	})
}

export async function down(Knex: Knex) {
	return Knex.schema.dropTable('missas')
}