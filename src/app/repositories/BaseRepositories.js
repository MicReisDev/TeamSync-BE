const moment = require('moment')
const Connect = require('./Connect')

class BaseRepositories {
    create() {
        throw new Error("Method not implemented.");
    }
    #tabela

    constructor(tabela) {
        this.#tabela = tabela
    }

    async validaColuna(tabela, coluna, msg = " não é um filtro válido") {
        let infoColumns = await Connect.table(tabela).columnInfo()

        if (!infoColumns.hasOwnProperty(String(coluna))) {
            throw { message: coluna + msg }
        }
    }

    async insert({
        data = {}
    }) {
        data.criado = moment().format("YYYY-MM-DD HH-mm-ss")
        data.modificado = moment().format("YYYY-MM-DD HH-mm-ss")

        let colunas = Object.entries(data)
        for (let c of colunas) {
            await this.validaColuna(this.#tabela, String([c[0]]), " não existe na tabela " + this.#tabela)
        }

        try {
            var retorno = await Connect.table(this.#tabela).insert(data);
        } catch (e) {
            return e.message;
        }

        return retorno[0];
    }


    async Basicinsert(data) {
        return await Connect.table(this.#tabela).insert(data);
    }

    async get({
        filtro = {},
        campos = "*",
        raw = "",
        rawType = ""
    }) {

        let limit = 10000
        let tipo_ordem = "asc"
        let query = Connect.table(this.#tabela).select(campos);
        if (filtro && filtro.limit && !isNaN(filtro.limit)) limit = Number(filtro.limit)
        delete filtro.limit

        if (filtro && Object.values(filtro).length > 0) {

            if (filtro.ordem) {
                await this.validaColuna(this.#tabela, filtro.ordem)
                var ordem = filtro.ordem
                delete filtro.ordem
            }

            if (filtro.tipo_ordem) {
                if (filtro.tipo_ordem != "asc" && filtro.tipo_ordem != "desc") {
                    throw { message: "O tipo da ordenação deve ser desc ou asc" }
                }
                tipo_ordem = filtro.tipo_ordem
                delete filtro.tipo_ordem
            }

            filtro = Object.entries(filtro)
            try {
                for (let f of filtro) {
                    await this.validaColuna(this.#tabela, String([f[0]]))
                    let filtro = { [f[0]]: f[1] }

                    query.where(filtro)
                }
            } catch (e) {
                return e.message;
            }

        }

        if (ordem) {
            query.orderBy(ordem, tipo_ordem)
        }

        if (raw) {
            if (!rawType || rawType == "where") {
                query.whereRaw(raw)
            } else if (rawType == "join") {
                query.joinRaw(raw)
            }
        }

        let retorno = await query
        return retorno

    }

    async update({
        data = {},
        condicao = {},
        raw = ""
    }) {
        data.modificado = moment().format("YYYY-MM-DD HH:mm:ss")
        let query = Connect.table(this.#tabela).update(data);
        if (condicao && Object.values(condicao).length > 0) {
            condicao = Object.entries(condicao)
            try {
                for (let c of condicao) {
                    await this.validaColuna(this.#tabela, String([c[0]]))
                    let filtro = { [c[0]]: c[1] }
                    query.where(filtro)
                }
            } catch (e) {
                return e.message;
            }
        } else {
            throw { message: "Informe a condição" }
        }

        if (raw) {
            query.whereRaw(raw)
        }

        let retorno = await query

        return retorno;
    }
    async basicUpdate({
        data = {},
        condicao = {},
        raw = ""
    }) {

        let query = Connect.table(this.#tabela).update(data);
        if (condicao && Object.values(condicao).length > 0) {
            condicao = Object.entries(condicao)
            try {
                for (let c of condicao) {
                    await this.validaColuna(this.#tabela, String([c[0]]))
                    let filtro = { [c[0]]: c[1] }
                    query.where(filtro)
                }
            } catch (e) {
                return e.message;
            }
        } else {
            throw { message: "Informe a condição" }
        }

        if (raw) {
            query.whereRaw(raw)
        }

        let retorno = await query

        return retorno;
    }

    async softDelete(condicao) {
        //os itens não são deletados, apenas atualizados
        let excluido = moment().format("YYYY-MM-DD HH-mm-ss")
        return await Connect.table(this.#tabela).update({ excluido }).where(condicao)

    }

    async delete({
        condicao = {}
    }) {

        let query = Connect.table(this.#tabela).delete();
        if (condicao && Object.values(condicao).length > 0) {
            condicao = Object.entries(condicao)
            try {
                for (let c of condicao) {
                    await this.validaColuna(this.#tabela, String([c[0]]))
                    let filtro = { [c[0]]: c[1] }
                    query.where(filtro)
                }
            } catch (e) {
                return e.message;
            }
        } else {
            throw { message: "Informe a condição" }
        }

        let retorno = await query

        return retorno;

    }
}

module.exports = BaseRepositories