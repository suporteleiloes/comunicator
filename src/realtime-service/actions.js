const Actions = {

  /**
   * Quando o sistema recebe um novo lance em um lote. Pode ser da plateia ou de um arrematante online.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {
   *    id: {Integer}
   *    lance: {
   *      id: {Integer}
   *      data: {Datetime}
   *      valor: {Decimal}
   *      arrematante: {
   *        id: {Integer}
   *        apelido: {String} (e.g.: TIAGOFELIPE)
   *        pessoa: {
   *          id: {Integer}
   *          essencial: {
   *            cidade: {String}
   *            uf: {String}
   *          }
   *        }
   *      }
   *    }
   *  }
   * }
   */
  lance: (data) => {
    return data;
  },

  /**
   * Quando o controlador deleta um lance.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {
   *    id: {Integer}
   *    lance: {Integer}
   *  }
   * }
   */
  lanceDeletado: (data) => {
    return data;
  },

  /**
   * Quando lote tem todos os lances zerados
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {
   *    id: {Integer}
   *  }
   * }
   */
  lancesZerados: (data) => {
    return data;
  },

  /**
   * Quando um leilão é aberto para o público online (sala online)
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   * }
   */
  aberturaLeilao: (data) => {
    return data;
  },

  /**
   * Quando um leilão é encerrado para o público online (sala online)
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   * }
   */
  encerramentoLeilao: (data) => {
    return data;
  },

  /**
   * Quando o controlador renova o cronômetro do lote.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {
   *    id: {Integer}
   *    status: {Integer}
   *    tempo: {Integer}
   *  }
   * }
   */
  renovarCronometro: (data) => {
    return data;
  },

  /**
   * Quando o lote em leilão é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {Object}
   * }
   */
  mudaLote: (data) => {
    return data;
  },

  /**
   * Quando o status de um lote é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {
   *    id: {Integer}
   *    status: {Integer}
   *  }
   * }
   */
  statusLote: (data) => {
    return data;
  },

  /**
   * Quando o status de um leilão é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  status: {Integer}
   * }
   */
  statusLeilao: (data) => {
    return data;
  },

  /**
   * Quando o cronômetro do lote (não do leilão) é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  tempo: {Integer}
   * }
   */
  alteracaoCronometroLote: (data) => {
    return data;
  },

  /**
   * Quando o cronômetro do leilão do leilão é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  tempo: {Integer}
   * }
   */
  alteracaoCronometroLeilao: (data) => {
    return data;
  },

  /**
   * Quando o leilão é temporariamente pausado
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  motivo: {String}
   * }
   */
  pausaLeilao: (data) => {
    return data;
  },

  /**
   * Quando o leilão é retomado
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   * }
   */
  retomarLeilao: (data) => {
    return data;
  },

  /**
   * Quando recebe um aviso em um ou todos os auditórios virtual
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer},
   *  usuario: {Interger}
   *  mensagem: {String},
   *  type: {String} info,alert,danger,positive
   * }
   */
  avisoAuditorioVirtual: (data) => {
    return data;
  },

  /**
   * Quando o valor de incremento do lote é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  lote: {
   *    id: {Integer}
   *    valorIncremento: {Float},
   *    leilao: {
   *      id: {Integer}
   *    }
   *  }
   * }
   */
  alteracaoIncrementoLote: (data) => {
    return data;
  },

  /**
   * Quando o valor inicial do lote é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  lote: {
   *    id: {Integer}
   *    valorInicial: {Float},
   *    leilao: {
   *      id: {Integer}
   *    }
   *  }
   * }
   */
  alteracaoValorInicialLote: (data) => {
    return data;
  },

  /**
   * Quando o lote é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {LoteObject}
   * }
   */
  alteracaoLote: (data) => {
    return data;
  },

  /**
   * Quando o leilão é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {LeilaoObject}
   * }
   */
  alteracaoLeilao: (data) => {
    return data;
  },

  /**
   * Quando o status de um usuário é alterado
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  usuario: {Integer}
   *  status: {Integer}
   * }
   */
  alteracaoStatusUsuario: (data) => {
    return data;
  },

  /**
   * Quando um usuário recebe uma mensagem
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  from: {
   *    id: {Integer},
   *    username: {String},
   *    name: {String},
   *  },
   *  to: {
   *    id: {Integer},
   *    username: {String},
   *    name: {String},
   *  }
   *  subject: {String},
   *  message: {String},
   * }
   */
  onMessageReceive: (data) => {
    return data;
  },

  /**
   * Quando um usuário faz login ou entra em uma tela específica
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  user: {Integer}
   *  type: {String} (login|screen)
   *  screen: {String},
   *  date: {Datetime}
   * }
   */
  onLogin: (data) => {
    return data;
  },

  /**
   * Quando um usuário faz logout ou sai de uma tela específica
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  user: {Integer}
   *  type: {String} (login|screen)
   *  screen: {String},
   *  date: {Datetime},
   *  reason: {String}
   * }
   */
  onLogout: (data) => {
    return data;
  },

  /**
   * Quando um comitente toma uma decisão de aprovar, rejeitar ou condicionar um lance em um determinado lote.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {
   *    id: {Integer}
   *    status: {Integer}
   *  },
   *  mensagem: {String}
   */
  comitenteDecisaoStatusLote: (data) => {
    return data;
  },

  /**
   * Quando a url da live/video do leilão é atualizada
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {
   *    id: {Integer}
   *    video: {String}
   *  }
   * }
   */
  liveLeilao: (data) => {
    return data;
  },

  /**
   * Quando um comando adicional é enviado para o usuário
   * Exemplos: Ser redirecionado para uma página, abrir um vídeo, efetuar um lance (help) ou outros comandos que vão
   * depender da aplicação e suas necessidades, então não teria como prever de forma fixa cada comando.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  comando: {String}
   *  parametros: {Object}
   * }
   */
  comando: (data) => {
    return data;
  }

};

if (typeof module !== 'undefined') {
  module.exports = Actions;
}
