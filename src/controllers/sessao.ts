import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import knex from '../database/connection'

class Sessao {
	async create(request: Request, response: Response) {
		try {
			const { nome, email } = request.body

			const usuarioValidado = await knex('usuarios').where({ nome, email }).first()

			if (!usuarioValidado) { return response.status(401).json({ erro: 'Verifique os dados e tente novamente!' }) }

			const { id } = usuarioValidado

			return response.json({
				usuario: { id, nome, email }, token: jwt.sign({ id }, '1bddf7b0f0be05c996fc53dd4e6717fc', { expiresIn: '7d' })
			})
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar listar locais.', detalheErro: error })
		}
	}
}

export default Sessao