const Cronometro = {
  data () {
    return {
    }
  },
  computed: {
    timerPregao () {
      let timer
      if (this.lote && this.lote.cronometro){
        timer = this.lote.cronometro
      } else if (typeof this.leilao['timerPregao'] !== 'undefined' && !Number.isNaN(Number(this.leilao.timerPregao))) {
        timer = this.leilao.timerPregao
      } else {
        timer = 10
      }
      return parseInt(+timer)
    },
    timerPregaoFormatado () {
      const timer = Number(this.timerPregao)
      if (timer < 60) {
        return '00:' + ('0' + timer).slice(-2)
      }
      let hora = Math.floor(timer / 60)
      let minutos = timer % 60
      return ('0' + hora).slice(-2) + ':' + ('0' + minutos).slice(-2)
    },
  },
  mounted () {
    this.$nextTick(() => {
      // this.bindEvents()
    })
  },
  beforeDestroy () {
    // this.unbindEvents()
  },
  methods: {
    __alteracaoCronometroLeilao (data) {
      console.log('CRONOMETRO UPDATE', data)
      if (!this.isLeilaoComunication(data)) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
    },
    calcPercentTimer (percent) {
      let downTimer = this.timerPregao
      return (downTimer * (percent / 100))
    }
  }
}

module.exports = Cronometro
