import express from 'express'
import path from 'path'
import cors from 'cors'
import 'dotenv/config'

import routes from './routes'

const app = express()

app.use(express.json())

app.use(cors())

app.use(routes)

const localUploads = process.env.PORT !== '3333'
	? express.static(path.resolve(__dirname, '..', '..', 'src', 'uploads'))
	: express.static(path.resolve(__dirname, 'uploads'))

app.use('/uploads', localUploads)

console.debug(
	process.env.PG_HOST, '<-->',
	process.env.PG_USER, '<-->',
	process.env.PG_PASSWORD, '<-->',
	process.env.PG_DATABASE, '<-->',
	process.env.PORT, '<-->',
	process.env.URL_BANCO
)

app.listen(process.env.PORT, () => console.log(`--> Servidor rodando na porta ${process.env.PORT} <--`))