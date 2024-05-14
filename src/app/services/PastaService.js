const PastaRepositories = require('../repositories/PastaRepositories');

require('dotenv').config()

class PastaService {
  constructor() { }

  async criar(data, usuario) {
    data.status = 'Pendente'
    data.id_usuario = usuario.id_usuario
    return await PastaRepositories.insert({ data })
  }
  async select(filtro) {
    return await PastaRepositories.select(filtro)
  }
  async update(filtro) {
  }
  async delete(filtro) {
  }

}

module.exports = new PastaService();
