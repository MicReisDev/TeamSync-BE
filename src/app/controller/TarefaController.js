const TarefaService = require("../services/TarefaService")

class TarefaController {
  constructor() { }

  async criar(req, res) {
    try {
      const data = req.body;
      const usuario = req.usuario
      const result = await TarefaService.criar(data, usuario);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async getTarefasDash(req, res) {
    try {
      const result = await TarefaService.getTarefasDash();
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }


  async criarComentario(req, res) {
    try {
      const data = req.body;
      const usuario = req.usuario
      const result = await TarefaService.criarComentario(data, usuario);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async inserirArquivo(req, res) {
    try {
      const data = req.body;
      data.id_usuario = req.usuario.id_usuario
      const result = await TarefaService.inserirArquivo(data);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async getArquivo(req, res) {
    try {
      const { id } = req.params;
      const result = await TarefaService.getArquivo(id);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }





  async select(req, res) {
    try {
      const credenciais = req.query;
      const result = await TarefaService.select(credenciais);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(200).json(error);
    }
  }

  async selectComentario(req, res) {
    try {
      const { id } = req.params;
      const result = await TarefaService.selectComentario(id);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(200).json(error);
    }
  }

  async get(req, res) {
    try {
      const id = req.params.id;

      const result = await TarefaService.get(id);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(200).json(error);
    }
  }


  async update(req, res) {
    try {
      const { body, params } = req
      const { id } = params

      const result = await TarefaService.update(id, body);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params

      const result = await TarefaService.delete(id);

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async inserirLink(req, res) {
    try {
      const data = req.body
      data.id_usuario = req.usuario.id_usuario
      const result = await TarefaService.inserirLink(data);

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async pegarLink(req, res) {
    try {
      const { id } = req.params

      const result = await TarefaService.pegarLink(id);

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

}

module.exports = new TarefaController();
