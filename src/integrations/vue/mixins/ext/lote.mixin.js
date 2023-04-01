import Status from '../../../../helpers/LoteStatus.js'
import LoteStatus from "../../../../helpers/LoteStatus.js";
const Lote = {
  data () {
    return {
      lote: null,
      hasNovoLance: false
    }
  },
  computed: {
    loteNumero () {
      if (this.lote && this.lote.numero && this.lote.numero !== 'null' && !Number.isNaN(Number(this.lote.numero))) {
        return String(this.lote.numeroString || this.lote.numero)
      }
      return 'S/N'
    },
    loteNumeroPad () {
      if (this.lote && this.lote.numero && this.lote.numero !== 'null' && !Number.isNaN(Number(this.lote.numero))) {
        const str = String(this.lote.numeroString || this.lote.numero)
        const pad = '000'
        return pad.substring(0, pad.length - str.length) + str
      }
      return 'S/N'
    },
    isFechado () {
      return Number(this.lote.status) > Status.STATUS_HOMOLOGANDO && Number(this.lote.status) < 1000
    },
    isLotePregao () {
      return Number(this.lote.status) === Status.STATUS_EM_PREGAO
    },
    isPermitidoLance () {
      return Number(this.lote.status) === Status.STATUS_ABERTO_PARA_LANCES || Number(this.lote.status) === Status.STATUS_EM_PREGAO || Number(this.lote.status) > 10000
    },
    isPermitidoLanceParcelado () {
      return this.leilao.permitirParcelamento && this.lote.permitirParcelamento
    },
    isHomologando () {
      return Number(this.lote.status) === Status.STATUS_HOMOLOGANDO
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
      if (this.lote.bem.arquivos && this.lote.bem.arquivos.length) {
        const fotosSite = this.lote.bem.arquivos.slice().filter(ft => ft.site)
        if (fotosSite && fotosSite.length) {
          return [
            ...fotos,
            ...fotosSite
          ]
        }
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
    penultimoLance () {
      if (!this.lote.lances || !this.lote.lances.length) {
        return null
      }
      return this.lote.lances.length > 1 ? this.lote.lances[1] : null
    },
    lanceLocalidade () {
      if (this.ultimoLance) {
        return `${this.ultimoLance.autor.cidade} - ${this.ultimoLance.autor.uf}`
      }
      return null
    },
    valorAtual () {
      if (!this.ultimoLance) {
        if (!this.valorInicialAtual) {
          return 0
        }
        return Number(this.valorInicialAtual)
      }
      return Number(this.ultimoLance.valor)
    },
    valorInicialAtual () {
      if (this.leilao.instancia === 1) {
        return Number(this.lote.valorInicial)
      }
      if (this.leilao.praca === 2) {
        return Number(this.lote.valorInicial2)
      }
      if (this.leilao.praca === 3) {
        return Number(this.lote.valorInicial3)
      }
      return Number(this.lote.valorInicial)
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
    },
    maximoParcelas () {
      if (!this.hasParcelamentoLote) {
        return this.leilao.parcelamentoQtdParcelas
      }
      return this.lote.parcelamentoQtdParcelas
    },
    parcelamentoEntrada () {
      if (!this.hasParcelamentoLote) {
        return this.leilao.parcelamentoMinimoEntrada
      }
      return this.lote.parcelamentoMinimoEntrada
    },
    parcelas () {
      const parcelas = parseInt(this.maximoParcelas)
      if (!parcelas || isNaN(parcelas)) {
        return [{label: '1 vez', value: 1}]
      }
      const p = []
      for (let i = 2; i <= parseInt(parcelas); i++) {
        p.push({label: i + ' vezes', value: Number(i)})
      }
      return p
    },
    lanceParceladoEntradaMinima () {
      if (this.lote.parcelamentoMinimoEntrada !== this.leilao.parcelamentoMinimoEntrada) {
        return this.lote.parcelamentoMinimoEntrada || 0
      }
      return this.leilao.parcelamentoMinimoEntrada || 0
    },
    lanceParceladoError () {
      return Number(this.lanceParceladoEntrada) < this.lanceParceladoEntradaMinima
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
      this.notifica && this.notifica('lance', lance)
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
        if (this.$timeoutNovoLance) {
          clearTimeout(this.$timeoutNovoLance) //
        }
        if (lance.lote && lance.lote.dataLimiteLances) {
          this.lote.dataLimiteLances = lance.lote.dataLimiteLances
        }
        this.hasNovoLance = true
        this.$timeoutNovoLance = setTimeout(() => {
          this.hasNovoLance = false
        }, 5000)
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
      if (!this.lote || this.lote.id !== data.lote.id) return
      this.lote = Object.assign({}, this.lote, data.lote)
      this.ativaTimer()
    },
    /**
     * Altera o incremento do lote
     * @param data
     * @private
     */
    __alteracaoIncrementoLote (data) {
      if (!this.isLoteComunication(data.lote.id)) return
      this.lote = Object.assign({}, this.lote, data.lote)
      this.notifica && this.notifica('alteracaoIncremento', data)
    },

    /**
     * Altera o valor inicial do lote
     * @param data
     * @private
     */
    __alteracaoValorInicialLote (data) {
      if (!this.isLoteComunication(data.lote.id)) return
      this.lote = Object.assign({}, this.lote, data.lote)
      this.notifica && this.notifica('alteracaoValorInicial', data)
    },

    /**
     * Altera o valor mínimo do lote
     * @param data
     * @private
     */
    __alteracaoValorMinimoLote (data) {
      if (!this.isLoteComunication(data.lote.id)) return
      this.lote = Object.assign({}, this.lote, data.lote)
      this.notifica && this.notifica('alteracaoMinimo', data)
    },

    /**
     * Altera o status do lote
     * @param data
     * @private
     */
    __statusLote (data) {
      this.notifica && this.notifica('statusLote', data)
      if (!this.isLoteComunication(data.lote.id)) return
      this.lote = Object.assign({}, this.lote, data.lote)
      if (data.lote.status !== 2) {
        this.desativaTimer()
      } else {
        this.$nextTick(() => {
          this.ativaTimer()
        })
      }
    },
    verificarAcoesRobo () {
      if (this.isRobo) {
        const timeleft = Math.round(this.timeUltimaAtividade / 1000)
        if (this.lote.status <= LoteStatus.STATUS_EM_PREGAO || this.lote.status === LoteStatus.STATUS_HOMOLOGANDO) {
          if (timeleft > 0) {
            if (!this.isControleSimultaneo) return
            if (timeleft <= this.tempoCronometro) {
              // console.log('Lote ' + this.lote.numero, timeleft, this.tempoCronometro, Math.abs(this.tempoIntervaloPrimeiroLote))
              this.lote.status = LoteStatus.STATUS_EM_PREGAO
            } else {
              // console.log('XXX Lote ' + this.lote.numero, timeleft, this.tempoCronometro, Math.abs(this.tempoIntervaloPrimeiroLote))
              this.lote.status = LoteStatus.STATUS_ABERTO_PARA_LANCES
            }
          }
          if (timeleft < -1 && timeleft > -6) {
            if (this.lote.status < LoteStatus.STATUS_HOMOLOGANDO) {
              this.lote.status = LoteStatus.STATUS_HOMOLOGANDO
            }
          } else if (timeleft < -6) {
            // @TODO: Chamar Stats para verificar homologação.
            if (this.lote.status < LoteStatus.STATUS_HOMOLOGANDO) {
              this.lote.status = LoteStatus.STATUS_HOMOLOGANDO
            }
            if (this.ultimoLance) {
              // this.lote.status = LoteStatus.STATUS_VENDIDO
            } else {
              // this.lote.status = LoteStatus.STATUS_SEM_LICITANTES
            }
          }
        }
      }
    }
  }
}

export default Lote
