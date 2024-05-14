const express = require('express');
const router = express.Router();
const Controller = require('../controller/PlanilhaController');
const auth = require('../middleware/auth');

router.post('/planilha', auth, Controller.criar)
router.post('/planilha/baixar', auth, Controller.baixar)

router.post('/planilha/inserir', Controller.inserir)

//colaboradores

router.get('/colaborador-empresas', auth, Controller.empresas)
router.get('/colaborador-ferias', auth, Controller.usuarios)
router.put('/colaborador-ferias/:id', auth, Controller.atualizarColaboradores)
router.get('/colaborador-download', auth, Controller.usuariosDownload)
router.put('/colaborador-atualizar', auth, Controller.atualizar)
router.post('/colaborador/novo', auth, Controller.novoColaborador)

//observacoes
router.get('/colaborador-observacoes/:id', auth, Controller.pegarObservacoes)
router.post('/colaborador-observacoes', auth, Controller.criarObservacoes)
router.delete('/deletar-observacao/:id', auth, Controller.deletarObservacoes)


//Atestados
router.post('/colaborador-atestados', auth, Controller.uploadAtestados)
router.get('/colaborador-atestados/:id', auth, Controller.getAtestados)


//Alimentar Base Usuários
router.post('/populate', Controller.populate)
router.get('/prodetech-dash', Controller.prodetechDash)

module.exports = router;