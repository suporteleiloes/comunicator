import Status from '../../../../helpers/LoteStatus.js'
const Lote = {
  data () {
    return {
      lote: null
    }
  },
  computed: {
    loteNumero () {
      if (this.lote && this.lote.numero && this.lote.numero !== 'null' && !Number.isNaN(Number(this.lote.numero))) {
        const str = String(this.lote.numero)
        const pad = '000'
        return pad.substring(0, pad.length - str.length) + str
      }
      return 'S/N'
    },
    isFechado () {
      return Number(this.lote.status) !== Status.STATUS_ABERTO_PARA_LANCES
    },
    isPermitidoLance () {
      return Number(this.lote.status) === Status.STATUS_ABERTO_PARA_LANCES || Number(this.lote.status) === Status.STATUS_EM_PREGAO || Number(this.lote.status) > 10000
    },
    loteStatusString () {
      if (this.lote.status === null) {
        return '-'
      }
      if (typeof Status.StatusFake[this.lote.status] !== 'undefined') {
        return Status.StatusFake[this.lote.status].title
      }
      return 'Status inválido'
    },
    fotos () {
      const fotos = []
      if (this.lote.bem.image) {
        fotos.push({id: 0, url: this.lote.bem.image.min.url, full: this.lote.bem.image.full.url})
      }
      const fotosSite = this.lote.bem.arquivos.slice().filter(ft => ft.site)
      if (fotosSite && fotosSite.length) {
        return [
          ...fotos,
          ...fotosSite
        ]
      }
      return fotos
    },
    lanceInicial () {
      return this.valorAtual
    },
    lanceIncremento () {
      return Number(this.lote.valorIncremento)
    },
    valorIncremento5x () {
      return Number(this.lote.valorIncremento) * 5
    },
    ultimoLance () {
      if (!this.lote.lances || !this.lote.lances.length) {
        return null
      }
      return this.lote.lances[0]
    },
    lanceLocalidade () {
      if (this.ultimoLance) {
        return `${this.ultimoLance.autor.cidade} - ${this.ultimoLance.autor.uf}`
      }
      return null
    },
    valorAtual () {
      if (!this.ultimoLance) {
        if (!this.lote.valorInicial) {
          return 0
        }
        return Number(this.lote.valorInicial)
      }
      return Number(this.ultimoLance.valor)
    },
    lanceMinimo () {
      if (this.ultimoLance) {
        return Number(this.ultimoLance.valor) + Number(this.lote.valorIncremento)
      }
      if (!this.lote.valorInicial) {
        if (this.lote.valorIncremento) {
          return Number(this.lote.valorIncremento)
        }
        return 1 // TODO: Poder digitar
      }
      return Number(this.lote.valorInicial)
    },
    lanceVencedor () {
      return this.ultimoLance
    },
    lances () {
      if (!this.lote.lances || !this.lote.lances.length) {
        return null
      }
      return this.lote.lances
      // return this.lote.lances.sort((a, b) => Number(a.valor) > Number(b.valor))
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    /**
     * Verifica se a comunicação recebida do realtime é relacionada ao lote renderizado em tela
     * @param loteId
     * @returns {boolean}
     */
    isLoteComunication (loteId) {
      console.log(this.lote, this)
      if (!loteId) return false
      if (!this.lote) return false
      return loteId === this.lote.id
    },
    /**
     * Verifica um lance para ser processado
     * @param loteId
     * @param lance
     * @private
     */
    __parseLance (loteId, lance) {
      if (!this.isLoteComunication(loteId)) return
      this.__addLance(lance)
    },
    /**
     * Adiciona um lance na lista de lances
     * @param lance
     * @private
     */
    __addLance (lance) {
      this.$nextTick(() => {
        if (!Array.isArray(this.lote.lances)) {
          this.lote.lances = []
        }
        const testFind = this.lote.lances.find(l => l.id === lance.id)
        if (this.$arrematante && this.$arrematante.id && this.$arrematante.id !== lance.autor.id) {
          this.audioNotification && this.comunicatorClass.audios.lance.play()
        }
        !testFind && this.lote.lances.unshift(lance)
        this.ativaTimer() // TMP
      })
    },
    /**
     * Remove um lance
     * @param loteId
     * @param lanceId
     * @private
     */
    __removeLance (loteId, lanceId) {
      if (!this.isLoteComunication(loteId)) return
      const lance = this.lote.lances.find(lance => lance.id === lanceId)
      lance && this.lote.lances.splice(this.lote.lances.indexOf(lance), 1)
    },
    /**
     * Remove todos os lances
     * @param loteId
     * @private
     */
    __zeraLances (loteId) {
      if (!this.isLoteComunication(loteId)) return
      this.lote.lances = []
    },
    /**
     * Atualiza um lance modificado
     * @param lance
     * @private
     */
    __updateLance (lance) {
      const _lance = this.lote.lances.find(_lance => _lance.id === lance.id)
      this.lote.lances[this.lote.lances.indexOf(_lance)] = lance
    },
    /**
     * Prepara e retorna o valor do incremento com um multiplicador
     * @param n
     * @returns {*}
     */
    lanceIncrementoMultiplo (n) {
      return this.valorAtual + (this.valorIncremento5x * Number(n))
    },
    __alteracaoLote (data) {
      console.log('Altera dados do lote', data)
      if (!this.isLeilaoComunication(data)) return
      if (this.lote.id !== data.id) return
      this.lote = Object.assign({}, this.lote, data.lote)
    },
    /**
     * Altera o incremento do lote
     * @param data
     * @private
     */
    __alteracaoIncrementoLote (data) {
      if (!this.isLoteComunication(data.lote.id)) return
      this.lote = Object.assign({}, this.lote, data.lote)
    },

    /**
     * Altera o valor inicial do lote
     * @param data
     * @private
     */
    __alteracaoValorInicialLote (data) {
      if (!this.isLoteComunication(data.lote.id)) return
      this.lote = Object.assign({}, this.lote, data.lote)
    },

    /**
     * Altera o valor mínimo do lote
     * @param data
     * @private
     */
    __alteracaoValorMinimoLote (data) {
      if (!this.isLoteComunication(data.lote.id)) return
      this.lote = Object.assign({}, this.lote, data.lote)
    },

    /**
     * Altera o status do lote
     * @param data
     * @private
     */
    __statusLote (data) {
      if (!this.isLoteComunication(data.lote.id)) return
      this.lote = Object.assign({}, this.lote, data.lote)
      if (data.lote.status !== 2) {
        this.desativaTimer()
      } else {
        this.$nextTick(() => {
          this.ativaTimer()
        })
      }
    }
  }
}

export default Lote
