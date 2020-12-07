import path from 'path'

import databaseConfig from './src/config/database'

module.exports = {
	...databaseConfig,
	migrations: {
		directory: path.resolve(__dirname, 'src', 'database', 'migrations')
	},
	seeds: {
		directory: path.resolve(__dirname, 'src', 'database', 'seeds')
	}
}