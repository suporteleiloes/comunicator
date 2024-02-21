import audios from './libs/audioNotifications.js'

class Comunicator {
  /**
   *
   * @param gateway - @TODO: Analisar
   * @param comunicator - Instância do comunicator
   * @param axiosInstance - Instância http
   * @param backup - Endpoint de backup em caso de falha no comunicator
   */
  constructor (gateway, comunicator, axiosInstance, backup) {
    this.gatewayEnv = gateway;
    this.backup = backup; // @TODO: Implementar mecanismo auxiliar em caso de falha no websocket
    this.comunicator = comunicator;
    this.http = axiosInstance
    this.audios = audios
    this.servertime = null
    this.localtime = (new Date()).getTime()
    this.servertimeSync()
    this.servertimeSyncInterval = setInterval(() => {
      console.log('Sincronizando hora com o servidor')
      this.servertimeSync()
    }, 60000)
  }

  /**
   * Sincroniza com o horário do servidor
   * @param leilaoId
   * @returns {Promise<>}
   */
  servertimeSync (leilaoId = null) {
    let serverTime = 0
    let startTime = new Date().getTime()
    let diffTime = 0
    return new Promise((resolve, reject) => {
      this.http.get(`/api/public/servertime?leilao=${leilaoId || ''}`, {
        transformRequest: [function (data, headers) {
          if (headers && headers.common && headers.common.Authorization) {
            delete headers.common.Authorization
          }
          return data;
        }]
      })
        .then(response => {
          let responseServertime = response.data.time
          this.servertime = Date.parse(responseServertime.toString().replace(/ /g, 'T'))
          let actualTime = this.localtime = new Date().getTime()
          diffTime = actualTime - startTime
          this.servertime = this.servertime + diffTime
          console.log('Iniciou a requisição da hora do servidor em: ' + new Date(startTime))
          console.log('Encerrou a requisição da hora do servidor em: ' + new Date(actualTime))
          console.log('O sistema levou ' + diffTime + ' milisegundos para carregar o timestamp do servidor')
          console.log('A hora atual do servidor é: ' + new Date(this.servertime))
          resolve(response)
        })
        .catch(error => {
          serverTime = 0
          if (typeof alert !== 'undefined') {
            // alert('Não conseguimos sincronizar com o horário do servidor, seu cronômetro pode ter alguma inconsistência, mas você poderá dar lances normalmente, mas não confie no cronômetro e continue dando lantes imediatamente após algum outro lance cobrir o seu, ou atualize a página para tentar sincronizar com o horário do servidor.')
          }
          console.error(error)
          reject(error)
        })
    });
  }

  /**
   * Devolve a hora do servidor baseado na requisição inicial
   */
  getServertime () {
    let now = new Date().getTime()
    let tempoPercorrido = now - this.localtime
    return this.servertime + tempoPercorrido
  }

