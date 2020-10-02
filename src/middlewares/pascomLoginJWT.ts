import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { segredoPascom } from '../config/pascomJWT'

interface verifyJWT {
	id: number | undefined
}

export default async (request: Request, response: Response, next: NextFunction) => {
	const tokenPascom = request.headers.authorization

	if (!tokenPascom) { return response.status(401).json({ erro: 'Token de verificação não enviado!' }) }

	const [, token] = tokenPascom.split(' ')

	try {
		const tokenDecodificado = verify(token, segredoPascom) as verifyJWT

		request.pascomId = tokenDecodificado.id

		return next()
	} catch (error) {
		return next()
	}
}