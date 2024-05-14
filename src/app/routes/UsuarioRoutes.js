const express = require('express');
const router = express.Router();
const Controller = require('../controller/UsuarioController')
const auth = require('../middleware/auth')
const multer = require('multer')
const uploadDir = 'C:\\Users\\michel.moreira\\Desktop\\APROVAÇÕES\\src\\files\\planilhas';
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/criar-usuario', Controller.Criar)
router.put('/editar-usuario/:id', Controller.Editar)
router.post('/login', Controller.Login)
router.get('/usuario/:id', auth, Controller.pegarUsuario)
router.put('/usuario/:id', auth, Controller.atualizarUsuario)
router.get('/todos-usuarios', auth, Controller.PegarTodosUsuarios)
router.get('/auth', auth, Controller.auth)
router.delete('/deletar-usuario/:id', auth, Controller.Delete)


router.post('/certificado', upload.single('planilha'), Controller.genCertificado)
router.post('/verificarcertificado', upload.single('planilha'), Controller.verificarArquivosNaoExistentes)

module.exports = router;