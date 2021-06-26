import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import knex from '../database/connection'
import { expiresIn, segredoPascom } from '../config/pascomJWT'

class LoginPascom {
  async create(request: Request, response: Response) {
    try {
      const { nome, senha } = request.body

      const pascom = await knex('pascom').where({ nome }).first()

      if (!pascom) { return response.status(404).json({ erro: 'Usuário Pascom não encontrado.' }) }

      if (!pascom || !(await bcrypt.compare(senha, pascom.senha))) {
        return response.status(400).json({ erro: 'Falha ao fazer login! Por favor, tente novamente.' })
      }

      return response.json({ token: jwt.sign({ id: pascom.id }, segredoPascom, { expiresIn }) })
    } catch (error) {
      return response.status(500).json({ erro: 'Falha no servidor ao tentar criar uma sessão.', detalheErro: error })
    }
  }
}

export default LoginPascom
