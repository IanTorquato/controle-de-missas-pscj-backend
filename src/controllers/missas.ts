import { Request, Response } from 'express'

import knex from '../database/connection'
import { urlImagemLocal } from '../utils/urlImagemLocal'

interface FuncoesListarMissas {
  usuario_id(usuario_id: number, response: Response): Promise<void>
  local_id(local_id: number, response: Response): Promise<void>
  quantidade_missas(quantidadeMissas: number, response: Response): Promise<void>
  missa_id(missa_id: number, response: Response): Promise<void>
  missa_id_usuarios(missa_id_usuarios: number, response: Response): Promise<void>
}

async function listarMissas(response: Response) {
  try {
    const missas = await knex('missas').join('locais', 'missas.local_id', '=', 'locais.id')
      .select('missas.*', 'locais.nome as local_nome', 'locais.imagem as local_url').orderBy(['data_hora'])

    if (!missas[0]) { return response.status(404).json({ erro: 'Ish! Não há missas cadastradas ainda...' }) }

    return response.json(urlImagemLocal(missas))
  } catch (error) {
    return response.status(500).json({
      erro: 'Falha no servidor ao tentar listar as missas cadastradas!', detalheErro: error
    })
  }
}

const listagensTabelaMissas = {
  // listar missas em que um usuário está cadastrado
  async usuario_id(usuario_id: number, response: Response) {
    console.log('usuario_id')

    try {
      const missas = await knex('missas')
        .join('missa_usuario', 'missas.id', '=', 'missa_usuario.missa_id')
        .join('locais', 'missas.local_id', '=', 'locais.id')
        .select('missas.*', 'locais.nome as local_nome', 'locais.imagem as local_url', 'missa_usuario.quantidade_pessoas')
        .where({ usuario_id }).orderBy(['data_hora'])

      if (!missas[0]) { return response.status(404).json({ erro: 'Ish! Você não está cadastrado em nenhuma missa...' }) }

      return response.json(urlImagemLocal(missas))
    } catch (error) {
      return response.status(500).json({ erro: 'Erro na filtragem de missas pelo usuário!', detalheErro: error })
    }
  },
  // listar missas por local
  async local_id(local_id: number, response: Response) {
    console.log('local_id')

    try {
      const localExistente = await knex('locais').where({ id: local_id }).first()

      if (!localExistente) { return response.status(404).json({ erro: 'Este local não está cadastrado!' }) }

      const missasLocal = await knex('missas')
        .join('locais', 'missas.local_id', '=', 'locais.id')
        .select('missas.*', 'locais.nome as local_nome', 'locais.imagem as local_url')
        .where({ local_id }).orderBy(['data_hora'])

      if (!missasLocal[0]) { return response.status(404).json({ erro: 'Ish! Não há missas cadastradas ainda...' }) }

      return response.json(urlImagemLocal(missasLocal))
    } catch (error) {
      return response.status(500).json({ erro: 'Erro na filtragem de missas pelo Local!', detalheErro: error })
    }
  },
  // listar missas por quantidade
  async quantidade_missas(quantidadeMissas: number, response: Response) {
    console.log('quantMissas')

    try {
      if (quantidadeMissas <= 0) { return response.status(400).json({ erro: 'Número de missas inválido!' }) }

      const missas = await knex('missas').join('locais', 'missas.local_id', '=', 'locais.id')
        .select('missas.*', 'locais.nome as local_nome', 'locais.imagem as local_url').orderBy(['data_hora'])

      if (!missas[0]) { return response.status(404).json({ erro: 'Ish! Não há missas cadastradas ainda...' }) }

      return response.json(urlImagemLocal(missas.slice(0, quantidadeMissas)))
    } catch (error) {
      return response.status(500).json({ erro: 'Erro na filtragem de missas por Quantidade!', detalheErro: error })
    }
  },
  // listarUmaMissa
  async missa_id(missa_id: number, response: Response) {
    console.log('missa_id')

    try {
      const missa = await knex('missas').join('locais', 'missas.local_id', '=', 'locais.id')
        .select('missas.*', 'locais.nome as local_nome', 'locais.imagem as local_url')
        .where('missas.id', '=', `${missa_id}`).first()

      if (!missa) { return response.status(404).json({ erro: 'Missa não encontrada!' }) }

      return response.json(urlImagemLocal([missa]))
    } catch (error) {
      return response.status(500).json({ erro: 'Falha no servidor ao tentar listar uma única missa.', detalheErro: error })
    }
  },
  // listar única missa com todos os usuário cadastrados
  async missa_id_usuarios(missa_id_usuarios: number, response: Response) {
    console.log('missa_id_usuarios')

    const trx = await knex.transaction()

    try {
      const missa = await trx('missas').join('locais', 'missas.local_id', '=', 'locais.id')
        .select('missas.*', 'locais.nome as local_nome', 'locais.imagem as local_url')
        .where('missas.id', '=', `${missa_id_usuarios}`).first()

      if (!missa) {
        trx.commit()
        return response.status(404).json({ erro: 'Missa não encontrada.' })
      }

      const missaLocalUrl = urlImagemLocal([missa])

      const usuarios = await trx('usuarios')
        .join('missa_usuario', 'usuarios.id', '=', 'missa_usuario.usuario_id')
        .andWhere('missa_usuario.missa_id', '=', `${missa_id_usuarios}`)
        .select('usuarios.id', 'usuarios.nome', 'usuarios.foto', 'missa_usuario.quantidade_pessoas')

      trx.commit()

      if (!usuarios[0]) {
        return response.json({ missaLocalUrl })
      }

      const usuariosSerializados = usuarios.map(usuario => {
        return { ...usuario, foto: `${process.env.URL_BANCO}/uploads/fotosPerfis/${usuario.foto}.png` }
      })

      return response.json({ missaLocalUrl, usuarios: usuariosSerializados })
    } catch (error) {
      trx.rollback()
      console.log(error)
      return response.status(500).json({ erro: 'Erro na listagem de única missa e seus usuários!', detalheErro: error })
    }
  }
}

