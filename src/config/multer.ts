import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

export default {
	storage: multer.diskStorage({
		destination: path.resolve(__dirname, '..', '..', 'uploads', 'fotosPerfis'),
		// Função para mudar o nome dos arquivos que o usuário envia
		filename(request, file, callback) {
			// request: Recebe o arquivo e outros dados vindos do front
			// file: Recebe dados do arquivo (tamanho, nome, extensão, etc)
			// callback: Função chamada após o termino das operações

			const hash = crypto.randomBytes(4).toString('hex')

			const nomeFinal = `${hash}-${file.originalname}`

			// Função que envia, caso aja, um erro (null) e o nome do arquivo
			callback(null, nomeFinal)
		}
	})
}