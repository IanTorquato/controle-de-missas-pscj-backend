import Knex from 'knex'

export async function seed(Knex: Knex) {
	await Knex('locais').insert([
		{ nome: 'Centro', imagem: 'igrejaCentro.png' },
		{ nome: 'Termas', imagem: 'igrejaTermas.png' }
	])
}