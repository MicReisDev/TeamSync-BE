const BaseRepositories = require("./BaseRepositories");
const Connect = require("./Connect");

class clientes_prodetech extends BaseRepositories {
    async populate(arr) {

        function camelToSnakeCase(str) {
            return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        }

        function convertObjectKeysToSnakeCase(obj) {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }

            if (Array.isArray(obj)) {
                return obj.map(convertObjectKeysToSnakeCase);
            }

            return Object.keys(obj).reduce((acc, currentKey) => {
                const newKey = camelToSnakeCase(currentKey);
                const value = obj[currentKey];

                // Se o valor for um objeto, chama a função recursivamente
                acc[newKey] = convertObjectKeysToSnakeCase(value);

                return acc;
            }, {});
        }

        let new_arr = []

        for (let item of arr) {
            let new_item = convertObjectKeysToSnakeCase(item)
            let endereco = new_item.endereco
            let arr_servico = new_item.servico
            new_item.cnpj_cpf = new_item.cnpj_cpf.replace(/\D/g, '')
            new_item.telefone = new_item.telefone.replace(/\D/g, '')
            delete new_item.endereco
            delete new_item.servico

            let [id_cliente] = await Connect('clientes_prodetech').insert(new_item)


            endereco.id_cliente = id_cliente
            await Connect('clientes_prodetech_endereco').insert(endereco)


            for (let servico of arr_servico) {

                await Connect('clientes_prodetech_servico').insert({ servico: servico, id_cliente })
            }



            new_arr.push(new_item)
        }

