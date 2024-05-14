const BaseRepositories = require("./BaseRepositories")
const Connect = require("./Connect")

class UsuariosRepositories extends BaseRepositories {
    async auth(filtro) {
        let query = Connect('usuario')
        if (filtro.id) query.where('id_usuario', '=', filtro.id).whereNull('excluido')
        let [retorno] = await query
        delete retorno.criado
        delete retorno.modificado
        delete retorno.senha
        return retorno
    }
    async select(filtro) {
        let query = Connect('usuario').select('usuario.*').whereNull('excluido')

        if (filtro.pesquisar) query.where('nome', 'like', `%${filtro.pesquisar}%`).whereNull('excluido').orWhere('username', 'like', `%${filtro.pesquisar}%`).whereNull('excluido').orWhere('email', 'like', `%${filtro.pesquisar}%`).whereNull('excluido')
        if (filtro.id) query.where('id_usuario', '=', filtro.id).whereNull('excluido')

        query = await query

        for (let usuario of query) {
            delete usuario.criado
            delete usuario.modificado
            delete usuario.excluido
            usuario.roles = await Connect('usuario_role').select('role.role', 'role.id_role').where('usuario_role.id_usuario', usuario.id_usuario)
                .leftJoin('role', 'role.id_role', 'usuario_role.id_role')
            for (let role of usuario.roles) {
                role.permissoes = await Connect('permissao').select('permissao.permissao', 'permissao.id_permissao').leftJoin('role_permissao', 'role_permissao.id_permissao', 'permissao.id_permissao')
                    .where('role_permissao.id_role', role.id_role)
            }
            const pastas = await Connect('usuario_pasta')
                .select('usuario_pasta.id_pasta', 'pasta.pasta')
                .innerJoin('pasta', 'pasta.id_pasta', 'usuario_pasta.id_pasta')
                .where('usuario_pasta.id_usuario', usuario.id_usuario);

            usuario.pastas = pastas
            // usuario.permissons = await Connect('usuario_role').select('permissao.*').where('usuario.id_usuario',usuario.id_usuario)
            // .leftJoin('role','role.id_role','usuario_role.id_role').leftJoin('role_permissao', 'role_permissao.id_permissao','usuario_role.id_permissao')
            //  .leftJoin('permissao','permissao.id_permissao','role_permissao.id_permissao')
        }
        return query
    }

    async login(username) {

        let query = await Connect('usuario')
            .select('usuario.*')
            .where('username', 'like', username)
            .whereNull('excluido').limit(1)



        for (let usuario of query) {
            delete usuario.criado
            delete usuario.modificado
            delete usuario.excluido
            usuario.roles = await Connect('usuario_role').select('role.role', 'role.id_role').where('usuario_role.id_usuario', usuario.id_usuario)
                .leftJoin('role', 'role.id_role', 'usuario_role.id_role')
            for (let role of usuario.roles) {
                const permissoes = await Connect('permissao').select('permissao.permissao', 'permissao.id_permissao').leftJoin('role_permissao', 'role_permissao.id_permissao', 'permissao.id_permissao')
                    .where('role_permissao.id_role', role.id_role)

                role.permissoes = permissoes.map((i) => i.permissao)
            }
            const pastas = await Connect('usuario_pasta')
                .select('usuario_pasta.id_pasta', 'pasta.pasta')
                .innerJoin('pasta', 'pasta.id_pasta', 'usuario_pasta.id_pasta')
                .where('usuario_pasta.id_usuario', usuario.id_usuario);

            usuario.pastas = pastas.map((i) => i.pasta)
            // usuario.permissons = await Connect('usuario_role').select('permissao.*').where('usuario.id_usuario',usuario.id_usuario)
            // .leftJoin('role','role.id_role','usuario_role.id_role').leftJoin('role_permissao', 'role_permissao.id_permissao','usuario_role.id_permissao')
            //  .leftJoin('permissao','permissao.id_permissao','role_permissao.id_permissao')
        }
        return query
    }


}

module.exports = new UsuariosRepositories('usuario')    