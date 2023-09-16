export const STATUS_RASCUNHO = 0
export const STATUS_EM_BREVE = 1
export const STATUS_EM_LOTEAMENTO = 2
export const STATUS_ABERTO_PARA_LANCES = 3
export const STATUS_EM_LEILAO = 4
export const STATUS_REPASSE = 30
export const STATUS_CANCELADO = 96
export const STATUS_ADIADO = 97
export const STATUS_SUSPENSO = 98
export const STATUS_ENCERRADO = 99

export const STATUS_INTERNO_EM_PREPARACAO = 0
export const STATUS_INTERNO_PREPARADO = 1
export const STATUS_INTERNO_EM_LEILAO = 2
export const STATUS_INTERNO_EM_RECEBIMENTO = 3
export const STATUS_INTERNO_ENCERRADO = 100

export const LIST_STATUS_PERMITIDO_LANCE = [3, 4, 30]

export const Status = {
  [STATUS_RASCUNHO]: {title: 'Rascunho', class: 'leilao-status-' + STATUS_RASCUNHO},
  [STATUS_EM_BREVE]: {title: 'Em breve', class: 'leilao-status-' + STATUS_EM_BREVE},
  [STATUS_EM_LOTEAMENTO]: {title: 'Em loteamento', class: 'leilao-status-' + STATUS_EM_LOTEAMENTO},
  [STATUS_ABERTO_PARA_LANCES]: {title: 'Aberto para lances', class: 'leilao-status-' + STATUS_ABERTO_PARA_LANCES},
  [STATUS_EM_LEILAO]: {title: 'Em leilão', class: 'leilao-status-' + STATUS_EM_LEILAO},
  [STATUS_REPASSE]: {title: 'Repasse', class: 'leilao-status-' + STATUS_REPASSE},
  [STATUS_ENCERRADO]: {title: 'Finalizado', class: 'leilao-status-' + STATUS_ENCERRADO},
  [STATUS_CANCELADO]: {title: 'Cancelado', class: 'leilao-status-' + STATUS_CANCELADO},
  [STATUS_ADIADO]: {title: 'Adiado', class: 'leilao-status-' + STATUS_ADIADO},
  [STATUS_SUSPENSO]: {title: 'Suspenso', class: 'leilao-status-' + STATUS_SUSPENSO}
}

export const StatusInterno = {
  [STATUS_INTERNO_EM_PREPARACAO]: {title: 'Em preparação', class: 'leilao-status-interno-' + STATUS_INTERNO_EM_PREPARACAO},
  [STATUS_INTERNO_PREPARADO]: {title: 'Preparado', class: 'leilao-status-interno-' + STATUS_INTERNO_PREPARADO},
  [STATUS_INTERNO_EM_LEILAO]: {title: 'Em leilão', class: 'leilao-status-interno-' + STATUS_INTERNO_EM_LEILAO},
  [STATUS_INTERNO_EM_RECEBIMENTO]: {title: 'Em recebimento', class: 'leilao-status-interno-' + STATUS_INTERNO_EM_RECEBIMENTO},
  [STATUS_INTERNO_ENCERRADO]: {title: 'Fechado', class: 'leilao-status-interno-' + STATUS_INTERNO_ENCERRADO}
}

export const TIPO_ONLINE = 1
export const TIPO_PRESENCIAL = 2
export const TIPO_SIMULTANEO = 3

export const Tipo = {
  [TIPO_PRESENCIAL]: {title: 'Presencial', class: 'leilao-tipo-' + TIPO_PRESENCIAL},
  [TIPO_ONLINE]: {title: 'Online', class: 'leilao-tipo-' + TIPO_ONLINE},
  [TIPO_SIMULTANEO]: {title: 'Presencial e Online', class: 'leilao-tipo-' + TIPO_SIMULTANEO}
}
