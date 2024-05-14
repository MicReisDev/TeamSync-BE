const UsuarioService = require('../services/UsuarioServices');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const exceljs = require('exceljs');
const fs = require('fs')
const path = require('path');
const fontkit = require('@pdf-lib/fontkit')


class UsuarioController {
  constructor() { }

  async Criar(req, res) {
    try {
      const credenciais = req.body;
      const result = await UsuarioService.Criar(credenciais);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
  async Editar(req, res) {
    try {
      const credenciais = req.body;
      credenciais.id_usuario = req.params.id
      const result = await UsuarioService.Editar(credenciais);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async Login(req, res) {
    try {
      const credenciais = req.body;
      const result = await UsuarioService.Login(credenciais);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(200).json(error);
    }
  }


  async PegarTodosUsuarios(req, res) {
    try {
      const filtro = req.query
      const result = await UsuarioService.PegarTodosUsuarios(filtro);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
  async atualizarUsuario(req, res) {
    try {
      const { id } = req.params
      const usuario = req.body
      const result = UsuarioService.atualizarUsuario(id, usuario);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async pegarUsuario(req, res) {
    try {
      const { id } = req.params
      const result = await UsuarioService.pegarUsuario(id);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  async auth(req, res) {
    try {
      const filtro = req.usuario
      filtro.id = req.usuario.id_usuario
      const result = await UsuarioService.auth(filtro);

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
  async Delete(req, res) {
    try {
      const { id } = req.params
      const result = await UsuarioService.Delete(id);

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }



  async verificarArquivosNaoExistentes(req, res) {
    let nomes = req.query.nomes

    let folder = req.query.folder
    const nomesNaoExistentes = [];
    const diretorio = path.resolve(`G:\\MARKETING\\MARKETING 2024\\02 EMPRESAS\\04 BCI\\04 CERTIFICADOS\\${folder}`)



    async function criarArrayDeNomes(texto) {

      const linhas = texto.split('\n').filter(nome => nome.trim() !== '');

      const nomes = linhas.map(nome => nome.trim());

      return nomes;
    }

    async function formatarNome(nome) {
      const palavras = nome.split(' ');

      const nomeFormatado = palavras.map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase());

      return nomeFormatado.join(' ');
    }

    nomes = await criarArrayDeNomes(nomes)

    const nomesOriginais = nomes;

    const contagemNomes = nomesOriginais.reduce((contagem, nome) => {
      contagem[nome] = (contagem[nome] || 0) + 1;
      return contagem;
    }, {});

    const nomesDuplicados = Object.keys(contagemNomes).filter(nome => contagemNomes[nome] > 1);

    for (let nome of nomes) {
      let newNome = await formatarNome(nome)
      newNome = newNome.replace(/\s/g, "")

      const caminhoDoArquivo = path.join(diretorio, `${newNome}_certificado.pdf`);
      const verificaSeExiste = fs.existsSync(caminhoDoArquivo);

      if (!verificaSeExiste) {
        nomesNaoExistentes.push(nome);
      }
    }
    if (nomesNaoExistentes.length == 0 && nomesDuplicados.length > 0) res.json({
      mensagem: 'Todos os certificados existem, porém existem nomes duplicados',
      nomes_duplicados: nomesDuplicados
    });
    else if (nomesNaoExistentes.length == 0) res.send('Todos os certificados existem');
    else res.send(nomesNaoExistentes);
  }

  async genCertificado(req, res) {

    try {

      const arquivoDoUsuario = req.file;
      let nomes = req.query.nomes
      let nome = req.query.nome
      let teamplate = req.query.teamplate
      let arr = []
      let folder = req.query.folder

      if (nomes) {
        const arrayDeNomes = criarArrayDeNomes(nomes);

        for (let nome of arrayDeNomes) {

          await gerarCertificado(nome)
        }
      }

      if (nome) {
        await gerarCertificado(nome)
      }

      if (arquivoDoUsuario) {
        let caminho = path.join(__dirname, '..', '..', 'files', 'planilhas', arquivoDoUsuario.originalname)
        await lerPlanilhaELoop(caminho)
      }


      async function lerPlanilhaELoop(filePath) {
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(filePath);


        const worksheet = workbook.getWorksheet(1);


        const nomesColumn = worksheet.getColumn('A');


        nomesColumn.eachCell({ includeEmpty: false }, (cell, rowNumber) => {

          if (typeof cell.value == 'string') arr.push(cell.value)

        });
      }

      function criarArrayDeNomes(texto) {

        const linhas = texto.split('\n').filter(nome => nome.trim() !== '');

        const nomes = linhas.map(nome => nome.trim());

        return nomes;
      }

      async function formatarNome(nome) {
        const palavras = nome.split(' ');

        const nomeFormatado = palavras.map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase());

        return nomeFormatado.join(' ');
      }




      async function gerarCertificado(nome) {
        nome = await formatarNome(nome)
        const templatePath = path.resolve(__dirname, '..', '..', 'files', `${teamplate}`);
        const fontPath = path.resolve(__dirname, '..', '..', 'files', 'books-script.otf');
        const templateBytes = fs.readFileSync(templatePath)
        const pdfDoc = await PDFDocument.load(templateBytes);
        pdfDoc.registerFontkit(fontkit);
        const fontBytes = fs.readFileSync(fontPath);

        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(fontBytes);
        const corNormalizada = [32 / 255, 41 / 255, 91 / 255]

        let x = height / 1.2;
        let size = 125;
        let checkname = nome.replace(/\s/g, "");

        // if (checkname.length > 5) {
        //   x = height / 1.2;
        //   size = 120;
        // }
        // if (checkname.length > 8) {
        //   x = height / 1.3;
        //   size = 120;
        // }
        // if (checkname.length > 15) {
        //   x = height / 1.4;
        //   size = 115;
        // }
        // if (checkname.length > 20) {
        //   x = height / 1.45;
        //   size = 115;
        // }
        // if (checkname.length > 25) {
        //   x = height / 1.5;
        //   size = 107;
        // }
        // if (checkname.length >= 30) {
        //   x = height / 1.65;
        //   size = 105;
        // }
        // if (checkname.length >= 35) {
        //   x = height / 1.7;
        //   size = 100;
        // }
        if (checkname.length <= 5) {
          x = height / 1.2;
          size = 120;
        } else if (checkname.length <= 8) {
          x = height / 1.3;
          size = 120;
        } else if (checkname.length <= 15) {
          x = height / 1.4;
          size = 115;
        } else if (checkname.length <= 20) {
          x = height / 1.45;
          size = 115;
        } else if (checkname.length <= 25) {
          x = height / 1.5;
          size = 107;
        } else if (checkname.length <= 30) {
          x = height / 1.6;
          size = 105;
        } else if (checkname.length <= 35) {
          x = height / 1.7;
          size = 100;
        } else {

          x = height / 1.8;
          size = 95;
        }

        page.drawText(nome, { x, y: width / 2 - 370, font, size, color: rgb(...corNormalizada) });

        const modifiedPdfBytes = await pdfDoc.save();

        let outputPath = path.resolve('G:\\MARKETING\\01 MARKETING GERAL 2023 - 01 01 23\\3 BCI\\02 PROJETOS GRÁFICOS\\Certificados\\Certificados 16 nov\\PLANILHA03', `${checkname}_certificado.pdf`)
        if (folder) outputPath = path.resolve(`G:\\MARKETING\\MARKETING 2024\\02 EMPRESAS\\04 BCI\\04 CERTIFICADOS\\${folder}`, `${checkname}_certificado.pdf`)

        fs.writeFileSync(outputPath, modifiedPdfBytes);
      }


      return res.json(arr)
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }





}

module.exports = new UsuarioController();
