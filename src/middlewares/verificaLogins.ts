import { Request, Response, NextFunction } from 'express'

export default async (request: Request, response: Response, next: NextFunction) => {
  const { usuarioId, pascomId } = request

  if (!usuarioId && !pascomId) {
    return response.status(401).json({ erro: 'Você não tem permissão para acessar esta rota!' })
  }

  return next()
}
