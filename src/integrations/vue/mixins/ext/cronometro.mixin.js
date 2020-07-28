var differenceInSeconds = require('date-fns/differenceInSeconds')
var isAfter = require('date-fns/isAfter')
var add = require('date-fns/add')
console.log(isAfter)
const Cronometro = {
  data () {
    return {}
  },
  computed: {
    timerPregao () {
      let timer
      if (this.lote && this.lote.cronometro) {
        timer = this.lote.cronometro
      } else if (typeof this.leilao['timerPregao'] !== 'undefined' && !Number.isNaN(Number(this.leilao.timerPregao))) {
        timer = this.leilao.timerPregao
      } else {
        timer = 10
      }
      timer = parseInt(+timer)
      if (Number(this.lote.status) === 2) {
        // Ativa cronômetro
        const pregao = this.lote.historicoPregao.find(h => !h.dataEncerramento)
        if (!pregao) {
          return timer
        }
        if (this.ultimoLance) {
          // Existe lance. Verificar se o lance é ante sou depois do status pregao
          if (isAfter(this.ultimoLance.data.date, pregao.dataAbertura.date)) {
            // Lance foi depois da abertura do pregão do lote, calcular o cronômetro baseando-se na data do lance
            timer = differenceInSeconds(
              this.ultimoLance.data.date,
              add(this.ultimoLance.data.date, {seconds: timer})
            )
          } else {
            // Calcula cronometro baseando-se na data de abertura do pregao
            timer = differenceInSeconds(
              pregao.dataAbertura.date,
              add(pregao.dataAbertura.date, {seconds: timer})
            )
          }
        }
      }
      return timer
    },
    timerPregaoFormatado () {
      const timer = Number(this.timerPregao)
      if (timer < 60) {
        return '00:' + ('0' + timer).slice(-2)
      }
      let hora = Math.floor(timer / 60)
      let minutos = timer % 60
      return ('0' + hora).slice(-2) + ':' + ('0' + minutos).slice(-2)
    }
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
