const Mixin = {
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
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
        this.comunicatorClass.lance(this.lote.id, this.valorLance, null, this.parcelamento)
            .then((response) => {
              this.audioNotification && this.comunicatorClass.audios.meuLance.play()
              this.__addLance(response.data.lance)
              this.callbackLanceSucesso && this.callbackLanceSucesso(response.data)
              this.statLanceSucess && this.statLanceSucess(response)
              resolve(response)
            })
            .catch(error => {
              console.log(error)
              this.audioNotification && this.comunicatorClass.audios.err.play()
              this.callbackLanceFalha && this.callbackLanceFalha(error)
              this.statLanceError && this.statLanceError(response)
              reject(error)
            })
      })
    },
  }
}

export default Mixin
