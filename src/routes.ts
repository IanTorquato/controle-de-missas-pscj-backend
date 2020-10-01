import express from 'express'

import verificaToken from './middlewares/usuarioJWT'
import Pascom from './controllers/pascom'
import Locais from './controllers/locais'
import Missas from './controllers/missas'
import Usuarios from './controllers/usuarios'
import MissaUsuario from './controllers/missa_usuario'
import Sessao from './controllers/loginUsuario'

const pascom = new Pascom()
const locais = new Locais()
const missas = new Missas()
const usuarios = new Usuarios()
const missaUsuario = new MissaUsuario()
const sessao = new Sessao()

const routes = express.Router()

// Pascom
routes.post('/pascom', pascom.create)
routes.post('/pascom/login', pascom.loginPascom)

// Locais
routes.get('/locais', verificaToken, locais.index)

// Missas
routes.post('/missas', missas.create)
routes.get('/missas', missas.index)
routes.get('/missas/:id', missas.show)
routes.put('/missas/:id', missas.update)
routes.delete('/missas/:id', missas.delete)

// Usuários
routes.post('/usuarios', usuarios.create)
routes.post('/usuarios/login', usuarios.loginUsuario)
routes.get('/usuarios', usuarios.index)
routes.put('/usuarios/:id', usuarios.update)

// Missa_Usuário
routes.post('/missa_usuario/:missa_id/:usuario_id', missaUsuario.create)
routes.get('/missa_usuario', missaUsuario.index)
routes.put('/missa_usuario/:missa_id/:usuario_id', missaUsuario.update)
routes.delete('/missa_usuario/:missa_id/:usuario_id/:quant_pessoas_remover/:quant_pessoas_atual', missaUsuario.delete)

// Sessão
routes.post('/sessao', sessao.create)

export default routes