class Missas {
  async create(request: Request, response: Response) {
    const { nome, local_id, data_hora, max_pessoas } = request.body

    try {
      await knex('missas').insert({ nome, local_id, data_hora, max_pessoas })

      return response.status(201).json({ mensagem: 'Missa criada com sucesso!' })
    } catch (error) {
      return response.status(500).json({ erro: 'Falha no servidor ao tentar criar missa.', detalheErro: error })
    }
  }

  async index(request: Request, response: Response) {
    const chaveParametro = Object.keys(request.query)[0] as keyof FuncoesListarMissas
    const valorParametro = Object.values(request.query)[0]

    if (chaveParametro) {
      if (valorParametro && Number.isInteger(+valorParametro) && +valorParametro > 0) {
        const listarMissasFiltradas = listagensTabelaMissas[chaveParametro]

        return !!listarMissasFiltradas ? listarMissasFiltradas(+valorParametro, response) : (
          response.status(400).json({ erro: `A listagem pelo parâmetro '${chaveParametro}' não existente.` })
        )
      }

      return response.status(400).json({ erro: `O valor passado está vazio ou não é um número natual.` })
    }

    listarMissas(response)
  }

  async update(request: Request, response: Response) {
    const { id } = request.params
    const { nome, local_id, data_hora, max_pessoas } = request.body

    try {
      await knex('missas').where({ id }).update({ nome, local_id, data_hora, max_pessoas })

      return response.json({ mensagem: 'Missa atualizada com sucesso!' })
    } catch (error) {
      return response.status(500).json({ erro: 'Falha no servidor ao tentar atualizar missa.', detalheErro: error })
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params

    try {
      const missaExcluida = await knex('missas').where({ id }).first().delete()

      if (!missaExcluida) { return response.status(404).json({ erro: 'A missa que você deseja excluir não existe!' }) }

      return response.json({ mensagem: 'Missa deletada com sucesso!' })
    } catch (error) {
      return response.status(500).json({ erro: 'Falha no servidor ao tentar deletar missa.', detalheErro: error })
    }
  }
}

export default Missas
