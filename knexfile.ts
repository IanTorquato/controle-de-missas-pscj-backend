import path from 'path'
import 'dotenv/config'
import { CreateTableBuilder } from 'knex'

import databaseConfig from './src/config/database'

module.exports = {
	...databaseConfig,
	migrations: {
		directory: path.resolve(__dirname, 'src', 'database', 'migrations')
	},
	seeds: {
		directory: path.resolve(__dirname, 'src', 'database', 'seeds')
	},
	onUpdateTrigger: (table: CreateTableBuilder) => {
		return `
			CREATE TRIGGER ${table}_updated_at
			AFTER UPDATE ON ${table}
			EXECUTE PROCEDURE update_timestamp();
		`
	}
}