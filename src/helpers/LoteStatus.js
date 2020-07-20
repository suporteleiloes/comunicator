const STATUS_RASCUNHO = 0
const STATUS_ABERTO_PARA_LANCES = 1
const STATUS_EM_PREGAO = 2
const STATUS_HOMOLOGANDO = 5
const STATUS_VENDIDO = 100
const STATUS_CONDICIONAL = 7
const STATUS_SEM_LICITANTES = 8
const STATUS_BAIXA_OFERTA = 9
const STATUS_RETIRADO = 10
const STATUS_CANCELADO = 11

const STATUS_QUE_PRECISA_DE_LANCES = [STATUS_VENDIDO, STATUS_CONDICIONAL, STATUS_BAIXA_OFERTA]

const Status = {
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

module.exports = {
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
  Status
}
