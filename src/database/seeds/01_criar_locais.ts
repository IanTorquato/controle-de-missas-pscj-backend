import Knex from 'knex'

export async function seed(Knex: Knex) {
	await Knex('locais').insert([
		{ nome: 'Centro', imagem: 'igrejaCentro.jpg' },
		{ nome: 'Termas', imagem: 'igrejaTermas.jpg' },
		{ nome: 'Pouso Alto', imagem: 'igrejaPousoAlto.jpg' },
		{ nome: 'Bela Vista I', imagem: 'igrejaBelaVistaI.jpg' },
		{ nome: 'Bela Vista II', imagem: 'igrejaBelaVistaII.jpg' },
		{ nome: 'São Miguel', imagem: 'igrejaSaoMiguel.jpg' },
		{ nome: 'São Sebastião', imagem: 'igrejaSaoSebastiao.jpg' },
		{ nome: 'Várzea', imagem: 'igrejaVarzea.jpg' },
		{ nome: 'Baixadinha', imagem: 'igrejaBaixadinha.jpg' },
		{ nome: 'Ângulo', imagem: 'igrejaAngulo.jpg' },
		{ nome: 'Santo Expedito', imagem: 'igrejaSantoExpedito.jpg' },
		{ nome: 'Sertão dos Medeiros', imagem: 'igrejaSertaoDosMedeiros.jpg' },
		{ nome: 'Indaial', imagem: 'igrejaIndaial.jpg' },
		{ nome: 'Gruta São Miguel', imagem: 'grutaSaoMiguel.jpg' },
		{ nome: 'Gruta Riacho', imagem: 'grutaRiacho.jpg' },
		{ nome: 'Gruta Caeté', imagem: 'grutaCaete.jpg' },
		{ nome: 'Gruta Baixadinha', imagem: 'grutaBaixadinha.jpg' },
		{ nome: 'Gruta Centro', imagem: 'grutaCentro.jpg' },
	])
}