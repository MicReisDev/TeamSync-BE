const PastaService = require("../services/PastaService")

class UploadService {
    constructor() { }

    async Upload(req, res) {
        try {
            const data = req.body;
            const usuario = req.usuario
            const result = await PastaService.Upload(data, usuario);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}

module.exports = new UploadService();
