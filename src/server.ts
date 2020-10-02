import express from 'express'
import path from 'path'
import cors from 'cors'

import routes from './routes'

const app = express()

app.use(express.json())

app.use(cors())

app.use(routes)

const localUploads = process.env.PORT !== '3333'
	? express.static(path.resolve(__dirname, '..', '..', 'src', 'uploads'))
	: express.static(path.resolve(__dirname, 'uploads'))

app.use('/uploads', localUploads)

app.listen(process.env.PORT)