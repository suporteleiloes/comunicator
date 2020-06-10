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
   * Quando o incremento mínimo do lote é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {
   *    id: {Integer}
   *    incremento: {Float}
   *  }
   * }
   */
  alteracaoIncrementoLote: (data) => {
    return data;
  },

  /**
   * Quando o valor inicial do lance para o lote é alterado.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {
   *    id: {Integer}
   *    valorInicial: {Float}
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
   * Quando um comitente toma uma decisão de aprovar, rejeitar ou condicionar um lance em um determinado lote.
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {
   *    id: {Integer}
   *    status: {Integer}
   *  }
   */
  comitenteDecisaoStatusLote: (data) => {
    return data;
  }

};

if (typeof module !== 'undefined') {
  module.exports = Actions;
}
