const express = require('express');
const router = express.Router();
const Controller = require('../controller/TarefaController')
const auth = require('../middleware/auth')

router.post('/tarefa', auth, Controller.criar)

router.get('/dash/tarefa', auth, Controller.getTarefasDash)


router.get('/tarefa', auth, Controller.select)
router.get('/tarefa/:id', auth, Controller.get)
router.put('/tarefa/:id', auth, Controller.update)
router.delete('/tarefa/:id', auth, Controller.delete)

router.post('/tarefa/comentario', auth, Controller.criarComentario)

router.get('/tarefa/comentario/:id', auth, Controller.selectComentario)

router.post('/tarefa/arquivo', auth, Controller.inserirArquivo)

router.get('/tarefa/arquivo/:id', auth, Controller.getArquivo)

router.post('/tarefa/link', auth, Controller.inserirLink)

router.get('/tarefa/link/:id', auth, Controller.pegarLink)

module.exports = router;