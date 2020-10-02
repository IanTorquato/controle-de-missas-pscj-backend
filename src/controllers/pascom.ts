import { Request, Response } from 'express'
import knex from '../database/connection'
import bcrypt from 'bcrypt'

class Pascom {
  async create(request: Request, response: Response) {
    try {
      const { nome, senha } = request.body

      const usuarioExistente = await knex('pascom').where({ nome }).first()

      if (usuarioExistente) { return response.status(404).json({ erro: 'Este nome já está em uso!' }) }

      const senhaEncriptada = await bcrypt.hash(senha, 10)

      await knex('pascom').insert({ nome, senha: senhaEncriptada })

      return response.status(201).json({ mensagem: 'Usuário criado com sucesso!' })
    } catch (error) {
      return response.status(500).json({ erro: 'Falha no servidor ao tentar criar o usuário da Pascom!', detalheErro: error })
    }
  }
}

export default Pascom