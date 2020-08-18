import { Request, Response } from 'express'
import knex from '../database/connection'

class Locais {
	async index(request: Request, response: Response) {
		try {
			const locais = await knex('locais').select('*')

			if (locais[0]) {
				const locaisSerializados = locais.map(local => ({
					id: local.id, nome: local.nome, imagem_url: `http://192.168.0.107:3333/uploads/fotosLocais/${local.imagem}`
				}))

				return response.json(locaisSerializados)
			}

			return response.status(404).json({ erro: 'Ainda não há nenhum dado para ser listado.' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar listar locais.' })
		}
	}
}

export default Locais