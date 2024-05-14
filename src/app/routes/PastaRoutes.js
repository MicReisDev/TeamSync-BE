const express = require('express');
const router = express.Router();
const Controller = require('../controller/PastaController')
const auth = require('../middleware/auth')


//router.post('/pasta', auth, Controller.criarPasta)
//router.put('/pasta', auth, Controller.updatePasta)
router.get('/pastas', Controller.select)




module.exports = router;