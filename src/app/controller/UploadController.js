const path = require('path');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config()
const crypto = require('crypto')
class UploadController {
    constructor() { }

    async Upload(req, res) {
        try {
            const caminho = path.resolve(__dirname, '../', '../', '../', 'arquivos')

            const storagePath = path.join(caminho, req.file.filename);

            const publicUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;

            res.status(201).json({ file: req.file, publicUrl });
        } catch (err) {
            console.error("Erro durante o upload do arquivo:", err);
            res.status(500).send("Erro durante o upload do arquivo para o servidor FTP");
        }
    }

    async get(req, res) {
        try {
            const caminho = path.resolve(__dirname, '../', '../', '../', 'arquivos');
            const caminhoArquivo = path.join(caminho, req.query.arquivo);

            const existeArquivo = fs.existsSync(caminhoArquivo);
            if (!existeArquivo) {
                return res.status(404).json({ erro: 'Arquivo não encontrado' });
            }

            res.sendFile(caminhoArquivo);
        } catch (err) {
            res.status(500).json({ err });
        }
    }
    async uploadCloud(req, res) {
        try {
            const file = req.file
            const fileHash = crypto.randomBytes(10).toString('hex');
            const folder = req.body.pasta
            const file_name = `${folder}/${fileHash}-${file.originalname.replace(/\s+/g, '').trim()}`;
            file.originalname = file_name

            const storage = new Storage({
                projectId: process.env.CLOUD_PROJECT,
                keyFilename: 'chaves.json'
            });
            const bucket = storage.bucket(process.env.CLOUD_BUCKET);
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream()
            blobStream.on('finish', () => {
                delete file.buffer
                delete file.encoding
                delete file.fieldname
                file.pasta = folder
                res.status(200).send({ ...file, originalname: `${fileHash}-${file.originalname.replace(/\s+/g, '').trim()}`, url: `https://storage.googleapis.com/creativecircle/${file.originalname}` })
            })
            blobStream.end(req.file.buffer)

        } catch (err) {
            console.error("Erro", err);
            res.status(500).send(err);
        }
    }

    // async getCloud(req, res) {
    //     try {
    //         const caminho = path.resolve(__dirname, '../', '../', '../', 'arquivos');
    //         const caminhoArquivo = path.join(caminho, req.query.arquivo);

    //         const existeArquivo = fs.existsSync(caminhoArquivo);
    //         if (!existeArquivo) {
    //             return res.status(404).json({ erro: 'Arquivo não encontrado' });
    //         }

    //         res.sendFile(caminhoArquivo);
    //     } catch (err) {
    //         res.status(500).json({ err });
    //     }
    // }
}

module.exports = new UploadController();


