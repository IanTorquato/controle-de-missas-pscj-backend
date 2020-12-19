import { Request, Response } from 'express'
import knex from '../database/connection'

class MissaUsuario {
	async create(request: Request, response: Response) {
		try {
			const { quantidade_pessoas } = request.body
			const { missa_id, usuario_id } = request.params

			const relacionamentoExistente = await knex('missa_usuario').where({ missa_id, usuario_id }).first()

			if (relacionamentoExistente) { return response.status(409).json({ erro: 'Você já está cadastrado nesta missa!' }) }

			await knex('missa_usuario').insert({ missa_id, usuario_id, quantidade_pessoas })

			return response.status(201).json({ mensagem: 'Você foi contabilizado com sucesso!!' })
		} catch (error) {
			return response.status(500).json({
				erro: 'Falha no servidor ao tentar criar o relacionamento missa-usuario.', detalheErro: error
			})
		}
	}

	async index(request: Request, response: Response) {
		try {
			const missaUsuario = await knex('missa_usuario')

			if (!missaUsuario[0]) { return response.status(404).json({ erro: 'Ainda não há nenhum dado para ser listado.' }) }

			return response.json(missaUsuario)
		} catch (error) {
			return response.status(500).json({
				erro: 'Falha no servidor ao tentar listar o relacionamento missa-usuario.', detalheErro: error
			})
		}
	}

	async update(request: Request, response: Response) {
		try {
			const { quantidade_pessoas } = request.body
			const { missa_id, usuario_id } = request.params

			const relacionamento = await knex('missa_usuario').where({ missa_id, usuario_id }).update({ quantidade_pessoas })

			if (!relacionamento) { return response.status(404).json({ erro: 'Este relacionamento não existe.' }) }

			return response.json({ mensagem: 'Quantidade atualizada com sucesso!' })
		} catch (error) {
			return response.status(500).json({
				erro: 'Falha no servidor ao tentar atualizar a quantidade de pessoas!', detalheErro: error
			})
		}
	}

	async delete(request: Request, response: Response) {
		try {
			const { missa_id, usuario_id } = request.params

			const relacionamento = await knex('missa_usuario').where({ missa_id, usuario_id }).first().delete()

			if (!relacionamento) { return response.status(404).json({ erro: 'Este relacionamento não existe.' }) }

			return response.json({ mensagem: 'Você não está mais cadastrado nesta missa!' })
		} catch (error) {
			return response.status(500).json({
				erro: 'Falha no servidor ao tentar deletar o relacionamento usuário/missa', detalheErro: error
			})
		}
	}
}

export default MissaUsuario