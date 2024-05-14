const BaseRepositories = require("./BaseRepositories")
const Connect = require('../repositories/Connect')
const moment = require('moment')
class TarefaRepositories extends BaseRepositories {
    async select(filtro) {

        const currentPage = filtro.page || 1
        const perPage = filtro.perPage || 30
        let query = Connect('tarefa').select('tarefa.*', 'pasta').whereNull('tarefa.excluido').innerJoin('pasta', 'tarefa.id_pasta', 'pasta.id_pasta')
        if (filtro.pasta) query.where('tarefa.id_pasta', '=', filtro.pasta)
        if (filtro.status) query.where('tarefa.status', '=', filtro.status)
        // if (filtro.ordem) query.orderBy('tarefa.criado', filtro.ordem)
        if (filtro.pesquisar) query.where('tarefa.titulo', 'like', `%${filtro.pesquisar}%`).orWhere('tarefa.id_tarefa', '=', filtro.pesquisar)
        const data_atual = moment().format('YYYY-MM-DD')
        query = await query.orderByRaw(`
            CASE 
                WHEN status = 'Pendente' THEN 1 
                WHEN status = 'Em Andamento' THEN 2 
                WHEN status = 'Concluida' THEN 3 
                ELSE 4
            END, status
        `).paginate({ currentPage, perPage, isLengthAware: true })

        for (let tarefa of query.data) {

            const data_entrega = moment(tarefa.entrega).format('YYYY-MM-DD')
            const diferenca = moment(data_entrega).diff(data_atual, 'days')
            const comentarios = await Connect('tarefa_comentarios').select('tarefa_comentarios.*', 'usuario.avatar', 'usuario.nome').where('id_tarefa', '=', tarefa.id_tarefa).innerJoin('usuario', 'usuario.id_usuario', 'tarefa_comentarios.id_usuario')

            tarefa.dias_restantes = diferenca
            tarefa.comentarios = comentarios
        }

        return query
    }

    async selectComentario(id) {
        const comentarios = await Connect('tarefa_comentarios').select('tarefa_comentarios.*', 'usuario.avatar', 'usuario.nome')
            .where('id_tarefa', '=', id).innerJoin('usuario', 'usuario.id_usuario', 'tarefa_comentarios.id_usuario').orderBy('criado', 'desc')
        return comentarios
    }

    async getEspecifico(id) {
        let query = await Connect('tarefa').select().whereNull('excluido').where('tarefa.id_tarefa', '=', id)
        const data_atual = moment().format('YYYY-MM-DD')
        const data_entrega = moment(query[0].entrega).format('YYYY-MM-DD')
        const diferenca = moment(data_entrega).diff(data_atual, 'days')
        query[0].dias_restantes = diferenca
        return query
    }
    async criarComentario(data) {
        data.criado = moment().format("YYYY-MM-DD HH-mm-ss")
        data.modificado = moment().format("YYYY-MM-DD HH-mm-ss")
        let [query] = await Connect('tarefa_comentarios').insert(data)
        return query
    }

    async getArquivo(id) {

        const query = await Connect('tarefa_arquivos').where('id_tarefa', '=', id)
            .innerJoin('usuario', 'usuario.id_usuario', 'tarefa_arquivos.id_usuario')
            .select('tarefa_arquivos.*', 'usuario.nome', 'usuario.avatar')


        return query
    }

    async inserirLink(data) {
        data.criado = moment().format("YYYY-MM-DD HH-mm-ss")
        data.modificado = moment().format("YYYY-MM-DD HH-mm-ss")
        let [query] = await Connect('tarefa_link').insert(data)
        return query
    }

    async pegarLink(id) {
        const query = await Connect('tarefa_link').where('id_tarefa', '=', id).
            innerJoin('usuario', 'usuario.id_usuario', 'tarefa_link.id_usuario').select('tarefa_link.*', 'usuario.nome', 'usuario.avatar')
        return query
    }

    async getTarefasDash() {
        const query = await Connect('pasta').select('id_pasta', 'pasta as empresa')

        for (let pasta of query) {
            const [em_andamento] = await Connect('tarefa').count('id_tarefa as quantidade').where('id_pasta', '=', pasta.id_pasta).where('status', 'Em Andamento').whereNull('excluido')
            const [pendente] = await Connect('tarefa').count('id_tarefa as quantidade').where('id_pasta', '=', pasta.id_pasta).where('status', 'Pendente').whereNull('excluido')
            const [concluida] = await Connect('tarefa').count('id_tarefa as quantidade').where('id_pasta', '=', pasta.id_pasta).where('status', 'Concluida').whereNull('excluido')
            const [finalizada] = await Connect('tarefa').count('id_tarefa as quantidade').where('id_pasta', '=', pasta.id_pasta).where('status', 'Finalizada').whereNull('excluido')

            pasta.Em_Andamento = { quantidade: em_andamento.quantidade, variacao: '0%' }
            pasta.Pendente = { quantidade: pendente.quantidade, variacao: '0%' }
            pasta.Concluida = { quantidade: concluida.quantidade, variacao: '0%' }
            pasta.Finalizada = { quantidade: finalizada.quantidade, variacao: '0%' }
        }

        return query
    }
}

module.exports = new TarefaRepositories('tarefa')