const audios = require('./libs/audioNotifications.js')

class Comunicator {
  constructor (gateway, comunicator, axiosInstance) {
    this.gatewayEnv = gateway;
    this.comunicator = comunicator;
    this.http = axiosInstance
    this.audios = audios
  }

  /**
   * Efetua um novo lance
   * @param loteId
   * @param valor
   * @param valor
   * @returns {Promise<>}
   */
  lance (loteId, valor, apelido = null) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/lotes/${loteId}/lance`, {
        valor: valor,
        apelido: apelido
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
   * Altera tempo do cronômetro do lote
   * @param loteId
   * @param novoTempo
   * @returns {Promise<>}
   */
  alterarCronometroLote (loteId, novoTempo) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/cmd/lotes/${loteId}/alterarCronometro`, {
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
}

if (typeof module !== 'undefined') {
  module.exports = Comunicator;
}
