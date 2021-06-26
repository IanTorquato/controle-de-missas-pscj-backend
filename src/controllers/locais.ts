import { Request, Response } from 'express'

import knex from '../database/connection'

class Locais {
  async index(request: Request, response: Response) {
    try {
      const locais = await knex('locais').select('*')

      if (!locais[0]) { return response.status(404).json({ erro: 'Ainda não há nenhum local para ser listado.' }) }

      const locaisSerializados = locais.map(local => ({
        ...local, imagem: `${process.env.URL_BANCO}/uploads/fotosLocais/${local.imagem}`
      }))

      return response.json(locaisSerializados)
    } catch (error) {
      return response.status(500).json({ erro: 'Falha no servidor ao tentar listar locais.', detalheErro: error })
    }
  }
}

export default Locais
