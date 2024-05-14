const PastaService = require("../services/PastaService")

class PastaController {
    constructor() { }

    async criar(req, res) {
        try {
            const data = req.body;
            const usuario = req.usuario
            const result = await PastaService.criar(data, usuario);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async select(req, res) {
        try {

            const credenciais = req.query;
            const result = await PastaService.select(credenciais);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(200).json(error);
        }
    }


    async update(req, res) {
        try {
            const filtro = req.query
            const result = await PastaService.update(filtro);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async delete(req, res) {
        try {
            const filtro = req.Pasta
            filtro.id = req.Pasta.id_Pasta
            const result = await PastaService.delete(filtro);

            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

}

module.exports = new PastaController();
