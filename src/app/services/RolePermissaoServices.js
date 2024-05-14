const RoleRepositories = require('../repositories/RoleRepositories');
const PermissaoRepositories = require('../repositories/PermissaoRepositories');


class UsuarioService {
  constructor() {}

  async criarRole(data) {
    const retorno = await RoleRepositories.criarRole(data)
    return retorno;
}

async updateRole(data,id) {
  const retorno = await RoleRepositories.updateRole(data,id)
  return retorno;
}

  async todasAsRoles(filtro) {
      const retorno = await RoleRepositories.get({filtro})
      return retorno;
  }

  async todasAsPermissoes(filtro) {
    const retorno = await PermissaoRepositories.get({filtro})
    return retorno;
}

  async todasAsRolesComPermissions(filtro) {
    const retorno = await RoleRepositories.todasAsRolesComPermissions({filtro})
    return retorno;
}
}

module.exports = new UsuarioService();