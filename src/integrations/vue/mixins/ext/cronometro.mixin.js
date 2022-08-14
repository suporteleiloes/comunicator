/* eslint-disable */
var differenceInSeconds = require('date-fns/differenceInSeconds')
var isAfter = require('date-fns/isAfter')
var add = require('date-fns/add')
var sub = require('date-fns/sub')
var parseISO = require('date-fns/parseISO')
if (differenceInSeconds.default) {
  differenceInSeconds = differenceInSeconds.default
  isAfter = isAfter.default
  add = add.default
  sub = sub.default
  parseISO = parseISO.default
}
const Cronometro = {
  data () {
    return {
      counter: 0,
      timeUltimaAtividade: null,
      timeLimite: null,
      servertime: null,
      timerActive: false
    }
  },
  computed: {
    timerIntervalo () {
      return this.leilao && this.leilao.timerIntervalo ? this.leilao.timerIntervalo : this.lote.leilao.timerIntervalo
    },
    timerPregao () {
      const timeleft = this.timeUltimaAtividade

      if (timeleft < 0) {
        return `00:00:00`
      }

      const days = Math.floor(timeleft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeleft % (1000 * 60)) / 1000)
      if (days > 0) {
        return `${days}d ${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
      }
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
    },
    timerPregaoFormatado () {
      return this.timerPregao
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.lote && this.lote.status < 5) {
        this.ativaTimer()
      }
    })
  },
  watch: {
    lote () {
      if (this.lote && this.lote.status < 5) {
        this.ativaTimer()
      }
    }
  },
  beforeDestroy () {
    this.$intervalCronometro && clearInterval(this.$intervalCronometro)
    // this.unbindEvents()
  },
  methods: {
    pad (n) {
      return n < 10 ? '0' + n : n
    },
    getTimer () {
      let timer
      if (this.lote && this.lote.cronometro) {
        timer = this.lote.cronometro
      } else if (typeof this.leilao.timerPregao !== 'undefined' && !Number.isNaN(Number(this.leilao.timerPregao))) {
        timer = this.leilao.timerPregao
      } else {
        timer = 10
      }
      return parseInt(+timer)
    },
    __alteracaoCronometroLeilao (data) {
      console.log('CRONOMETRO UPDATE', data)
      if (!this.isLeilaoComunication(data)) return
      this.leilao = Object.assign({}, this.leilao, data.leilao)
    },
    __alteracaoCronometroLote (data) {
      console.log('CRONOMETRO LOTE UPDATE', data)
      if (!data.lote || !data.lote.id) {
        return
      }
      if (!this.isLoteComunication(data.lote.id)) return
      this.lote = Object.assign({}, this.lote, data.lote)
    },
    calcPercentTimer (percent) {
      const downTimer = this.getTimer()
      console.log('Downtimer', downTimer, (downTimer * (percent / 100)))
      return (downTimer * (percent / 100))
    },
    ativaTimer () {
      console.log('Ativando timer...')
      if (!this.lote.numero) {
        console.log('Número do lote inválido, impossível ativar o cronometro')
      }
      this.$intervalCronometro && clearInterval(this.$intervalCronometro)
      this.$intervalCronometro = setInterval(() => {
        console.log('TIMER LOTE ', this.lote.numero)
        let loteNumero =  Number(this.lote.numero)
        if (loteNumero > 150 && loteNumero < 300) {
          loteNumero = loteNumero - 150
        }
        if (loteNumero > 300) {
          loteNumero = loteNumero - 300
        }
        const now = this.comunicatorClass && this.comunicatorClass.getServertime() ? this.comunicatorClass.getServertime() : new Date().getTime()
        let ultimaAtividade = parseISO(this.leilao.dataProximoLeilao.date)
        ultimaAtividade = add(ultimaAtividade, {seconds: (this.timerIntervalo * loteNumero)})
        if (this.ultimoLance) {
          // Existe lance. Verificar se o lance é antes ou depois do status pregao
          const dataLance = parseISO(this.ultimoLance.data.date)
          //console.log('!!! TEM LANCE: ', dataLance)
          if (isAfter(dataLance, sub(ultimaAtividade, {seconds: this.leilao.timerPregao}))) {
            // Lance foi depois da abertura do pregão do lote, calcular o cronômetro baseando-se na data do lance
            // this.ativaTimer(dataLance)
            console.log('!!! LANCE DEPOIS DO PREGÃO')
            ultimaAtividade = add(dataLance, {seconds: this.leilao.timerPregao})
          } else {
            //console.log('!!! LANCE ANTES DO PREGÃO')
            // Calcula cronometro baseando-se na data de abertura do pregao
            // this.ativaTimer(dataPregao)
          }
        }
        this.timeUltimaAtividade = ultimaAtividade - now
      }, 1000)
    },
    desativaTimer () {
      if (this.leilao.controleSimultaneo || this.leilao.cronometroSempreAtivo) return
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
