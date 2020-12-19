import express from 'express'

import verificaLoginUsuario from './middlewares/usuarioLoginJWT'
import verificaLoginPascom from './middlewares/pascomLoginJWT'
import verificaLogins from './middlewares/verificaLogins'

import Pascom from './controllers/pascom'
import Locais from './controllers/locais'
import Missas from './controllers/missas'
import Usuarios from './controllers/usuarios'
import MissaUsuario from './controllers/missaUsuario'
import LoginUsuario from './controllers/loginUsuario'
import LoginPascom from './controllers/loginPascom'

const pascom = new Pascom()
const locais = new Locais()
const missas = new Missas()
const usuarios = new Usuarios()
const missaUsuario = new MissaUsuario()
const loginUsuario = new LoginUsuario()
const loginPascom = new LoginPascom()

const routes = express.Router()

// -------->> Rotas que não precisam de autenticação: <<--------

// Criação de Usuário e Pascom
routes.post('/usuarios', usuarios.create)
routes.post('/pascom', pascom.create)

// Logins
routes.post('/login_usuario', loginUsuario.create)
routes.post('/login_pascom', loginPascom.create)

// Listagem de Locais
routes.get('/locais', locais.index)

// -------->> Rotas que precisam de autenticação: <<--------

// Missas
routes.post('/missas', verificaLoginPascom, verificaLogins, missas.create)
routes.get('/missas', verificaLoginUsuario, verificaLoginPascom, verificaLogins, missas.index)
routes.put('/missas/:id', verificaLoginPascom, verificaLogins, missas.update)
routes.delete('/missas/:id', verificaLoginPascom, verificaLogins, missas.delete)

// Usuários
routes.get('/usuarios', verificaLoginPascom, verificaLogins, usuarios.index)
routes.put('/usuarios', verificaLoginUsuario, verificaLogins, usuarios.update)

// Missa_Usuário
routes.post('/missa_usuario/:missa_id/:usuario_id', verificaLoginUsuario, verificaLogins, missaUsuario.create)
routes.get('/missa_usuario', verificaLoginPascom, verificaLogins, missaUsuario.index)
routes.put('/missa_usuario/:missa_id/:usuario_id', verificaLoginUsuario, verificaLogins, missaUsuario.update)
routes.delete('/missa_usuario/:missa_id/:usuario_id', verificaLoginUsuario,
	verificaLogins, missaUsuario.delete)

export default routes