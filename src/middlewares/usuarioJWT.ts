import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { segredo } from '../config/usuarioJWT'

interface PromisifyJWT {
	id: string
}

export default async (request: Request, response: Response, next: NextFunction) => {
	const tokenUsuario = request.headers.authorization

	if (!tokenUsuario) { return response.status(401).json({ erro: 'Token de verificação não enviado!' }) }

	const [, token] = tokenUsuario.split(' ')

	try {
		const tokenDecodificado = verify(token, segredo) as PromisifyJWT

		request.usuarioId = tokenDecodificado.id

		return next()
	} catch (error) {
		return response.status(401).json({ erro: 'Token inválido!' })
	}
}