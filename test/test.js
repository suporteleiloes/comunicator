const WebSocket = require('ws');
const Comunicator = require('../src/index.js');
const RealtimeInterface = require('../src/realtime-service/interface.js');
const http = require('./libs/http')
const login = require('./libs/login')

async function application () {

  try {
    const session = await login('tiagofelipe', '161400') // TODO: Move to config
  } catch (e) {
    console.log('Falha ao tentar login na API', e.message)
    return
  }

// const com = new Comunicator('gateway:connection:config', RealtimeInterface)
  const com = new Comunicator('https://localhost:3000', RealtimeInterface, http)


  console.log(com.comunicator)

  class WSDriver {
    constructor (uri, config) {
      this.uri = uri
      this._comunicator = new WebSocket(uri);
    }

    driver () {
      return this._comunicator
    }
  }

  let ws = com.comunicator.connect('ws://localhost:8888/ws', {}, WSDriver)

//
  const prompt = require('prompt');
  var colors = require('colors/safe');

  function onErr (err) {
    // console.log(err);
    return 1;
  }

//

  ws.on('com/connect', (env) => {
    console.log('Test successful connected to comunicator!');

    ws._session.send(JSON.stringify({type: 'test', data: {}}))

    // com.lance(1, 2400);
    setTimeout(() => {
      prompt.start();
      ask()
    }, 300)
  });

  const testCommands = [
    {
      cmd: '1',
      description: 'Abrir leilão',
      test () {
        return new Promise((resolve, reject) => {
          console.log()
          console.log()
          console.log(colors.bold('................ Testando abertura de leilão: '))
          console.log(colors.bgYellow(colors.black('Abrindo leilão de ID 1...')))
          com.abrirLeilao(1)
            .then(response => {
              resolve(response.data)
            })
            .catch(error => {
              reject(error.data || error)
            });
        })


      }
    },

    {
      cmd: '2',
      description: 'Fechar leilão',
      test () {
        return new Promise((resolve, reject) => {
          console.log()
          console.log()
          console.log(colors.bold('................ Testando fechamento de leilão: '))
          console.log(colors.bgYellow(colors.black('Fechando leilão de ID 1...')))
          com.fecharLeilao(1)
            .then(response => {
              resolve(response.data)
            })
            .catch(error => {
              reject(error.data || error)
            });
        })


      }
    },

    {
      cmd: '3',
      description: 'Lance',
      test () {
        return new Promise((resolve, reject) => {
          console.log()
          console.log()
          prompt.get([
            {
              name: 'valor',
              description: 'Qual valor do lance?',
              type: 'string',
              required: true
            },
            {
              name: 'lote',
              description: 'Qual id do lote?',
              type: 'string',
              required: true
            },
            {
              name: 'apelido',
              description: 'Qual apelido fará o lance?',
              type: 'string',
              default: 'tiagofelipe1',
              required: true
            }
          ], async function (err, result) {
            if (err) {
              return onErr(err);
            }

            console.log(colors.bold('................ Testando sistema de lances: '))
            console.log(colors.bgYellow(colors.black(`Efetuando lance no valor de R$ ${result.valor} para o lote de ID ${result.lote} em nome de R{${result.apelido}...`)))
            com.lance(result.lote, result.valor, result.apelido)
              .then(response => {
                resolve(response.data)
              })
              .catch(error => {
                reject(error.data || error)
              });

          })
        })


      }
    },

    {
      cmd: '4',
      description: 'Deletar Lance',
      test () {
        return new Promise((resolve, reject) => {
          console.log()
          console.log()
          prompt.get([
            {
              name: 'lance',
              description: 'Qual id do lance?',
              type: 'string',
              required: true
            }
          ], async function (err, result) {
            if (err) {
              return onErr(err);
            }

            console.log(colors.bold('................ Testando remoção de lance: '))
            console.log(colors.bgYellow(colors.black(`Efetuando remoção do lance com ID ${result.lance}...`)))
            com.deleteLance(result.lance)
              .then(response => {
                resolve(response.data)
              })
              .catch(error => {
                reject(error.data || error)
              });

          })
        })


      }
    },

    {
      cmd: '5',
      description: 'Zerar lances de lote',
      test () {
        return new Promise((resolve, reject) => {
          console.log()
          console.log()
          console.log(colors.bold('................ Testando remoção de todos os lances de um lote: '))
          console.log(colors.bgYellow(colors.black(`Efetuando remoção dos lances do lote com ID ${55}...`)))
          com.deleteLancesLote(55)
            .then(response => {
              resolve(response.data)
            })
            .catch(error => {
              reject(error.data || error)
            });
        })


      }
    },

    {
      cmd: '10',
      description: 'Mudar lote',
      test () {
        return new Promise((resolve, reject) => {
          console.log()
          console.log()
          console.log(colors.bold('................ Testar passagem de lote: '))
          console.log(colors.green('1 ............. Ir para número '))
          console.log(colors.green('2 ............. Passar para o próximo '))
          console.log(colors.green('3 ............. Voltar para o anterior '))
          prompt.get([
            {
              name: 'acao',
              description: 'Qual comando você deseja testar?',
              type: 'string',
              required: true
            }
          ], async function (err, result) {
            if (err) {
              return onErr(err);
            }

            let cb = (comando, numero) => {
              console.log(colors.bold('................ Testando passagem de lote '))
              console.log(colors.bgYellow(colors.black(`Efetuando remoção dos lances do lote com ID ${55}...`)))
              com.mudarLote(1, comando, numero)
                .then(response => {
                  resolve(response.data)
                })
                .catch(error => {
                  reject(error.data || error)
                });
            }

            if (String(result.acao) === '1') {
              prompt.get([
                {
                  name: 'numero',
                  description: 'Digite o número do lote:',
                  type: 'string',
                  required: true
                }
              ], async function (err, result) {
                if (err) {
                  return onErr(err);
                }
                cb('ir', result.numero)
              })
            } else if (String(result.acao) === '2') {
              cb('passar')
            } else if (String(result.acao) === '3') {
              cb('voltar')
            } else {
              return onErr(err);
            }

          })
        })


      }
    },

    {
      cmd: '11',
      description: 'Mudar Status de lote',
      test () {
        return new Promise((resolve, reject) => {
          console.log()
          console.log()
          console.log(colors.bold('................ Testar mudança de status de lote: '))
          console.log(colors.green('1 ............. Aberto para lances '))
          prompt.get([
            {
              name: 'status',
              description: 'Qual status você deseja testar?',
              type: 'string',
              required: true
            },
            {
              name: 'lote',
              description: 'Qual id do lote?',
              type: 'string',
              required: true
            }
          ], async function (err, result) {
            if (err) {
              return onErr(err);
            }

            console.log(colors.bold('................ Testando alteração de status de lote '))
            console.log(colors.bgYellow(colors.black(`Efetuando alteração do lote com ID ${result.lote}...`)))
            com.alterarStatusLote(result.lote, result.status)
              .then(response => {
                resolve(response.data)
              })
              .catch(error => {
                reject(error.data || error)
              });

          })
        })


      }
    },

    {
      cmd: '12',
      description: 'Mudar Status de Leilão',
      test () {
        return new Promise((resolve, reject) => {
          console.log()
          console.log()
          console.log(colors.bold('................ Testar mudança de status de leilão: '))
          // console.log(colors.green('1 ............. Aberto para lances '))
          prompt.get([
            {
              name: 'status',
              description: 'Qual status você deseja testar?',
              type: 'string',
              required: true
            },
            {
              name: 'leilao',
              description: 'Qual id do leilão?',
              type: 'string',
              required: true
            }
          ], async function (err, result) {
            if (err) {
              return onErr(err);
            }

            console.log(colors.bold('................ Testando alteração de status de leilão '))
            console.log(colors.bgYellow(colors.black(`Efetuando alteração do leilão com ID ${result.leilao}...`)))
            com.alterarStatusLeilao(result.leilao, result.status)
              .then(response => {
                resolve(response.data)
              })
              .catch(error => {
                reject(error.data || error)
              });

          })
        })


      }
    }
  ]

  const ask = function () {
    console.log(colors.green('+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+='))
    console.log(colors.green('+=   Escolha uma opção que deseja testar/simular:   +='))
    console.log(colors.green('+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+='))
    console.log()
    testCommands.map((command => {
      console.log(`${String(command.cmd).padEnd(4)} `, colors.green(`................ ${command.description}`))
    }))
    /*console.log('1 ', colors.green('................ Lance')) ok
    console.log('2 ', colors.green('................ Deletar Lance')) ok
    console.log('3 ', colors.green('................ Zerar lances de lote')) ok
    console.log('4 ', colors.green('................ Abrir leilão')) ok
    console.log('5 ', colors.green('................ Fechar leilão')) ok
    console.log('6 ', colors.green('................ Renovar cronômetro'))
    console.log('7 ', colors.green('................ Mudar lote')) ok
    console.log('8 ', colors.green('................ Status lote')) ok
    console.log('9 ', colors.green('................ Status leilão')) ok
    console.log('10', colors.green('................ Alterar cronômetro lote'))
    console.log('11', colors.green('................ Alterar cronômetro leilão'))
    console.log('12', colors.green('................ Pausar leilão'))
    console.log('13', colors.green('................ Retomar leilão'))
    console.log('14', colors.green('................ Enviar Aviso para Auditório Virtual'))
    console.log('15', colors.green('................ Alteração em incremento do lote'))
    console.log('16', colors.green('................ Alteração em valor inicial do lote'))
    console.log('17', colors.green('................ Alteração em lote'))
    console.log('18', colors.green('................ Alteração em leilão'))
    console.log('19', colors.green('................ Alteração status de usuário'))
    console.log('20', colors.green('................ Mensagem de usuário'))
    console.log('21', colors.green('................ Login de usuário')) //
    console.log('22', colors.green('................ Timeout/logout de usuário'))
    console.log('23', colors.green('................ Decisão de Comitente em Venda'))*/
    prompt.get([
      {
        name: 'command',
        description: 'Qual operação você deseja testar?',
        type: 'string',
        required: true
      }
    ], async function (err, result) {
      if (err) {
        return onErr(err);
      }
      let find = testCommands.find(command => command.cmd === String(result.command))
      if (!find) {
        console.log(colors.bgRed(colors.white(colors.bold(`  Command: ${result.command} not found `))));
        ask();
        return;
      }
      try {
        // console.log(find)
        let success = await find.test()
        console.log(colors.bgGreen(colors.bold(colors.black(' Teste OK! '))))
        console.log()
        console.log()
      } catch (e) {
        console.log(colors.bgRed(colors.white(colors.bold(`Teste: ${find.description} not success. Reason: `), e.message)));
        console.log(e)
        console.log()
        console.log()
        console.log('----------------------------------------------------------------------')
      }
      ask()
    });
  }


}

application();