        return new_arr
    }
    async prodetechDash(filtro) {
        // let query = await Connect('clientes_prodetech').innerJoin('clientes_prodetech_endereco', 'clientes_prodetech_endereco.id_cliente', 'clientes_prodetech.id_cliente')
        // for (let item of query) {

        // }

        const cidades = await Connect('clientes_prodetech_endereco').groupBy('cidade').select('cidade')

        const modalidades = await Connect('clientes_prodetech').select('modalidade_de_venda').count('modalidade_de_venda as qtd').groupBy('modalidade_de_venda')

        let data5 = [['modalidade', 'quantidade']]

        modalidades.map(modalidade => data5.push([modalidade.modalidade_de_venda, modalidade.qtd]))
        //.select('modalidade_de_venda')

        // for (let cidade of cidades) {
        //     const servicos = await Connect('clientes_prodetech_servico')
        //         .innerJoin(
        //             'clientes_prodetech_endereco',
        //             'clientes_prodetech_servico.id_cliente',
        //             'clientes_prodetech_endereco.id_cliente'
        //         )
        //         .count('servico as quantidade')
        //         .select('servico')
        //         .groupBy('servico')
        //         .where('clientes_prodetech_endereco.cidade', 'like', cidade.cidade)

        //     cidade.servicos = servicos
        // }

        const data = [
            ["Cidade", "Alarme", "Cerca Eletrica", "CFTV", "Controle de Acesso", "Monitoramento Alarme", "Monitoramento CFTV"]
        ];

        const data2 = [
            ["Mes", "Alarme", "Cerca Eletrica", "CFTV", "Controle de Acesso", "Monitoramento Alarme", "Monitoramento CFTV"]
        ];

        const meses = [
            { numero: 1, nome: "Janeiro" },
            { numero: 2, nome: "Fevereiro" },
            { numero: 3, nome: "Março" },
            { numero: 4, nome: "Abril" },
            { numero: 5, nome: "Maio" },
            { numero: 6, nome: "Junho" },
            { numero: 7, nome: "Julho" },
            { numero: 8, nome: "Agosto" },
            { numero: 9, nome: "Setembro" },
            { numero: 10, nome: "Outubro" },
            { numero: 11, nome: "Novembro" },
            { numero: 12, nome: "Dezembro" }
        ];
        const data4 = [
            ['cidade', 'quantidade']
        ]





        async function obterServicosPorCidade(cidade) {
            // Executa a query para obter os serviços e suas quantidades para a cidade especificada
            const servicosObtidos = await Connect('clientes_prodetech_servico')
                .innerJoin(
                    'clientes_prodetech_endereco',
                    'clientes_prodetech_servico.id_cliente',
                    'clientes_prodetech_endereco.id_cliente'
                )
                .count('servico as quantidade')
                .select('servico')
                .groupBy('servico')
                .where('clientes_prodetech_endereco.cidade', 'like', `%${cidade}%`);

            // Lista de todos os serviços que você espera incluir na resposta
            const servicosEsperados = [
                "Alarme",
                "Cerca Eletrica",
                "CFTV",
                "Controle de Acesso",
                "Monitoramento Alarme",
                "Monitoramento CFTV",
            ];

            // Resultado final incluindo todos os serviços, mesmo aqueles com quantidade 0
            const resultadoFinal = servicosEsperados.map(servicoEsperado => {
                // Encontra o serviço correspondente nos resultados da query

                const servicoEncontrado = servicosObtidos.find(servico => servico.servico == servicoEsperado);

                // Retorna o objeto de serviço com a quantidade encontrada ou 0
                return {
                    servico: servicoEsperado,
                    quantidade: servicoEncontrado ? servicoEncontrado.quantidade : 0
                };
            });

            return resultadoFinal;
        }

        async function obterServicoMes(mes) {
            // Executa a query para obter os serviços e suas quantidades para a cidade especificada
            const servicosObtidos = await Connect('clientes_prodetech_servico')
                .innerJoin(
                    'clientes_prodetech',
                    'clientes_prodetech_servico.id_cliente',
                    'clientes_prodetech.id_cliente'
                )
                .count('servico as quantidade')
                .select('servico')
                .groupBy('servico')
                .whereRaw('MONTH(data) = ?', [mes])

            // Lista de todos os serviços que você espera incluir na resposta
            const servicosEsperados = [
                "Alarme",
                "Cerca Eletrica",
                "CFTV",
                "Controle de Acesso",
                "Monitoramento Alarme",
                "Monitoramento CFTV",
            ];

            // Resultado final incluindo todos os serviços, mesmo aqueles com quantidade 0
            const resultadoFinal = servicosEsperados.map(servicoEsperado => {
                // Encontra o serviço correspondente nos resultados da query

                const servicoEncontrado = servicosObtidos.find(servico => servico.servico == servicoEsperado);

                // Retorna o objeto de serviço com a quantidade encontrada ou 0
                return {
                    servico: servicoEsperado,
                    quantidade: servicoEncontrado ? servicoEncontrado.quantidade : 0
                };
            });

            return resultadoFinal;
        }

        for (let mes of meses) {
            const servicos = await obterServicoMes(mes.numero)

            let arr = [mes.nome]
            for (let servico of servicos) {


                if (servico.servico == 'Alarme') arr.push(servico.quantidade)
                else if (servico.servico == 'Cerca Eletrica') arr.push(servico.quantidade)
                else if (servico.servico == 'CFTV') arr.push(servico.quantidade)
                else if (servico.servico == 'Controle de Acesso') arr.push(servico.quantidade)
                else if (servico.servico == 'Monitoramento Alarme') arr.push(servico.quantidade)
                else if (servico.servico == 'Monitoramento CFTV') arr.push(servico.quantidade)
                else arr.push(0)

            }

            data2.push([mes.nome, ...servicos.map(servico => servico.quantidade)]);

        }


        for (let cidade of cidades) {
            const servicos = await obterServicosPorCidade(cidade.cidade)

            // Supondo que você queira a soma de todos os serviços para cada cidade
            // let totalServicosPorCidade = servicos.reduce((acc, curr) => acc + parseInt(curr.quantidade, 10), 0);
            //console.log(cidade.cidade, servicos)
            let arr = [cidade.cidade]
            for (let servico of servicos) {


                if (servico.servico == 'Alarme') arr.push(servico.quantidade)
                else if (servico.servico == 'Cerca Eletrica') arr.push(servico.quantidade)
                else if (servico.servico == 'CFTV') arr.push(servico.quantidade)
                else if (servico.servico == 'Controle de Acesso') arr.push(servico.quantidade)
                else if (servico.servico == 'Monitoramento Alarme') arr.push(servico.quantidade)
                else if (servico.servico == 'Monitoramento CFTV') arr.push(servico.quantidade)
                else arr.push(0)



            }

            const servicos_cidade = await obterServicosPorCidade(cidade.cidade)
            data.push([cidade.cidade, ...servicos.map(servico => servico.quantidade)]);

            const [servicosObtidos] = await Connect('clientes_prodetech_servico')
                .innerJoin(
                    'clientes_prodetech_endereco',
                    'clientes_prodetech_servico.id_cliente',
                    'clientes_prodetech_endereco.id_cliente'
                )

                .count('cidade as totalServicos')
                .where('clientes_prodetech_endereco.cidade', 'like', `%${cidade.cidade}%`);

            data4.push([cidade.cidade, servicosObtidos.totalServicos])

        }

        // for (let modalidade of modalidades) {
        //     let query = await Connect('clientes_prodetech_servico')
        //         .innerJoin(
        //             'clientes_prodetech',
        //             'clientes_prodetech_servico.id_cliente',
        //             'clientes_prodetech.id_cliente'
        //         )
        //         .count('modalidade as quantidade')
        // }


        const servicosEsperados = [
            "Alarme",
            "Cerca Eletrica",
            "CFTV",
            "Controle de Acesso",
            "Monitoramento Alarme",
            "Monitoramento CFTV",
        ];


        const servicosObtidos = await Connect('clientes_prodetech_servico')
            .innerJoin(
                'clientes_prodetech',
                'clientes_prodetech_servico.id_cliente',
                'clientes_prodetech.id_cliente'
            )
            .count('servico as quantidade')

            .select('servico')
            .groupBy('servico')
            .whereRaw('YEAR(data) = ?', [2023])

        let servicosFilter = servicosObtidos.map(servico => servico.quantidade)

        let qtd_por_ano = []

        servicosEsperados.map((servico, index) => {

            qtd_por_ano.push([servico, servicosFilter[index]])
        })

        const data3 = [['Produto', 'Quantidade'], ...qtd_por_ano]

        // const quantidade_servico = await Connect('clientes_prodetech_servico')
        //     .count('servico as quantidade')
        //     .select('servico')
        //     .groupBy('servico')

        // console.log(quantidade_servico)





        return {
            cidade_produto: data,
            mes_produto: data2,
            ano_produto: data3,
            geral_por_cidade: data4,
            modalidade_contratos: data5
        }

    }

}

module.exports = new clientes_prodetech('clientes_prodetech')