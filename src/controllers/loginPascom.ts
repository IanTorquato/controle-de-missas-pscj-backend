import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

class LoginPascom {
  async loginPascom(request: Request, response: Response) {
    try {
      const user = { usuario: 'ian', senha: 'ian' }
      const { usuario, senha } = request.body

      const senhaEncriptada = bcrypt.hashSync(senha, 10)

      if (user.usuario === usuario && bcrypt.compareSync(user.senha, senhaEncriptada)) {
        return response.json({ user: { usuario, senha: senhaEncriptada } })
      }

      return response.status(400).json({ erro: 'Falha ao fazer login! Por favor, tente novamente.' })
    } catch (error) {
      return response.status(500).json({ erro: 'Falha no servidor ao tentar logar.' })
    }
  }
}

export default LoginPascom