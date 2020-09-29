import { Request, Response } from 'express'

import knex from '../database/connection'

class Usuarios {
	async create(request: Request, response: Response) {
		try {
			const { nome, email } = request.body

			const usuarioExistente = await knex('usuarios').where({ email }).first()

			if (usuarioExistente) { return response.status(409).json({ erro: 'Este e-mail já está em uso!' }) }

			await knex('usuarios').insert({ nome, email })

			return response.status(201).json({ mensagem: 'Usuário criado com sucesso!' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar criar usuário.', detalheErro: error })
		}
	}

	async loginUsuario(request: Request, response: Response) {
		try {
			const { nome, email } = request.body

			const usuario = await knex('usuarios').where({ nome, email }).first()

			if (usuario) {
				return response.json({ ...usuario, foto: `${process.env.URL_BANCO}/uploads/fotosPerfis/${usuario.foto}.jpg` })
			}

			const emailExistente = await knex('usuarios').where({ email }).first().select('email')

			if (emailExistente) {
				return response.status(400).json({ erro: 'Nome de usuário inválido! Confira a escrita e tente novamente.' })
			}

			return response.status(404).json({ erro: 'E-mail inválido! Certifique-se de ter feito o Cadastro com este e-mail.' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar logar.', detalheErro: error })
		}
	}

	async index(request: Request, response: Response) {
		try {
			const usuarios = await knex('usuarios')

			if (!usuarios[0]) { return response.status(404).json({ erro: 'Ainda não há nenhum dado para ser listado.' }) }

			const usuariosSerializados = usuarios.map(usuario => {
				return { ...usuario, foto: `${process.env.URL_BANCO}/uploads/fotosPerfis/${usuario.foto}.jpg` }
			})

			return response.json(usuariosSerializados)
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar listar usuários.', detalheErro: error })
		}
	}

	async update(request: Request, response: Response) {
		try {
			const { id } = request.params
			const { nome, email, foto = 0 } = request.body

			const usuarioExistente = await knex('usuarios').where({ email }).first()

			if (usuarioExistente && usuarioExistente.id !== +id) {
				return response.status(400).json({ erro: 'Este e-mail já está em uso!' })
			}

			await knex('usuarios').where({ id }).update({ nome, email, foto: Number(foto) })

			return response.json({ mensagem: 'Perfil atualizado com sucesso!' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar atualizar seu perfil.', detalheErro: error })
		}
	}
}

export default Usuarios