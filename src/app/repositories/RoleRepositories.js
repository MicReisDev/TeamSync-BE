const BaseRepositories = require("./BaseRepositories")
const Connect = require("./Connect")

class RoleRepositories extends BaseRepositories{
    async todasAsRolesComPermissions(){
        let query = await Connect('role').select('role.role','role.id_role')

        for(let role of query){
            role.permissoes = await Connect('role_permissao').select('permissao.id_permissao','permissao').leftJoin('permissao','role_permissao.id_permissao','permissao.id_permissao').where('role_permissao.id_role','=',role.id_role)
        }

        return query
    }
    async criarRole(data){
        const id_role = await this.insert({data:{role:data.role}})
        for(let permissao of data.permissoes){
            await Connect('role_permissao').insert({id_role, id_permissao:permissao.id_permissao})
        }

        return id_role
    }

    async updateRole(data,id){
        let update = await this.update({condicao:{id_role:id},data:{role:data.role}})
        

        await Connect('role_permissao').delete().where('id_role',id)
        for(let permissao of data.permissoes){
            await Connect('role_permissao').insert({id_role:id, id_permissao:permissao.id_permissao})
        }

        return update
    }

}

module.exports = new RoleRepositories('role')