import { Request, Response } from 'express'
import knex from '../database/connection'

class MissaUsuario {
	async create(request: Request, response: Response) {
		const trx = await knex.transaction()

		try {
			const { quantidade_pessoas, quantidade_pessoas_atual } = request.body
			const { missa_id, usuario_id } = request.params

			const relacionamentoExistente = await trx('missa_usuario').where({ missa_id, usuario_id }).first()

			if (relacionamentoExistente) {
				return response.status(409).json({
					erro: 'Você já está cadastrado nesta missa! Se deseja alterar a quantidade de pessoas, vá até "Perfil".'
				})
			}

			const pessoas_cadastradas = quantidade_pessoas_atual + quantidade_pessoas

			await trx('missa_usuario').insert({ missa_id, usuario_id, quantidade_pessoas })
			await trx('missas').where({ id: missa_id }).update({ pessoas_cadastradas })

			await trx.commit()

			return response.status(201).json({ mensagem: 'Você foi contabilizado com sucesso!!' })
		} catch (error) {
			await trx.rollback()

			return response.status(500).json({
				erro: 'Falha no servidor ao tentar criar o relacionamento missa-usuario.', detalheErro: error
			})
		}
	}

	async index(request: Request, response: Response) {
		try {
			const missaUsuario = await knex('missa_usuario')

			if (missaUsuario[0]) { return response.json(missaUsuario) }

			return response.status(404).json({ erro: 'Ainda não há nenhum dado para ser listado.' })
		} catch (error) {
			return response.status(500).json({
				erro: 'Falha no servidor ao tentar listar o relacionamento missa-usuario.', detalheErro: error
			})
		}
	}

	async update(request: Request, response: Response) {
		const trx = await knex.transaction()

		try {
			const { quantidade_pessoas_antes, quantidade_pessoas, quantidade_pessoas_atual } = request.body
			const { missa_id, usuario_id } = request.params

			const pessoas_cadastradas = quantidade_pessoas_atual - quantidade_pessoas_antes + quantidade_pessoas

			await trx('missa_usuario').where({ missa_id, usuario_id }).update({ quantidade_pessoas })
			await trx('missas').where({ id: missa_id }).update({ pessoas_cadastradas })

			await trx.commit()

			return response.json({ mensagem: 'Quantidade atualizada com sucesso!' })
		} catch (error) {
			await trx.rollback()

			return response.status(500).json({
				erro: 'Falha no servidor ao tentar atualizar a quantidade de pessoas na missa!', detalheErro: error
			})
		}
	}

	async delete(request: Request, response: Response) {
		const trx = await knex.transaction()

		try {
			const { quantidade_pessoas_remover, quantidade_pessoas_atual } = request.body
			const { missa_id, usuario_id } = request.params

			const quantidade_pessoas = quantidade_pessoas_atual - quantidade_pessoas_remover

			await trx('missa_usuario').where({ missa_id, usuario_id }).first().delete()
			await trx('missas').where({ id: missa_id }).update({ quantidade_pessoas })

			await trx.commit()

			return response.json({ mensagem: 'Você não está mais cadastrado nesta missa!' })
		} catch (error) {
			await trx.rollback()

			return response.status(500).json({
				erro: 'Falha no servidor ao tentar deletar o relacionamento usuário/missa', detalheErro: error
			})
		}
	}
}

export default MissaUsuario