import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import knex from '../database/connection'
import { expiresIn, segredo } from '../config/usuarioJWT'

class Sessao {
	async create(request: Request, response: Response) {
		try {
			const { nome, email } = request.body

			const usuario = await knex('usuarios').where({ nome, email }).first()

			if (!usuario) { return response.status(401).json({ erro: 'Verifique os dados e tente novamente!' }) }

			return response.json({
				usuario: { ...usuario, foto: `${process.env.URL_BANCO}/uploads/fotosPerfis/${usuario.foto}.jpg` },
				token: jwt.sign({ id: usuario.id }, segredo, { expiresIn })
			})
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar criar uma sessão.', detalheErro: error })
		}
	}
}

export default Sessao