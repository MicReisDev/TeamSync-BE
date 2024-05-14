const BaseRepositories = require("./BaseRepositories")
const Connect = require('./Connect')
class PastaRepositories extends BaseRepositories {
    async select(filtro) {

        let query = Connect('pasta').select().whereNull('excluido')
        if (filtro.pasta) query.where('id_pasta', '=', filtro.pasta).andWhere('id_pasta', '=', 0)
        if (filtro.pesquisar) query.where('pasta', 'like', `%${filtro.pesquisar}%`)
        return await query
    }
}

module.exports = new PastaRepositories('tarefa')