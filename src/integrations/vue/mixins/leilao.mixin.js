/* eslint-disable */
// import Status from '../../../helpers/LoteStatus.js'
import * as StatusLeilao from '../../../helpers/LeilaoStatus.js'
import Events from './bindEventListeners.js'
import Cronometro from './ext/cronometro.mixin.js'
import Lote from './ext/lote.mixin.js'
import UserActions from './ext/userActions.mixin.js'

/**
 * Leilão important props
 * {
 *         id: null,
 *         controleAutomatico: false,
 *         cronometro: false,
 *         cronometroSempreAtivo: false,
 *         permitirLanceAutomatico: false,
 *         permitirLanceAntecipado: false,
 *         controleSimultaneo: false,
 *         timerPregao: 0,
 *         timerIntervalo: 0,
 *         controleTempoInicial: 0,
 *       }
 * @type {any}
 */

const Component = {
  mixins: [Events, Cronometro, Lote, UserActions],
  data () {
    return {
      leilao: null,
      lote: null,
      loteAnterior: null,
      loteProximo: null,
      hasNovoLance: false,
      valorLance: 0.00,
      parcelamento: null,
      isLancando: false,
      audioNotification: true
    }
  },
  computed: {
    hasCronometro () {
      return this.leilao && this.leilao.cronometro
    },
    isRobo () {
      return this.leilao && this.leilao.controleAutomatico
    },
    isControleSimultaneo () {
      return this.leilao && this.leilao.controleSimultaneo
    },
    isCronometroSempreAtivo () {
      return this.leilao && this.leilao.cronometroSempreAtivo
    },
    hasPregao () {
      return this.leilao.status === StatusLeilao.STATUS_EM_LEILAO
    }
  },
  methods: {
    /**
     * Verifica se a comunicação recebida do realtime é relacionada ao leilão renderizado em tela
     * @param data
     * @returns {boolean}
     */
    isLeilaoComunication (data) {
      let _data = data
      if (data.pregao && data.pregao.leilao) {
        _data = data.pregao
      }
      if (!_data || !_data.leilao || !_data.leilao.id) return false
      if (!this.leilao) return false
      return _data.leilao.id === this.leilao.id
    },
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
    /**
     * Quando um leilão é aberto (auditório virtual)
     * @param data
     * @private
     */
    __abrirLeilao (data) {
      if (!this.isLeilaoComunication(data)) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
      if (!data.leilao.pregaoAtivo || !data.leilao.pregaoAtivo.lote) {
        console.error('Não é possível abrir o leilão sem um lote ativo')
        return
      }
      this.lote = data.leilao.pregaoAtivo.lote
    },
    /**
     * Quando um leilão é fechado (auditório virtual)
     * @param data
     * @private
     */
    __encerrarLeilao (data) {
      if (!this.isLeilaoComunication(data)) return
      this.leilao = data.leilao
    },

    __mudaLote (data) {
      console.log('Muda lote', data)
      if (!this.isLeilaoComunication(data)) return
      if (typeof this.seguirLeilao !== 'undefined' && this.seguirLeilao === false) return
      this.leilao = Object.assign({}, this.leilao, {pregaoAtivo: data.pregao})
      if (this.lote) {
        this.loteAnterior = this.lote
      }
      this.lote = data.pregao.lote
      if (this.lote.status === 2) {
        this.ativaTimer()
      }
    },

    __alteracaoLote (data) {
      console.log('Altera dados do lote', data)
      if (!this.isLeilaoComunication(data)) return
      if (this.lote.id !== data.id) return
      this.lote = Object.assign({}, this.lote, data.lote)
    },

    __alteracaoLeilao (data) {
      console.log('Altera dados do leilão', data)
      if (!this.isLeilaoComunication(data)) return
      if (this.leilao.id !== data.id) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
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
    },
    /**
     * Altera o status do leilão
     * @param data
     * @private
     */
    __statusLeilao (data) {
      if (!this.isLeilaoComunication(data)) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
    },
    /**
     * Altera o video da live do leilão
     * @param data
     * @private
     */
    __liveLeilao (data) {
      if (!this.isLeilaoComunication(data)) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
    },
    /**
     * Processa um comando adicional
     * @TODO
     * @param data
     * @private
     */
    __proccessCommand (data) {
      if (data.comando === 'doulhe') {
        if (!this.isLoteComunication(data.parametros.id)) return
        this.lote.status = (10000 + Number(data.parametros.doulhe))
      }
      this.proccessCommand && this.proccessCommand(data)
    }
  }
}

export default Component
