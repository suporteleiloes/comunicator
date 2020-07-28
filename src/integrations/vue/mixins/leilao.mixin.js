/* eslint-disable */
const Status = require('../../../helpers/LoteStatus')
const Events = require('./bindEventListeners')
const Cronometro = require('./ext/cronometro.mixin')
const Lote = require('./ext/lote.mixin')

const Component = {
  mixins: [Events, Cronometro, Lote],
  data () {
    return {
      leilao: null,
      lote: null,
      hasPregao: false,
      hasNovoLance: false,
      valorLance: 0.00,
      isLancando: false,
      audioNotification: true
    }
  },
  computed: {
    isFechado () {
      return Number(this.lote.status) !== Status.STATUS_ABERTO_PARA_LANCES
    },
    lanceInicial () {
      return this.valorAtual
    },
    lanceIncremento () {
      return this.lote.valorIncremento
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
      if (this.ultimoLance){
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
      if (!this.lote.valorInicial) {
        if (this.lote.valorIncremento) {
          return this.lote.valorIncremento
        }
        return 1 // TODO: Poder digitar
      }
      return this.lote.valorInicial
    },
    lanceVencedor () {
      return this.ultimoLance
    },
    lances () {
      if (!this.lote.lances || !this.lote.lances.length) {
        return null
      }
      return this.lote.lances.sort((a, b) => Number(a.valor) > Number(b.valor))
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
      if(data.pregao && data.pregao.leilao) {
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
      if (!loteId) return false
      return loteId === this.lote.id
    },
    /**
     * Efetua um lance
     * Chama callbackLanceSucesso() em caso de sucesso e callbackLanceFalha() em caso de falha
     * @param autoAdicionar - Adiciona automaticamente o lance na lista de lances e não espera pelo realtime
     * @returns {Promise<object>}
     * @private
     */
    __efetuarLance (autoAdicionar = true) {
      return new Promise((resolve, reject) => {
        this.isLancando = true
        this.comunicatorClass.lance(this.lote.id, this.valorLance)
          .then((response) => {
            this.audioNotification && this.comunicatorClass.audios.meuLance.play()
            this.__addLance(response.data.lance)
            this.callbackLanceSucesso && this.callbackLanceSucesso(response.data)
            resolve(response)
          })
          .catch(error => {
            console.log(error)
            this.audioNotification && this.comunicatorClass.audios.err.play()
            this.callbackLanceFalha && this.callbackLanceFalha(error)
            reject(error)
          })
      })
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
      this.lote.lances.splice(this.lote.lances.indexOf(lance), 1)
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
      this.leilao = Object.assign({}, this.leilao, data.leilao)
    },

    __mudaLote (data) {
      console.log('Muda lote', data)
      if (!this.isLeilaoComunication(data)) return
      this.leilao.pregaoAtivo = data.pregao
      this.lote = data.pregao.lote
    },
  }
}

module.exports = Component
