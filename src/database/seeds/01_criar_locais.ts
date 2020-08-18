import Knex from 'knex'

export async function seed(Knex: Knex) {
	await Knex('locais').insert([
		{ nome: 'Centro', imagem: 'igrejaCentro.png' },
		{ nome: 'Termas', imagem: 'igrejaTermas.png' }
	])

	await Knex('missas').insert([
		{ id: 1, local_id: 1, data: "2021/08/01", hora: "13:00", max_pessoas: 200, pessoas_cadastradas: 150 },
		{ id: 2, local_id: 2, data: "2021/08/02", hora: "14:00", max_pessoas: 400, pessoas_cadastradas: 350 },
		{ id: 3, local_id: 1, data: "2021/08/03", hora: "15:00", max_pessoas: 800, pessoas_cadastradas: 250 },
		{ id: 4, local_id: 2, data: "2021/08/04", hora: "16:00", max_pessoas: 1600, pessoas_cadastradas: 300 }
	])

	await Knex('usuarios').insert([
		{ id: 1, nome: "Ian Torquato", email: "iantorquato2@gmail.com" },
		{ id: 2, nome: "Ian Torquato", email: "iantorquato3@gmail.com" }
	])

	await Knex('missa_usuario').insert([
		{ id: 1, missa_id: 1, usuario_id: 1, quantidade_pessoas: 50 },
		{ id: 2, missa_id: 1, usuario_id: 2, quantidade_pessoas: 100 },
		{ id: 3, missa_id: 2, usuario_id: 1, quantidade_pessoas: 150 },
		{ id: 4, missa_id: 2, usuario_id: 2, quantidade_pessoas: 200 },
		{ id: 5, missa_id: 3, usuario_id: 1, quantidade_pessoas: 250 },
		{ id: 6, missa_id: 4, usuario_id: 2, quantidade_pessoas: 300 }
	])
}