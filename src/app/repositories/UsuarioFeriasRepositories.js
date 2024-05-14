const BaseRepositories = require('./BaseRepositories')
const Connect = require('./Connect')
const moment = require('moment')

class UsuarioFeriasRepositories extends BaseRepositories {
    async UsuariosCompletos(filtro) {
        const currentPage = filtro.page || 1
        const perPage = filtro.perPage || 30

        let query = Connect('colaborador_ferias').select('colaborador_ferias.*', 'nome_empresarial as empresa').innerJoin('empresas', 'empresas.empresa_id', 'colaborador_ferias.empresa_id')

        if (isNaN(+filtro.pesquisar)) query.where('nome', 'like', `%${filtro.pesquisar}%`)
        else if (filtro.pesquisar != "") query.where('codigo', '=', `${filtro.pesquisar}`)
        if (filtro.vencidas && filtro.vencidas != "" && !isNaN(+filtro.vencidas)) query.where('ferias_vencidas', '=', `${Number(filtro.vencidas)}`)
        if (filtro.empresa != "") query.where('colaborador_ferias.empresa_id', '=', +filtro.empresa)
        if (filtro.status != "") query.where('status', '=', filtro.status)
        if (filtro.trabalhista != "") query.where('trabalhista', '=', filtro.trabalhista)

        const hoje = moment().format('YYYY-MM-DD')

        query = await query.orderBy('nome', 'asc').paginate({ currentPage, perPage, isLengthAware: true })


        for (let usuario of query.data) {
            usuario.periodo_pendente = moment(usuario.periodo_pendente).format('DD-MM-YYYY')
            usuario.ultimas_ferias = usuario.ultimas_ferias == '0000-00-00' ? '0000-00-00' : moment(usuario.ultimas_ferias).format('DD-MM-YYYY')
            usuario.data_admissao = moment(usuario.data_admissao).format('DD-MM-YYYY')
            usuario.atestados = await Connect('colaborador_ferias_atestados').where('colaborador_ferias_id', '=', usuario.colaborador_ferias_id)
                .innerJoin('usuario', 'usuario.id_usuario', 'colaborador_ferias_atestados.id_usuario')
                .select('colaborador_ferias_atestados.*', 'usuario.nome', 'avatar')
            let ferias = await Connect('colaborador_ferias_periodo').where('colaborador_ferias_periodo.colaborador_ferias_id', '=', usuario.colaborador_ferias_id)
            if (usuario.status == 'Ferias') {

                const [dados] = await Connect('colaborador_ferias_periodo').select('inicio', 'retorno')
                    .where('colaborador_ferias_periodo.colaborador_ferias_id', '=', usuario.colaborador_ferias_id).where('gozando', '=', 'true')

                if (dados && dados.inicio) usuario.inicio = moment(dados.inicio).format('DD-MM-YYYY')
                if (dados && dados.retorno) usuario.retorno = moment(dados.retorno).format('DD-MM-YYYY')
            }


            for (let unica of ferias) {
                delete unica.criado
                delete unica.modificado
                delete unica.codigo


                unica.limite = unica.limite ? moment(unica.limite).format('DD-MM-YYYY') : '00-00-0000'
                unica.previsao = unica.previsao ? moment(unica.previsao).format('DD-MM-YYYY') : '00-00-0000'


            }
            usuario.ferias = ferias
            delete usuario.criado
            delete usuario.modificado
        }

        return query
    }

    async atualizar() {

    }
    async pegarObservacoes(id) {

        const result = Connect('colaborador_ferias_obs').select('colaborador_ferias_obs.*', 'usuario.nome', 'avatar').where('colaborador_ferias_id', '=', id)
            .innerJoin('usuario', 'usuario.id_usuario', 'colaborador_ferias_obs.id_usuario')
            .whereNull('colaborador_ferias_obs.excluido')

        return result
    }

    async deletarObservacoes(id) {
        const result = Connect('colaborador_ferias_obs').where('colaborador_ferias_obs_id', '=', id).update({ excluido: moment().format('YYYY-MM-DD HH:mm:ss') })
        return result
    }



    async criarObservacoes(data) {
        const observacoes = data
        const ObservacoesRepositories = new BaseRepositories('colaborador_ferias_obs')
        const result = await ObservacoesRepositories.insert({ data: observacoes })
        return result
    }

    async uploadAtestados(data) {
        const AtestadosRepositories = new BaseRepositories('colaborador_ferias_atestados')
        const result = AtestadosRepositories.insert({ data })
        return result
    }

    async getAtestados(id) {
        const result = await Connect('colaborador_ferias_atestados').where('colaborador_ferias_id', '=', id).innerJoin('usuario', 'usuario.id_usuario', 'colaborador_ferias_atestados.id_usuario').select('colaborador_ferias_atestados.*', 'usuario.nome', 'avatar')
        return result
    }

    async empresas() {
        const result = await Connect('empresas')
        return result
    }
}


module.exports = new UsuarioFeriasRepositories('colaborador_ferias')