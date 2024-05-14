
const express = require('express');
const router = express.Router();
const multer = require('multer')
const Controller = require('../controller/UploadController');
const path = require('path');
const crypto = require('crypto');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {


        const caminho = path.resolve(__dirname, '../', '../', '../', 'arquivos')

        cb(null, caminho);
    },
    filename: (req, file, cb) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const file_name = `${fileHash}-${file.originalname.replace(/\s+/g, '').trim()}`;
        cb(null, file_name + '-' + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({
    storage
})



const cloudMulter = multer({
    storage: multer.memoryStorage()
})



router.post('/arquivo/upload', upload.single('arquivo'), Controller.Upload)
router.get('/arquivo/get', Controller.get)

router.post('/arquivo/uploadCloud', cloudMulter.single('arquivo'), Controller.uploadCloud)
// router.get('/arquivo/getCloud', Controller.getCloud)


module.exports = router;