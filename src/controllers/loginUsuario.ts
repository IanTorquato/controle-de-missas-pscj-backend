import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import knex from '../database/connection'
import { expiresIn, segredoUsuario } from '../config/usuarioJWT'

class LoginUsuario {
	async create(request: Request, response: Response) {
		try {
			const { nome, email } = request.body

			const usuario = await knex('usuarios').where({ email }).first()

			if (!usuario) { return response.status(404).json({ erro: 'Usuário não encontrado.' }) }

			if (!usuario || usuario.nome !== nome) {
				return response.status(401).json({ erro: 'Falha ao fazer login! Por favor, tente novamente.' })
			}

			return response.json({
				usuario: { ...usuario, foto: `${process.env.URL_BANCO}/uploads/fotosPerfis/${usuario.foto}.png` },
				token: jwt.sign({ id: usuario.id }, segredoUsuario, { expiresIn })
			})
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar criar uma sessão.', detalheErro: error })
		}
	}
}

export default LoginUsuario