/* eslint-disable */
// import Status from '../../../helpers/LoteStatus.js'
import * as StatusLeilao from '../../../helpers/LeilaoStatus.js'
import Events from './bindEventListeners.js'
import Cronometro from './ext/cronometro.mixin.js'
import Lote from './ext/lote.mixin.js'
import UserActions from './ext/userActions.mixin.js'
import {sub, parseISO} from 'date-fns'

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
  provide: function () {
    return {
      product: this
    }
  },
  data () {
    return {
      leilao: null,
      loteAnterior: null,
      loteProximo: null,
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
    },
    tempoCronometro () {
      return this.leilao.timerPregao || 0
    },
    tempoIntervaloPrimeiroLote () {
      return this.leilao.controleTempoInicial || 0
    },
    tempoIntervaloEntreLotes () {
      return this.leilao.timerIntervalo || 0
    },
    isPermitidoLanceAutomatico () {
      return this.leilao.permitirLanceAutomatico
    }
  },
  mounted() {
    this.verificarAcoesLeilaoRobo()
  },
  methods: {
    verificarAcoesLeilaoRobo () {
      if (this.isRobo) {
        let dataLeilao = parseISO(this.leilao.dataProximoLeilao.date)
        let dataLeilaoParaIniciar = sub(dataLeilao, {seconds: (60 * 5)})
        const now = this.comunicatorClass && this.comunicatorClass.getServertime() ? this.comunicatorClass.getServertime() : new Date().getTime()
        const tempoParaLeilao = dataLeilaoParaIniciar - now
        if (tempoParaLeilao < 0) {
          this.leilao.status = StatusLeilao.STATUS_EM_LEILAO
          this.leilao.statusMessage = StatusLeilao.Status[StatusLeilao.STATUS_EM_LEILAO].title
        }
      }
    },
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
      this.notifica && this.notifica('mudaLote', data)
    },
    __alteracaoLeilao (data) {
      console.log('Altera dados do leilão', data)
      if (!this.isLeilaoComunication(data)) return
      if (this.leilao.id !== data.leilao.id) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
      this.ativaTimer()
      this.notifica && this.notifica('alteracaoLeilao', data)
    },
    /**
     * Altera o status do leilão
     * @param data
     * @private
     */
    __statusLeilao (data) {
      if (!this.isLeilaoComunication(data)) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
      this.notifica && this.notifica('statusLeilao', data)
    },
    /**
     * Altera o video da live do leilão
     * @param data
     * @private
     */
    __liveLeilao (data) {
      if (!this.isLeilaoComunication(data)) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
      this.notifica && this.notifica('liveLeilao', data)
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