  /**
   * Efetua um novo lance
   * @param loteId
   * @param valor
   * @param apelido
   * @param parcelamento
   * @returns {Promise<>}
   */
  lance (loteId, valor, apelido = null, parcelamento = null, boleta = null) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/lotes/${loteId}/lance`, {
        valor: valor,
        apelido: apelido,
        parcelamento: parcelamento,
        boleta: boleta
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Solicita dados atualizados de um lote
   * @param loteId
   * @returns {Promise<>}
   */
  getSimpleLoteData (loteId) {
    return new Promise((resolve, reject) => {
      this.http.get(`/api/lotes/${loteId}/getSimpleData`)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
    });
  }

  /**
   * Deleta todos os lances de um lote
   * @param loteId
   * @returns {Promise<>}
   */
  deleteLancesLote (loteId) {
    return new Promise((resolve, reject) => {
      this.http.delete(`/api/cmd/lotes/${loteId}/lances`)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Deleta um lance
   * @param lanceId
   * @returns {Promise<>}
   */
  deleteLance (lanceId) {
    return new Promise((resolve, reject) => {
      this.http.delete(`/api/cmd/lances/${lanceId}`)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Abrir um leilão
   * @param leilaoId
   * @returns {Promise<>}
   */
  abrirLeilao (leilaoId) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/leiloes/${leilaoId}/abrir`)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Fecha um leilão
   * @param leilaoId
   * @returns {Promise<>}
   */
  fecharLeilao (leilaoId) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/leiloes/${leilaoId}/fechar`)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Renovar cronômetro de lote em pregão
   * @param loteId
   * @returns {Promise<>}
   */
  renovarCronometro (loteId) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/lotes/${loteId}/renovarCronometro`)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   *
   * @param leilaoId
   * @param comando (passar, voltar, irPara)
   * @param numero
   * @returns {Promise<>}
   */
  mudarLote (leilaoId, comando = 'passar', numero = '') {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/leiloes/${leilaoId}/mudarLote?cmd=${comando}&numero=${numero}`)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Altera status do lote
   * @param loteId
   * @param status
   * @returns {Promise<>}
   */
  alterarStatusLote (loteId, status) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/lotes/${loteId}/status`, {
        status: status
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Infoma Doulhe
   * @param loteId
   * @param status integer (1, 2)
   * @returns {Promise<>}
   */
  doulhe (loteId, status) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/lotes/${loteId}/doulhe`, {
        status: status
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Altera tempo do cronômetro do lote
   * @param loteId
   * @param novoTempo
   * @returns {Promise<>}
   */
  alterarCronometroLote (loteId, novoTempo) {
    return new Promise((resolve, reject) => {
      this.http.patch(`/api/cmd/lotes/${loteId}/alterarCronometro`, {
        tempo: novoTempo
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Altera status do leilão
   * @param leilaoId
   * @param status
   * @returns {Promise<>}
   */
  alterarStatusLeilao (leilaoId, status) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/leiloes/${leilaoId}/status/${status}`)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Pausa temporariamente um leilão
   * @param leilaoId
   * @param motivo
   * @returns {Promise<>}
   */
  pausaLeilao (leilaoId, motivo = null) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/leiloes/${leilaoId}/pausar`, {
        motivo: motivo
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Retoma um leilão pausado
   * @param leilaoId
   * @returns {Promise<>}
   */
  retomarLeilao (leilaoId) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/leiloes/${leilaoId}/retomar`)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Altera incremento do lote
   * @param loteId
   * @param valor
   * @returns {Promise<>}
   */
  alterarIncrementoLote (loteId, valor) {
    return new Promise((resolve, reject) => {
      this.http.patch(`/api/cmd/lotes/${loteId}/alterarIncremento`, {
        valor: valor
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Altera valor inicial do lote
   * @param loteId
   * @param valor
   * @returns {Promise<>}
   */
  alterarValorInicialLote (loteId, valor) {
    return new Promise((resolve, reject) => {
      this.http.patch(`/api/cmd/lotes/${loteId}/alterarValorInicial`, {
        valor: valor
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Altera valor mínimo do lote
   * @param loteId
   * @param valor
   * @returns {Promise<>}
   */
  alterarValorMinimoLote (loteId, valor) {
    return new Promise((resolve, reject) => {
      this.http.patch(`/api/cmd/lotes/${loteId}/alterarValorMinimo`, {
        valor: valor
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Altera o tempo dp cronômetro do leilão
   * @param leilaoId
   * @param valor
   * @returns {Promise<>}
   */
  alterarCronometroLeilao (leilaoId, valor) {
    return new Promise((resolve, reject) => {
      this.http.patch(`/api/cmd/leiloes/${leilaoId}/alteraCronometro`, {
        valor: valor
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Envia uma mensagem para todos os arrematantes/comitentes/usuarios,
   * em uma sala de um leilão ou em todos os leilões. Para todos ou para somente um arrematante.
   * @param mensagem
   * @param leilaoId
   * @param usuarioId
   * @returns {Promise<>}
   */
  enviarAvisoAuditorioVirtual (mensagem, leilaoId = null, usuarioId = null) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/leiloes/aviso`, {
        mensagem: mensagem,
        leilao: leilaoId,
        usuario: usuarioId
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Notifica alterações em lote para mudança em tempo real
   * @param loteId
   * @param novosDados
   * @returns {Promise<>}
   */
  notificaAlteracaoLote (loteId, novosDados) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/notificacao/alteracaoLote`, novosDados)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Notifica alterações em leilão para mudança em tempo real
   * @param leilaoId
   * @param novosDados
   * @returns {Promise<>}
   */
  notificaAlteracaoLeilao (leilaoId, novosDados) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/notificacao/alteracaoLeilao`, novosDados)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Notifica alterações em status de usuário para bloqueio/aprovação em tempo real
   * @param usuarioId
   * @param novoStatus
   * @returns {Promise<>}
   */
  notificaAlteracaoStatusUsuario (usuarioId, novoStatus) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/notificacao/alteracaoStatusUsuario`, {
        status: novoStatus
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   *
   * @param toUserId
   * @param message
   * @param subject
   * @returns {Promise<>}
   */
  sendChatMessage (toUserId, message, subject = null) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/chat/message`, {
        to: toUserId,
        subject: subject,
        message: message
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  chatIsTyping (toUserId) {
    // TODO: ... Use directly the Comunicator
  }

  /**
   * Atualiza o link da live/video
   * @returns {Promise<>}
   */
  defineUrlLive (leilaoId, url) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/leiloes/${leilaoId}/live`, {
        video: url
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Informa de um logout para evitar açõo do timeout e consistência na informação de conectados.
   * @returns {Promise<>}
   */
  userLogout () {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/notificacao/usuarioLogout`)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }

  /**
   * Envia uma mensagem pública para o auditório
   * @param leilaoId
   * @param mensagem
   * @returns {Promise<>}
   */
  mensagemAuditorio (leilaoId, mensagem) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/leilao/${leilaoId}/auditorioMensagemPublica`, {
        mensagem: mensagem
      })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    });
  }
}

export default Comunicator
