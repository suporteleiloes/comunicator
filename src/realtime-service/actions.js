/* eslint-disable */
/**
 * Actions — catálogo canônico de eventos WS que o realtime-service entende.
 *
 * AUDIT 2026-05-27: 8 eventos abaixo foram identificados como dead-code
 * backend (api-v2 V5 NÃO os emite — auditoria em `v5/CONTRATOS-WS.md` §3).
 * Mantidos como NO-OP (DEPRECATED) pra que componentes que ainda fazem
 * `on<NomeDoEvento>` no mixin não quebrem:
 *
 *   - renovarCronometro        → use 'alteracaoCronometroLote' / 'alteracaoCronometroLeilao'
 *   - pausaLeilao              → use 'statusLeilao' (status=98 SUSPENSO)
 *   - retomarLeilao            → use 'statusLeilao' (status=4 EM_LEILAO)
 *   - avisoAuditorioVirtual    → use 'comando' c/ comando=='mensagem'
 *   - alteracaoStatusUsuario   → sem substituto; planejado pra `presence.update`
 *   - onMessageReceive         → use 'chat:message:new' (CRM)
 *   - onLogin / onLogout       → sem substituto; planejado pra `presence.update`
 *
 * Quando remover: após confirmar (grep nas apps consumidoras) que ninguém
 * mais implementa `on<NomeDoEvento>` ou `__<nomeDoEvento>` correspondente.
 */
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
   * @deprecated 2026-05-27 — DEAD-CODE backend.
   * api-v2 V5 NUNCA emite `renovarCronometro`. O comando do controlador
   * (POST `/api/cmd/lotes/{id}/renovarCronometro`) chama internamente
   * `mudarStatusLote(STATUS_EM_PREGAO)` que emite `statusLote`.
   * Escute `alteracaoCronometroLote` ou `statusLote` ao invés.
   */
  renovarCronometro: (_data) => {
    return null;
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
   * @deprecated 2026-05-27 — DEAD-CODE backend.
   * Comando outgoing `/api/cmd/leiloes/X/pausar` existe, mas não emite
   * evento WS. Use `statusLeilao` (status=98 SUSPENSO) como gatilho.
   */
  pausaLeilao: (_data) => {
    return null;
  },

  /**
   * @deprecated 2026-05-27 — DEAD-CODE backend.
   * Idem `pausaLeilao` — use `statusLeilao` (status=4 EM_LEILAO).
   */
  retomarLeilao: (_data) => {
    return null;
  },

  /**
   * @deprecated 2026-05-27 — DEAD-CODE backend.
   * Comando outgoing `/api/cmd/leiloes/aviso` cai em `comando.mensagem`
   * (wrapper 'comando' com `comando=='mensagem'`). Use esse handler.
   */
  avisoAuditorioVirtual: (_data) => {
    return null;
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
   * @deprecated 2026-05-27 — DEAD-CODE backend.
   * Comando outgoing `/api/cmd/notificacao/alteracaoStatusUsuario` existe
   * mas sem emitter. Métricas de presença planejadas pra futuro
   * `presence.update` (gateway v2 §4.11 do CONTRATOS-WS).
   */
  alteracaoStatusUsuario: (_data) => {
    return null;
  },

  /**
   * @deprecated 2026-05-27 — DEAD-CODE backend.
   * Substituído por `chat:message:new` (Console CRM). Ver §2.22 do CONTRATOS-WS.
   */
  onMessageReceive: (_data) => {
    return null;
  },

  /**
   * @deprecated 2026-05-27 — DEAD-CODE backend.
   * Métricas de presença planejadas, não implementadas. Futuro:
   * `presence.update` (§4.11 do CONTRATOS-WS).
   */
  onLogin: (_data) => {
    return null;
  },

  /**
   * @deprecated 2026-05-27 — DEAD-CODE backend. Idem `onLogin`.
   */
  onLogout: (_data) => {
    return null;
  },

  /**
   * Quando um comitente toma uma decisão de aprovar, rejeitar ou condicionar um lance em um determinado lote.
   *
   * Nome canônico do evento no backend (api-v2 + gateway v2): `lote.aprovacao`.
   * Aliases legados aceitos durante a migração (~2 semanas): `aprovacao-lote`
   * (nome original emitido pelo `AprovacaoLoteEvent.php`) e `comitenteDecisaoStatusLote`
   * (este). Após a migração, manter SÓ `lote.aprovacao`.
   *
   * Histórico do bug: antes de 2026-05-27, o backend emitia `aprovacao-lote`
   * mas o cliente escutava `comitenteDecisaoStatusLote` — o evento NUNCA chegava
   * ao handler. Hoje o gateway normaliza ambos pro nome canônico e a API
   * V5 também emite o canônico diretamente.
   *
   * @param data
   * @return {Object|null}
   * Sample:
   * {
   *  leilao: {Integer}
   *  lote: {Integer}
   *  status: {Integer}
   *  numero: {String|Integer}
   * }
   */
  comitenteDecisaoStatusLote: (data) => {
    return data;
  },
  'lote.aprovacao': (data) => {
    return data;
  },
  'aprovacao-lote': (data) => {
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

export default Actions
