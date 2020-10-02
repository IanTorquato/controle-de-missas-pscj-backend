import knex from 'knex'
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
		useNullAsDefault: true
	}
	: {
		client: 'sqlite3',
		connection: { filename: path.resolve(__dirname, 'database.sqlite'), },
		useNullAsDefault: true
	}

const connection = knex(configBanco)

export default connection