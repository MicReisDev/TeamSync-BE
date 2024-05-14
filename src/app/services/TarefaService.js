const TarefaRepositories = require('../repositories/TarefaRepositories');
const BaseRepositories = require('../repositories/BaseRepositories')

require('dotenv').config()

class TarefaService {

  constructor(

  ) { }

  async criar(data, usuario) {
    data.status = 'Pendente'
    data.id_usuario = usuario.id_usuario
    return await TarefaRepositories.insert({ data })
  }

  async criarComentario(data, usuario) {
    data.id_usuario = usuario.id_usuario
    return await TarefaRepositories.criarComentario(data)
  }

  async inserirArquivo(data) {
    let arquivoRepositories = new BaseRepositories('tarefa_arquivos')
    return await arquivoRepositories.insert({ data })
  }

  async getArquivo(id) {

    return await TarefaRepositories.getArquivo(id)
  }


  async select(filtro) {
    return await TarefaRepositories.select(filtro)
  }

  async selectComentario(filtro) {
    return await TarefaRepositories.selectComentario(filtro)
  }


  async get(id) {
    return await TarefaRepositories.getEspecifico(id)
  }
  async update(id, data) {
    return await TarefaRepositories.update({ condicao: { id_tarefa: id }, data })
  }
  async delete(id_tarefa) {
    return await TarefaRepositories.softDelete({ id_tarefa })
  }

  async inserirLink(data) {
    return await TarefaRepositories.inserirLink(data)
  }

  async pegarLink(id) {
    return await TarefaRepositories.pegarLink(id)
  }

  async getTarefasDash() {
    return await TarefaRepositories.getTarefasDash()
  }

}

module.exports = new TarefaService();
