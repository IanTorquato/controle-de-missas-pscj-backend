import path from 'path'
import 'dotenv/config'

const configBanco = process.env.PORT !== '3333'
	? {
		client: 'pg',
		connection: {
			host: process.env.PG_HOST,
			user: process.env.PG_USER,
			password: process.env.PG_PASSWORD,
			database: process.env.PG_DATABASE
		},
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'migrations')
		},
		seeds: {
			directory: path.resolve(__dirname, 'src', 'database', 'seeds')
		},
		useNullAsDefault: true
	}
	: {
		client: 'sqlite3',
		connection: {
			filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'),
		},
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'migrations')
		},
		seeds: {
			directory: path.resolve(__dirname, 'src', 'database', 'seeds')
		},
		useNullAsDefault: true
	}

module.exports = configBanco