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
          console.log(colors.bold('................ Testando sistema de lances: '))
          console.log(colors.bgYellow(colors.black('Efetuando lance no valor de R$ 2.400,00 para o lote de ID 1...')))
          com.lance(55, 100000)
            .then(response => {
              resolve(response.data)
            })
            .catch(error => {
              reject(error.data || error)
            });
        })


      }
    },
  ]

  const ask = function () {
    console.log(colors.green('+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+='))
    console.log(colors.green('+=   Escolha uma opção que deseja testar/simular:   +='))
    console.log(colors.green('+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+='))
    console.log()
    testCommands.map((command => {
      console.log(`${command.cmd} `, colors.green(`................ ${command.description}`))
    }))
    /*console.log('1 ', colors.green('................ Lance'))
    console.log('2 ', colors.green('................ Deletar Lance'))
    console.log('3 ', colors.green('................ Zerar lances de lote'))
    console.log('4 ', colors.green('................ Abrir leilão'))
    console.log('5 ', colors.green('................ Fechar leilão'))
    console.log('6 ', colors.green('................ Renovar cronômetro'))
    console.log('7 ', colors.green('................ Mudar lote'))
    console.log('8 ', colors.green('................ Status lote'))
    console.log('9 ', colors.green('................ Status leilão'))
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
        console.log(find)
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
