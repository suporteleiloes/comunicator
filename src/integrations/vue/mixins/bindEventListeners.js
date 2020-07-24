let isBinded = false

const events = [
  'lance',
  'lanceDeletado',
  'lancesZerados',
  'aberturaLeilao',
  'encerramentoLeilao',
  'renovarCronometro',
  'mudaLote',
  'statusLote',
  'statusLeilao',
  'alteracaoCronometroLote',
  'alteracaoCronometroLeilao',
  'pausaLeilao',
  'retomarLeilao',
  'avisoAuditorioVirtual',
  'alteracaoIncrementoLote',
  'alteracaoValorInicialLote',
  'alteracaoLote',
  'alteracaoLeilao',
  'alteracaoStatusUsuario',
  'onMessageReceive',
  'onLogin',
  'onLogout',
  'comitenteDecisaoStatusLote'
]

const Mixin = {
  created () {
    this.bindEvents()
  },
  beforeDestroy () {
    this.unbindEvents()
  },
  methods: {
    /**
     * Bind all events from realtime.
     * Is necessary to exists comunicator and comunicatorClass in the context
     */
    bindEvents () {
      if (!isBinded) {
        events.map(e => {
          this.comunicator && this.comunicator.on(e, this['on' + e.charAt(0).toUpperCase() + e.slice(1)])
        })
        isBinded = true
      }
    },
    unbindEvents () {
      events.map(e => {
        this.comunicator && this.comunicator.on(e, this['on' + e.charAt(0).toUpperCase() + e.slice(1)])
      })
      isBinded = false
    },
    onAberturaLeilao (data) {
      this.__abrirLeilao && this.__abrirLeilao(data)
    },
    onEncerramentoLeilao (data) {
      this.__encerrarLeilao && this.__encerrarLeilao(data)
    },
    onLance (data) {
      this.__parseLance && this.__parseLance((data.lote ? data.lote.id : data.lote), data)
    },
    onLanceDeletado (data) {
      this.__deleteLance && this.__deleteLance((data.lote ? data.lote.id : data.lote), data)
    },
    onLancesZerados (data) {
      this.__zeraLances && this.__zeraLances(data)
    },
    onRenovarCronometro (data) {
      this.__renovarCronometro && this.__renovarCronometro(data)
    },
    onMudaLote (data) {
      this.__mudaLote && this.__mudaLote(data)
    },
    onStatusLote (data) {
      this.__statusLote && this.__statusLote(data)
    },
    onStatusLeilao (data) {
      this.__statusLeilao && this.__statusLeilao(data)
    },
    onAlteracaoCronometroLote (data) {
      this.__alteracaoCronometroLote && this.__alteracaoCronometroLote(data)
    },
    onAlteracaoCronometroLeilao (data) {
      this.__alteracaoCronometroLeilao && this.__alteracaoCronometroLeilao(data)
    },
    onPausaLeilao (data) {
      this.__pausaLeilao && this.__pausaLeilao(data)
    },
    onRetomarLeilao (data) {
      this.__retomarLeilao && this.__retomarLeilao(data)
    },
    onAvisoAuditorioVirtual (data) {
      this.__avisoAuditorioVirtual && this.__avisoAuditorioVirtual(data)
    },
    onAlteracaoIncrementoLote (data) {
      this.__alteracaoIncrementoLote && this.__alteracaoIncrementoLote(data)
    },
    onAlteracaoValorInicialLote (data) {
      this.__alteracaoValorInicialLote && this.__alteracaoValorInicialLote(data)
    },
    onAlteracaoLote (data) {
      this.__alteracaoLote && this.__alteracaoLote(data)
    },
    onAlteracaoLeilao (data) {
      this.__alteracaoLeilao && this.__alteracaoLeilao(data)
    },
    onAlteracaoStatusUsuario (data) {
      this.__alteracaoStatusUsuario && this.__alteracaoStatusUsuario(data)
    },
    onOnMessageReceive (data) {
      this.__onMessageReceive && this.__onMessageReceive(data)
    },
    onOnLogin (data) {
      this.__onLogin && this.__onLogin(data)
    },
    onOnLogout (data) {
      this.__onLogout && this.__onLogout(data)
    },
    onComitenteDecisaoStatusLote (data) {
      this.__comitenteDecisaoStatusLote && this.__comitenteDecisaoStatusLote(data)
    }
  }
}

module.exports = Mixin
