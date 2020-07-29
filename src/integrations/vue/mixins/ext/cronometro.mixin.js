var differenceInSeconds = require('date-fns/differenceInSeconds')
var isAfter = require('date-fns/isAfter')
var add = require('date-fns/add')
var parseISO = require('date-fns/parseISO')
if (differenceInSeconds.default) {
  differenceInSeconds = differenceInSeconds.default
  isAfter = isAfter.default
  add = add.default
  parseISO = parseISO.default
}
const Cronometro = {
  data () {
    return {
      counter: 0,
      timeUltimaAtividade: null,
      timeLimite: null
    }
  },
  computed: {
    timerPregao () {
      let timer = this.getTimer()
      if (Number(this.lote.status) === 2) {
        // Ativa cronômetro
        const pregao = this.lote.historicoPregao.find(h => !h.dataEncerramento)
        if (!pregao || !this.timeUltimaAtividade || !this.timeLimite) {
          return timer
        }
        timer = differenceInSeconds(
          this.timeLimite,
          this.timeUltimaAtividade
        )
      }
      return timer < 0 ? 0 : timer
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
    getTimer () {
      let timer
      if (this.lote && this.lote.cronometro) {
        timer = this.lote.cronometro
      } else if (typeof this.leilao['timerPregao'] !== 'undefined' && !Number.isNaN(Number(this.leilao.timerPregao))) {
        timer = this.leilao.timerPregao
      } else {
        timer = 10
      }
      return timer = parseInt(+timer)
    },
    __alteracaoCronometroLeilao (data) {
      console.log('CRONOMETRO UPDATE', data)
      if (!this.isLeilaoComunication(data)) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
    },
    calcPercentTimer (percent) {
      let downTimer = this.getTimer()
      console.log('Downtimer', downTimer, (downTimer * (percent / 100)))
      return (downTimer * (percent / 100))
    },
    ativaTimer () {
      this.counter = 0
      this.timeUltimaAtividade = null
      this.timeLimite = null
      const pregao = this.lote.historicoPregao.find(h => !h.dataEncerramento)
      if (!pregao) {
        console.error('Não é possível ligar o cronômetro sem um pregão ativo para o lote')
        return
      }
      let ultimaAtividade = parseISO(pregao.dataAbertura.date)
      if (this.ultimoLance) {
        // Existe lance. Verificar se o lance é ante sou depois do status pregao
        let dataLance = parseISO(this.ultimoLance.data.date)
        if (isAfter(dataLance, ultimaAtividade)) {
          // Lance foi depois da abertura do pregão do lote, calcular o cronômetro baseando-se na data do lance
          // this.ativaTimer(dataLance)
          ultimaAtividade = dataLance
        } else {
          // Calcula cronometro baseando-se na data de abertura do pregao
          // this.ativaTimer(dataPregao)
        }
      }
      this.timeUltimaAtividade = ultimaAtividade
      this.timeLimite = add(ultimaAtividade, {seconds: this.getTimer()})
      this.$intervalCronometro = setInterval(() => {
        this.timeUltimaAtividade = add(this.timeUltimaAtividade, {seconds: 1})
      }, 1000)
    },
    desativaTimer () {
      this.counter = 0
      this.timeUltimaAtividade = null
      this.timeLimite = null
      if (this.$intervalCronometro) {
        clearInterval(this.$intervalCronometro)
      }
    }
  }
}

module.exports = Cronometro
