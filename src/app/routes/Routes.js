const express = require('express');
const router = express.Router();
const Usuario = require('./UsuarioRoutes');
const RolePermissao = require('./RolePermissaoRoutes');
const Tarefa = require('./TarefaRoutes');
const Pastas = require('./PastaRoutes');
const Upload = require('./Upload');
const ManipularPlanilhas = require('./ManipularPlanilhas');


router.use(Usuario)
router.use(RolePermissao)
router.use(Tarefa)
router.use(Pastas)
router.use(Upload)
router.use(ManipularPlanilhas)

module.exports = router;
