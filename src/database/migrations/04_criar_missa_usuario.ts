import Knex from 'knex'

export async function up(Knex: Knex) {
	await Knex.raw(`
		CREATE OR REPLACE FUNCTION total_pessoas_cadastradas() RETURNS trigger AS $$
		
		DECLARE
			soma_quantidade_pessoas integer;
				
		BEGIN
			IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
				soma_quantidade_pessoas = SUM(quantidade_pessoas) FROM missa_usuario WHERE missa_id = NEW.missa_id;			
				
				UPDATE missas SET pessoas_cadastradas = soma_quantidade_pessoas WHERE id = NEW.missa_id;
				RETURN NEW;
			ELSIF (TG_OP = 'DELETE') THEN
				soma_quantidade_pessoas = SUM(quantidade_pessoas) FROM missa_usuario WHERE missa_id = OLD.missa_id;		
				
				IF (soma_quantidade_pessoas IS NULL) THEN soma_quantidade_pessoas = 0; END IF;
				
				UPDATE missas SET pessoas_cadastradas = soma_quantidade_pessoas WHERE id = OLD.missa_id;
				
				RETURN OLD;
		 	END IF;
		END;
		
		$$ language 'plpgsql';
	`)

	return Knex.schema.createTable('missa_usuario', table => {
		table.increments()
		table.integer('missa_id').notNullable().references('id').inTable('missas').onDelete('CASCADE')
		table.integer('usuario_id').notNullable().references('id').inTable('usuarios').onDelete('CASCADE')
		table.integer('quantidade_pessoas').notNullable()
	}).then(() => Knex.raw(`
		CREATE TRIGGER missas_pessoas_cadastradas AFTER INSERT OR UPDATE OR DELETE ON missa_usuario FOR EACH ROW
		EXECUTE PROCEDURE total_pessoas_cadastradas();
	`))
}

//	BEGIN
//	 	IF (TG_OP = 'DELETE') THEN
//	  	INSERT INTO emp_audit SELECT 'D', now(), user, OLD.*;
//	  	RETURN OLD;
//	 	ELSIF (TG_OP = 'UPDATE') THEN
//	  	INSERT INTO emp_audit SELECT 'U', now(), user, NEW.*;
//	  	RETURN NEW;
//	 	ELSIF (TG_OP = 'INSERT') THEN
//	  	INSERT INTO emp_audit SELECT 'I', now(), user, NEW.*;
//	  	RETURN NEW;
//	 	END IF;
//	 	RETURN NULL; -- result is ignored since this is an AFTER trigger
//	END;

export async function down(Knex: Knex) {
	return Knex.schema.dropTable('missa_usuario')
}