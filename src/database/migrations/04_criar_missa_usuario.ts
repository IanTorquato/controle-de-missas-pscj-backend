import Knex from 'knex'

export async function up(Knex: Knex) {
	await Knex.raw(`
		CREATE OR REPLACE FUNCTION total_pessoas_cadastradas()
		RETURNS trigger AS $$
		
		DECLARE
			missas missas;
			soma_quantidade_pessoas integer;
				
		BEGIN
			soma_quantidade_pessoas = SUM(quantidade_pessoas) FROM missa_usuario WHERE NEW.missa_id = missas.id;
		
			UPDATE missas SET pessoas_cadastradas = soma_quantidade_pessoas;
			RETURN NEW;
		END;
		
		$$ language 'plpgsql';
	`)

	return Knex.schema.createTable('missa_usuario', table => {
		table.increments()
		table.integer('missa_id').notNullable().references('id').inTable('missas').onDelete('CASCADE')
		table.integer('usuario_id').notNullable().references('id').inTable('usuarios').onDelete('CASCADE')
		table.integer('quantidade_pessoas').notNullable()
	}).then(() => Knex.raw(`
		CREATE TRIGGER missas_pessoas_cadastradas
		AFTER INSERT ON missa_usuario
		EXECUTE PROCEDURE total_pessoas_cadastradas();
	`))
}

export async function down(Knex: Knex) {
	return Knex.schema.dropTable('missa_usuario')
}