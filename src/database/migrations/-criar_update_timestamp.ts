import Knex from 'knex'

export async function up(Knex: Knex) {
	return Knex.raw(`
		CREATE OR REPLACE FUNCTION update_timestamp()
		RETURNS trigger AS $$
		
		BEGIN
			NEW.updated_at = date_trunc('seconds', now());
			RETURN NEW;
		END;
		
		$$ language 'plpgsql';
	`)
}

export async function down(Knex: Knex) {
	return Knex.raw(`DROP FUNCTION update_timestamp`)
}