const XLSX = require('xlsx');
const axios = require('axios');
const path = require('path');
const moment = require('moment')
const BaseRepositories = require('../repositories/BaseRepositories')
const UsuarioFeriasRepositories = require('../repositories/UsuarioFeriasRepositories')
const UsuarioFeriasPeriodosRepositories = require('../repositories/UsuarioFeriasPeriodosRepositories')
const clientes_prodetech = require('../repositories/ProdetechClientsRepositories')
class PlanilhaService {
    constructor() { }

    async criar(dados) {
        const dado = await this.gen(dados);
        return dado
        async function lerDados(url) {
            const planilha = await axios.get(url, { responseType: 'arraybuffer' });
            const workbook = XLSX.read(planilha.data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const result = XLSX.utils.sheet_to_json(sheet);
            return result
        }

        function filtro1(planilha) {
            return planilha.filter(row => {
                const keys = Object.keys(row);

                return keys.length > 3 && !isNaN(row[keys[0]]);
            }).map(row => {
                const keys = Object.keys(row);
                const newObject = {
                    'codigo': row[keys[0]],
                    'nome': row[keys[1]],
                    'periodo_pendente': row[keys[2]],
                    'ferias_vencidas': row[keys[3]],
                    'avos': row[keys[4]],
                    'data_admissao': row[keys[5]],
                    'departamento': row[keys[6]],
                    'cargo': row[keys[7]],
                    'centro_de_custo': row[keys[8]]
                };
                return newObject;
            });
        }

        function filtro2(planilha) {
            return planilha.filter(row => {
                const keys = Object.keys(row);

                return keys.length > 3 && !isNaN(row[keys[0]]);
            }).map(row => {
                const keys = Object.keys(row);


                const newObject = {
                    codigo: row[keys[0]],
                    ultimas_ferias: row[keys[4]],
                    periodo_aquisitivo: row[keys[5]],
                    limite: row[keys[6]],
                    saldo: row[keys[7]]
                };

                const newObject2 = {
                    codigo: row[keys[0]],
                    ultimas_ferias: '',
                    periodo_aquisitivo: row[keys[4]],
                    limite: row[keys[5]],
                    saldo: row[keys[6]]
                };

                if (keys.length > 8) return newObject
                return newObject2;
            });
        }



        function salvarComoArquivo(workbook, caminho) {
            return new Promise((resolve, reject) => {
                XLSX.writeFileAsync(caminho, workbook, err => {
                    if (err) reject(err);
                    else resolve(caminho);
                });
            });
        }



        let planilha01 = filtro1(await lerDados(dados.planilha01));
        let planilha02 = filtro2(await lerDados(dados.planilha02));

        let planilha02Map = new Map(planilha02.map(item => [item.codigo, item]));


        let planilhaMerged = planilha01.map(item => {
            let item2 = planilha02Map.get(item.codigo);
            return item2 ? { ...item, ...item2 } : { ...item };
        });

        // const novaPlanilha = criarPlanilha(planilhaMerged)

        // const caminho = path.join(__dirname, '../', '../', '../', 'arquivos')

        // salvarComoArquivo(novaPlanilha, caminho)

        return planilhaMerged;

    }

    async baixar(data) {
        let dadosMesclados = await this.criar(data);

        dadosMesclados = dadosMesclados.map((usuario) => {

            const usuarioClonado = JSON.parse(JSON.stringify(usuario));

            usuarioClonado.aquisitivo.forEach((ferias, index) => {

                usuarioClonado[`periodo_aquisitivo_${index + 1}`] = ferias.periodo_aquisitivo;
                usuarioClonado[`limite_${index + 1}`] = ferias.limite;
                usuarioClonado[`saldo_${index + 1}`] = ferias.saldo;

            });


            delete usuarioClonado.ferias;

            return usuarioClonado;
        });

        const novaPlanilha = criarPlanilha(dadosMesclados);

        function criarPlanilha(dadosMesclados) {
            const worksheet = XLSX.utils.json_to_sheet(dadosMesclados);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados Mesclados');
            return workbook;
        }

        return XLSX.write(novaPlanilha, { type: 'buffer', bookType: 'xlsx' });
    }

    // async gen2(dados) {
    //     async function lerDados(url) {
    //         const planilha = await axios.get(url, { responseType: 'arraybuffer' });
    //         const workbook = XLSX.read(planilha.data, { type: 'array' });
    //         const sheetName = workbook.SheetNames[0];
    //         const sheet = workbook.Sheets[sheetName];
    //         const result = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    //         return result
    //     }

    //     function transpor(matriz) {
    //         return matriz[0].map((_, i) => matriz.map(row => row[i]));
    //     }

    //     function filtro1(planilha) {
    //         const planilhaTransposta = transpor(planilha);
    //         return planilhaTransposta.filter(coluna => {
    //             // Aqui você pode adicionar a lógica para filtrar as colunas
    //         });
    //     }

    //     const dadosPlanilha = await lerDados(dados);
    //     return filtro1(dadosPlanilha);
    // }
    async gen(dados) {
        async function lerDados(url) {
            const planilha = await axios.get(url, { responseType: 'arraybuffer' });
            const workbook = XLSX.read(planilha.data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const result = XLSX.utils.sheet_to_json(sheet);
            return result
        }

        function filtro1(planilha) {
            return planilha.filter(row => {

                const keys = Object.keys(row);


                return keys.length > 3 && !isNaN(row[keys[0]]);
            }).map(row => {
                const keys = Object.keys(row);

                if (keys.length > 12) {
                    const newObject = {
                        'codigo': row[keys[0]],
                        'nome': row[keys[1]],
                        'periodo_pendente': row[keys[2]],
                        'ferias_vencidas': row[keys[3]],
                        'avos': row[keys[4]],
                        'data_admissao': row[keys[5]],
                        'departamento': row[keys[6]],
                        'cargo': row[keys[7]],
                        'unidade_administrativa': row[keys[8]],
                        'tomador': row[keys[9]],
                        'filial': row[keys[10]],
                        'centro_de_custo': row[keys[11]],
                        'salario': !isNaN(+row[keys[keys.length - 1]]) ? row[keys[keys.length - 1]] : 0,
                    };
                    return newObject;
                }

                const newObject = {
                    'codigo': row[keys[0]],
                    'nome': row[keys[1]],
                    'periodo_pendente': row[keys[2]],
                    'ferias_vencidas': row[keys[3]],
                    'avos': row[keys[4]],
                    'data_admissao': row[keys[5]],
                    'departamento': row[keys[6]],
                    'cargo': row[keys[7]],
                    'unidade_administrativa': row[keys[8]],
                    'filial': row[keys[9]],
                    'centro_de_custo': row[keys[10]],
                    'salario': !isNaN(+row[keys[keys.length - 1]]) ? row[keys[keys.length - 1]] : 0,
                };
                return newObject;
            });
        }

        function filtro2(planilha) {

            const filtrada = planilha.filter((row, index) => {
                const keys = Object.keys(row);
                const primeiraColunaEhNumero = !isNaN(row[keys[0]]) && row[keys[0]] !== '';
                return (keys.length > 3 && primeiraColunaEhNumero)
            })


            const filtradaRelacao = planilha.filter((row, index) => {
                const keys = Object.keys(row);
                const primeiraColunaEhNumero = !isNaN(row[keys[0]]) && row[keys[0]] !== '';
                const terceiraEnumero = (keys.length == 4 && !isNaN(row[keys[2]]))
                return (keys.length > 3 && primeiraColunaEhNumero) || terceiraEnumero
            })

            let fill = []
            filtradaRelacao.filter((row, index) => {
                const keys = Object.keys(row);
                if (keys.length == 4 && !isNaN(row[keys[2]])) {
                    const last_code = filtradaRelacao[index - 1]
                    const keys2 = Object.keys(last_code);
                    row.codigo = last_code.codigo || last_code[keys2[0]]
                    fill.push({
                        codigo: row.codigo,
                        periodo_aquisitivo: row[keys[0]],
                        limite: row[keys[1]],
                        saldo: row[keys[2]]
                    })
                    return row
                }
            })




            const novaFiltrada = filtrada.map(row => {
                const keys = Object.keys(row);



                const newObject = {
                    codigo: row[keys[0]],
                    ultimas_ferias: row[keys[4]],
                };

                fill.push({
                    codigo: row[keys[0]],
                    periodo_aquisitivo: row[keys[5]],
                    limite: row[keys[6]],
                    saldo: row[keys[7]]
                })
                if (keys.length > 8) return newObject;
                else {

                    fill.push({
                        codigo: row[keys[0]],
                        periodo_aquisitivo: row[keys[4]],
                        limite: row[keys[5]],
                        saldo: row[keys[6]]
                    })
                    const newObject2 = {
                        codigo: row[keys[0]],
                        ultimas_ferias: '',
                    };

                    return newObject2;
                }

            });

            return { fill, novaFiltrada }
        }





        let planilha01 = filtro1(await lerDados(dados.planilha01));
        let planilha02 = filtro2(await lerDados(dados.planilha02));

        let planilha02Map = new Map(planilha02.novaFiltrada.map(item => [item.codigo, item]));


        let planilhaMerged = planilha01.map(item => {
            let item2 = planilha02Map.get(item.codigo);
            let aquisitivo = []
            for (let iten of planilha02.fill) {

                if (iten.codigo == item.codigo && !isNaN(iten.saldo)) {
                    aquisitivo.push(iten)
                }

            }
            item.aquisitivo = aquisitivo

            return item2 ? { ...item, ...item2 } : { ...item };
        });



        return planilhaMerged;

    }
    async inserir(data) {
        const dadosMesclados = await this.gen(data.dados);

        const UsuarioBase = new BaseRepositories('colaborador_ferias')
        const Ferias = new BaseRepositories('colaborador_ferias_periodo')

        for (let dados of dadosMesclados) {
            const aquisitivos = dados.aquisitivo
            delete dados.aquisitivo
            dados.empresa_id = data.empresa_id
            dados.periodo_pendente = moment(dados.periodo_pendente, 'DD/MM/YYYY').format('YYYY-MM-DD')
            dados.data_admissao = moment(dados.data_admissao, 'DD/MM/YYYY').format('YYYY-MM-DD')
            dados.ultimas_ferias = moment(dados.ultimas_ferias, 'DD/MM/YYYY').format('YYYY-MM-DD')

            const colaborador_ferias_id = await UsuarioBase.insert({ data: dados })

            for (let aquisitivo of aquisitivos) {

                aquisitivo.periodo_aquisitivo_inicio = aquisitivo.periodo_aquisitivo.split(' a ')[0]
                aquisitivo.periodo_aquisitivo_inicio = moment(aquisitivo.periodo_aquisitivo_inicio, 'DD/MM/YYYY').format('YYYY-MM-DD')

                aquisitivo.periodo_aquisitivo_fim = aquisitivo.periodo_aquisitivo.split(' a ')[1]
                aquisitivo.periodo_aquisitivo_fim = moment(aquisitivo.periodo_aquisitivo_fim, 'DD/MM/YYYY').format('YYYY-MM-DD')
                aquisitivo.limite = moment(aquisitivo.limite, 'DD/MM/YYYY').format('YYYY-MM-DD')

                const agora = moment()
                const anoatual = agora.year();
                const data = moment(aquisitivo.periodo_aquisitivo_fim)
                const ano = data.year();



                if (anoatual >= ano) await Ferias.insert({ data: { colaborador_ferias_id, ...aquisitivo } })


            }
        }

        return dadosMesclados
    }

    async usuarios(data) {
        return await UsuarioFeriasRepositories.UsuariosCompletos(data)
    }


    async atualizarColaboradores(data, colaborador_ferias_id) {

        delete data.colaborador_ferias_id
        delete data.atestados
        return await UsuarioFeriasRepositories.update({ condicao: { colaborador_ferias_id }, data: data })
    }


    async atualizar(data) {

        let id = ''

        for (let item of data) {

            item.limite = moment(item.limite, 'DD-MM-YYYY').format('YYYY-MM-DD')
            item.previsao = moment(item.previsao, 'DD-MM-YYYY').format('YYYY-MM-DD')


            if (item.limite == 'Invalid date') delete item.limite
            if (item.previsao == 'Invalid date') delete item.previsao


            if (item.colaborador_ferias_periodo_id) {
                id = item.colaborador_ferias_id

                await UsuarioFeriasPeriodosRepositories.update({ condicao: { colaborador_ferias_periodo_id: item.colaborador_ferias_periodo_id }, data: item })

            } else {
                item.colaborador_ferias_id = id
                let periodo_aquisitivo_1 = (item.periodo_aquisitivo_1).replace(/-/g, '/')
                let periodo_aquisitivo_2 = (item.periodo_aquisitivo_2).replace(/-/g, '/')

                delete item.periodo_aquisitivo_1
                delete item.periodo_aquisitivo_2

                item.periodo_aquisitivo = (`${periodo_aquisitivo_1} a ${periodo_aquisitivo_2}`)

                const returner = await UsuarioFeriasPeriodosRepositories.insert({ data: { ...item, colaborador_ferias_id: id } })

            }

        }
        return id
    }





    async usuariosDownload(filtros) {
        const { data } = await UsuarioFeriasRepositories.UsuariosCompletos(filtros);
        const dadosMesclados = data.map((usuario) => {

            const usuarioClonado = JSON.parse(JSON.stringify(usuario));

            usuarioClonado.ferias.forEach((ferias, index) => {

                usuarioClonado[`periodo_aquisitivo_${index + 1}`] = ferias.periodo_aquisitivo;
                usuarioClonado[`limite_${index + 1}`] = ferias.limite;
                usuarioClonado[`saldo_${index + 1}`] = ferias.saldo;

            });


            delete usuarioClonado.ferias;

            return usuarioClonado;
        });

        const novaPlanilha = criarPlanilha(dadosMesclados);

        function criarPlanilha(dadosMesclados) {
            const worksheet = XLSX.utils.json_to_sheet(dadosMesclados);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados Mesclados');
            return workbook;
        }

        return XLSX.write(novaPlanilha, { type: 'buffer', bookType: 'xlsx' });
    }



    async novoColaborador(body) {
        return await UsuarioFeriasRepositories.insert({ data: body })
    }

    async pegarObservacoes(id) {
        return await UsuarioFeriasRepositories.pegarObservacoes(id)
    }


    async criarObservacoes(data) {
        return await UsuarioFeriasRepositories.criarObservacoes(data)
    }


    async deletarObservacoes(id) {
        return await UsuarioFeriasRepositories.deletarObservacoes(id)
    }

    async uploadAtestados(body) {

        return await UsuarioFeriasRepositories.uploadAtestados(body)
    }
    async getAtestados(id) {
        return await UsuarioFeriasRepositories.getAtestados(id)
    }

    async empresas() {
        return await UsuarioFeriasRepositories.empresas()
    }

    async populate(arr) {
        return await clientes_prodetech.populate(arr)
    }
    async prodetechDash(filtro) {
        return await clientes_prodetech.prodetechDash(filtro)
    }


}

module.exports = new PlanilhaService();
