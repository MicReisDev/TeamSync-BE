const html2canvas = require('html2canvas');

async function gerarCertificado(nome) {
    nome = await formatarNome(nome);
    const templatePath = path.resolve(__dirname, '..', '..', 'files', `${teamplate}.html`); // Certifique-se de ter um arquivo HTML como modelo
    const fontPath = path.resolve(__dirname, '..', '..', 'files', 'books-script.otf');

    // Leitura do arquivo HTML de template
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    // Substitua variáveis no conteúdo HTML, se necessário
    const htmlContent = templateContent.replace('{{NOME}}', nome);

    // Crie um arquivo HTML temporário
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    const tempFilePath = path.join(tempDir, 'certificado.html');
    fs.writeFileSync(tempFilePath, htmlContent);

    // Use html2canvas para converter HTML em PNG
    const canvas = await html2canvas(document.querySelector('body'));
    const pngDataUrl = canvas.toDataURL('image/png');

    // Salve a imagem PNG
    let outputPath = path.resolve('G:\\MARKETING\\01 MARKETING GERAL 2023 - 01 01 23\\3 BCI\\02 PROJETOS GRÁFICOS\\Certificados\\Certificados 16 nov\\PLANILHA03', `${nome}_certificado.png`);
    if (folder) outputPath = path.resolve(`G:\\MARKETING\\01 MARKETING GERAL 2023 - 01 01 23\\3 BCI\\02 PROJETOS GRÁFICOS\\Certificados\\Certificados 16 nov\\${folder}`, `${nome}_certificado.png`);

    const pngBuffer = Buffer.from(pngDataUrl.split('base64,')[1], 'base64');
    fs.writeFileSync(outputPath, pngBuffer);

    // Limpeza: Exclua o arquivo HTML temporário
    fs.unlinkSync(tempFilePath);
}
