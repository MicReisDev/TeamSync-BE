const express = require('express');
const router = express.Router();
const Controller = require('../controller/RolePermissaoController')
const auth = require('../middleware/auth')


router.post('/role',Controller.criarRole)
router.put('/role/:id',Controller.updateRole)
router.get('/roles',Controller.todasAsRoles)
router.get('/roles_permissao',Controller.todasAsRolesComPermissions)


//permissions 
router.get('/permissao',Controller.todasAsPermissoes)

module.exports = router;