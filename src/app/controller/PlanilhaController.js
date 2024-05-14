const PlanilhaService = require("../services/PlanilhaService")

class PlanilhaController {
    constructor() { }

    async baixar(req, res) {
        try {
            const data = req.body;
            const buffer = await PlanilhaService.baixar(data);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=PlanilhaMesclada.xlsx');
            res.send(buffer)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao gerar a planilha", error: error.message });
        }
    }


    async criar(req, res) {
        try {
            const data = req.body;
            const result = await PlanilhaService.criar(data);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async inserir(req, res) {
        try {
            const data = req.body;
            const result = await PlanilhaService.inserir(data);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async usuarios(req, res) {
        try {
            const data = req.query
            const result = await PlanilhaService.usuarios(data);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async atualizarColaboradores(req, res) {
        try {
            const data = req.body
            const colaborador_ferias_id = req.params.id
            const result = await PlanilhaService.atualizarColaboradores(data, colaborador_ferias_id);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }




    async usuariosDownload(req, res) {
        try {
            const data = req.query
            const buffer = await PlanilhaService.usuariosDownload(data);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=PlanilhaMesclada.xlsx');
            res.send(buffer)
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async atualizar(req, res) {
        try {
            const data = req.body
            const result = await PlanilhaService.atualizar(data);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async novoColaborador(req, res) {
        try {
            const { body } = req
            const result = await PlanilhaService.novoColaborador(body);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async pegarObservacoes(req, res) {
        try {
            const { id } = req.params
            const result = await PlanilhaService.pegarObservacoes(id);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }


    async criarObservacoes(req, res) {
        try {
            const data = req.body
            data.id_usuario = req.usuario.id_usuario
            const result = await PlanilhaService.criarObservacoes(data);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async deletarObservacoes(req, res) {
        try {
            const { id } = req.params
            const result = await PlanilhaService.deletarObservacoes(id);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async uploadAtestados(req, res) {
        try {
            const { body, usuario } = req
            body.id_usuario = usuario.id_usuario

            const result = await PlanilhaService.uploadAtestados(body);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

    async getAtestados(req, res) {
        try {
            const { id } = req.params
            const result = await PlanilhaService.getAtestados(id);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }


    async empresas(req, res) {
        try {

            const result = await PlanilhaService.empresas();
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
    async populate(req, res) {
        try {
            const { body } = req
            const result = await PlanilhaService.populate(body);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }


    async prodetechDash(req, res) {
        try {
            const { query } = req
            const result = await PlanilhaService.prodetechDash(query);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }


}

module.exports = new PlanilhaController();