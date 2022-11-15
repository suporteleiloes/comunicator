export const STATUS_RASCUNHO = 0
export const STATUS_ABERTO_PARA_LANCES = 1
export const STATUS_EM_PREGAO = 2
export const STATUS_HOMOLOGANDO = 5
export const STATUS_VENDIDO = 100
export const STATUS_CONDICIONAL = 7
export const STATUS_SEM_LICITANTES = 8
export const STATUS_BAIXA_OFERTA = 9
export const STATUS_RETIRADO = 10
export const STATUS_CANCELADO = 11

export const STATUS_FAKE_DOULHE_UMA = 10001
export const STATUS_FAKE_DOULHE_DUAS = 10002

export const STATUS_QUE_PRECISA_DE_LANCES = [STATUS_VENDIDO, STATUS_CONDICIONAL, STATUS_BAIXA_OFERTA]

export const STATUS_PREGAO = [STATUS_EM_PREGAO, STATUS_FAKE_DOULHE_UMA, STATUS_FAKE_DOULHE_DUAS]

export const Status = {
  [STATUS_RASCUNHO]: {title: 'Rascunho', class: 'lote-status-' + STATUS_RASCUNHO},
  [STATUS_ABERTO_PARA_LANCES]: {title: 'Aberto para lances', class: 'lote-status-' + STATUS_ABERTO_PARA_LANCES},
  [STATUS_EM_PREGAO]: {title: 'Em pregão', class: 'lote-status-' + STATUS_EM_PREGAO},
  [STATUS_HOMOLOGANDO]: {title: 'Homologando', class: 'lote-status-' + STATUS_HOMOLOGANDO},
  [STATUS_VENDIDO]: {title: 'Vendido', class: 'lote-status-' + STATUS_VENDIDO},
  [STATUS_CONDICIONAL]: {title: 'Condicional', class: 'lote-status-' + STATUS_CONDICIONAL},
  [STATUS_SEM_LICITANTES]: {title: 'Sem licitantes', class: 'lote-status-' + STATUS_SEM_LICITANTES},
  [STATUS_BAIXA_OFERTA]: {title: 'Baixa oferta', class: 'lote-status-' + STATUS_BAIXA_OFERTA},
  [STATUS_RETIRADO]: {title: 'Retirado', class: 'lote-status-' + STATUS_RETIRADO},
  [STATUS_CANCELADO]: {title: 'Cancelado', class: 'lote-status-' + STATUS_CANCELADO}
}

export const StatusFake = {
  ...Status,
  // Status fake, somente para mock data
  STATUS_FAKE_DOULHE_UMA: {title: 'Doulhe-uma', class: 'lote-status-doulhe-uma'}, // @TODO: Reajustar
  STATUS_FAKE_DOULHE_DUAS: {title: 'Doulhe-duas', class: 'lote-status-doulhe-duas'} // @TODO: Reajustar
}

export default {
  STATUS_RASCUNHO,
  STATUS_ABERTO_PARA_LANCES,
  STATUS_EM_PREGAO,
  STATUS_HOMOLOGANDO,
  STATUS_VENDIDO,
  STATUS_CONDICIONAL,
  STATUS_SEM_LICITANTES,
  STATUS_BAIXA_OFERTA,
  STATUS_RETIRADO,
  STATUS_CANCELADO,
  STATUS_QUE_PRECISA_DE_LANCES,
  Status,
  StatusFake
}
