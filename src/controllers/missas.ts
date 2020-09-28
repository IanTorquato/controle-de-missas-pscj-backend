import { Request, Response } from 'express'
import knex from '../database/connection'

class Missas {
	async create(request: Request, response: Response) {
		const { local_id, data, hora, max_pessoas } = request.body

		try {
			await knex('missas').insert({ local_id, data, hora, max_pessoas })

			return response.status(201).json({ mensagem: 'Missa criada com sucesso!' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar criar missa.', detalheErro: error })
		}
	}

	async index(request: Request, response: Response) {
		const { local_id, quantMissas, usuario_id } = request.query

		const localId = Number(local_id)
		const quantidadeMissas = Number(quantMissas)

		// Filtrar missas de um usuário
		if (usuario_id) {
			try {
				const missas =
					await knex('missas').join('missa_usuario', 'missas.id', '=', 'missa_usuario.missa_id')
						.select('missas.*', 'missa_usuario.quantidade_pessoas').where({ usuario_id }).orderBy(['data', 'hora'])

				if (!missas[0]) { return response.status(404).json({ erro: 'Ainda não há nenhum dado para ser listado.' }) }

				return response.json(missas)
			} catch (error) {
				return response.status(500).json({ erro: 'Erro na filtragem de missas pelo usuário!', detalheErro: error })
			}
		}

		// Filtrar missas por Local
		else if (localId) {
			try {
				const localExistente = await knex('locais').where({ id: local_id }).first()

				if (!localExistente) { return response.status(404).json({ erro: 'Este local não está cadastrado!' }) }

				const missasLocal = await knex('missas').where({ local_id }).orderBy(['data', 'hora'])

				if (!missasLocal[0]) { return response.status(404).json({ erro: 'Ainda não há nenhum dado para ser listado.' }) }

				return response.json(missasLocal)
			} catch (error) {
				return response.status(500).json({ erro: 'Erro na filtragem de missas pelo Local!', detalheErro: error })
			}
		}

		// Filtrar missas por quantidade
		else if (quantidadeMissas) {
			try {
				if (quantidadeMissas <= 0) { return response.status(400).json({ erro: 'Número de missas inválido!' }) }

				const missas = await knex('missas').orderBy(['data', 'hora'])

				if (!missas[0]) { return response.status(404).json({ erro: 'Ainda não há nenhum dado para ser listado.' }) }

				return response.json(missas.slice(0, quantidadeMissas))
			} catch (error) {
				return response.status(500).json({ erro: 'Erro na filtragem de missas por Quantidade!', detalheErro: error })
			}
		}

		// Listar todas as missas
		else {
			try {
				const missas = await knex('missas').orderBy(['data', 'hora'])

				if (!missas[0]) { return response.status(404).json({ erro: 'Ainda não há nenhum dado para ser listado.' }) }

				return response.json(missas)
			} catch (error) {
				return response.status(500).json({
					erro: 'Falha no servidor ao tentar listar as missas cadastradas!', detalheErro: error
				})
			}
		}
	}

	async show(request: Request, response: Response) {
		const { id } = request.params

		try {
			const missa = await knex('missas').where({ id }).first()

			if (!missa) { return response.status(404).json({ erro: 'Missa não encontrada!' }) }

			return response.json(missa)
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar listar uma única missa.', detalheErro: error })
		}
	}

	async update(request: Request, response: Response) {
		const { id } = request.params
		const { local_id, data, hora, max_pessoas } = request.body

		try {
			await knex('missas').where({ id }).update({ local_id, data, hora, max_pessoas })

			return response.json({ mensagem: 'Missa atualizada com sucesso!' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar atualizar missa.', detalheErro: error })
		}
	}

	async delete(request: Request, response: Response) {
		const { id } = request.params
		const trx = await knex.transaction()

		try {
			await trx('missa_usuario').where({ missa_id: id }).delete()
			const missaExcluida = await trx('missas').where({ id }).first().delete()

			await trx.commit()

			if (!missaExcluida) { return response.status(404).json({ erro: 'A missa que você deseja excluir não existe!' }) }

			return response.json({ mensagem: 'Missa deletada com sucesso!' })
		} catch (error) {
			await trx.rollback()

			return response.status(500).json({ erro: 'Falha no servidor ao tentar deletar missa.', detalheErro: error })
		}
	}
}

export default Missas