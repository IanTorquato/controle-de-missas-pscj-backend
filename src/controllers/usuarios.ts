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
			return response.status(500).json({ erro: 'Falha no servidor ao tentar criar usuário.' })
		}
	}

	async loginUsuario(request: Request, response: Response) {
		try {
			const { nome, email } = request.body

			const usuario = await knex('usuarios').where({ nome, email }).first()

			if (usuario) {
				if (usuario.foto) {
					return response.json({ ...usuario, foto: `http://192.168.0.107:3333/uploads/fotosPerfis/${usuario.foto}` })
				}

				return response.json(usuario)
			}

			const emailExistente = await knex('usuarios').where({ email }).first().select('email')

			if (emailExistente) {
				return response.status(400).json({ erro: 'Nome de usuário inválido! Confira a escrita e tente novamente.' })
			}

			return response.status(404).json({ erro: 'E-mail inválido! Certifique-se de ter feito o Cadastro com este e-mail.' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar logar.' })
		}
	}

	async index(request: Request, response: Response) {
		try {
			const usuarios = await knex('usuarios')

			if (usuarios[0]) {
				const usuariosSerializados = usuarios.map(usuario => {
					if (usuario.foto) {
						return { ...usuario, foto: `http://192.168.0.107:3333/uploads/fotosPerfis/${usuario.foto}` }
					}

					return usuario
				})

				return response.json(usuariosSerializados)
			}

			return response.status(404).json({ erro: 'Ainda não há nenhum dado para ser listado.' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar listar usuários.' })
		}
	}

	async update(request: Request, response: Response) {
		try {
			const { id } = request.params
			const { nome, email } = request.body

			const usuarioExistente = await knex('usuarios').where({ email }).first()

			if (usuarioExistente && usuarioExistente.id !== +id) {
				return response.status(400).json({ erro: 'Este e-mail já está em uso!' })
			}

			await knex('usuarios').where({ id }).update({ nome, email })

			return response.json({ mensagem: 'Perfil atualizado com sucesso!' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar atualizar seu perfil.' })
		}
	}

	async updateFoto(request: Request, response: Response) {
		try {
			// Na primeira versão do app o usuário só poderá atualizar a imagem de perfil uma única vez
			// Esta verificação terá de ficar no aplicativo mobile, pois não há uma maneira de excluir fotos ainda

			const { id } = request.params

			if (!request.file) { return response.status(404).json({ erro: 'Você precisa enviar um arquivo de imagem!' }) }

			await knex('usuarios').where({ id }).update({ foto: request.file.filename })

			return response.json({ mensagem: 'Imagem atualizada com sucesso!' })
		} catch (error) {
			return response.status(500).json({ erro: 'Falha no servidor ao tentar atualizar sua foto de perfil.' })
		}
	}
}

export default Usuarios