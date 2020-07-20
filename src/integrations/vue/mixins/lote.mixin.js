const Status = require('../../../helpers/LoteStatus')
const Events = require('./bindEventListeners')

const Component = {
  mixins: [Events],
  data () {
    return {
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
    valorAtual () {
      if (!this.ultimoLance) {
        if (!this.lote.valorInicial) {
          return 0
        }
        return this.lote.valorInicial
      }
      return this.ultimoLance.valor
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
     * @param id
     * @private
     */
    __removeLance (id) {
      const lance = this.lote.lances.find(lance => lance.id === id)
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
    }
  }
}

module.exports = Component
