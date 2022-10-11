import {differenceInSeconds, isAfter, add, sub, parseISO} from 'date-fns'
// import * as StatusLeilao from "../../../../helpers/LeilaoStatus.js"
import * as StatusLote from "../../../../helpers/LoteStatus.js"
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
      servertime: null
    }
  },
  computed: {
    /* timerPregao () {
      let timer = this.getTimer()
      if (Number(this.lote.status) === 2 || Number(this.lote.status) > 10000) {
        // Ativa cronômetro
        const pregao = this.lote.historicoPregao ? this.lote.historicoPregao.find(h => !h.dataEncerramento) : null
        if (!pregao || !this.timeUltimaAtividade || !this.timeLimite) {
          return timer
        }
        timer = differenceInSeconds(
          this.timeLimite,
          this.timeUltimaAtividade
        )
      }
      return timer < 0 ? 0 : timer
    }, */
    isLoteEmPregao () {
      return this.lote.status === StatusLote.STATUS_EM_PREGAO
    },
    timerPregao () {
      const timeleft = this.timeUltimaAtividade


      console.log('TIMMMMMMMMMMMERRR', timeleft)

      /**
       * Passa se robô for não estiver ativo, se cronômetro sempre ativo estiver desabilitado e o lote não esteja em pregão
       */
      if (!this.isRobo && !this.isLoteEmPregao && !this.isCronometroSempreAtivo) {
        const minutes = Math.floor(this.tempoCronometro / 60)
        const seconds = Math.floor(this.tempoCronometro % 60)
        return `${this.pad(minutes)}:${this.pad(seconds)}`
      }

      if (timeleft < 0) {
        console.log('AQUIIIIIIIII')
        return !this.isRobo && !this.isCronometroSempreAtivo ? '00:00' : `00:00:00`
      }

      const days = Math.floor(timeleft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeleft % (1000 * 60)) / 1000)
      if (!this.isRobo && !this.isCronometroSempreAtivo) {
        return `${this.pad(minutes)}:${this.pad(seconds)}`
      }
      if (days > 0) {
        return `${days}d ${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
      }
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
    },
    /**
     * @deprecated
     * @returns {string|string}
     */
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
    // this.unbindEvents()
    this.desativaTimer(true)
  },
  methods: {
    pad (n) {
      return n < 10 ? '0' + n : n
    },
    /* getTimer () {
      let timer
      if (this.lote && this.lote.cronometro) {
        timer = this.lote.cronometro
      } else if (typeof this.leilao.timerPregao !== 'undefined' && !Number.isNaN(Number(this.leilao.timerPregao))) {
        timer = this.leilao.timerPregao
      } else {
        timer = 10
      }
      return parseInt(+timer)
    }, */
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
      const timeleft = this.timeUltimaAtividade
      console.log('Downtimer', timeleft, (timeleft * (percent / 100)))
      return (timeleft * (percent / 100))
    },
    /*ativaTimer () {
      console.log('Ativando timer...')
      this.desativaTimer() // prevent
      this.counter = 0
      this.timeUltimaAtividade = null
      this.timeLimite = null
      const pregao = this.lote.historicoPregao ? this.lote.historicoPregao.find(h => !h.dataEncerramento) : null
      if (!pregao) {
        console.error('Não é possível ligar o cronômetro sem um pregão ativo para o lote')
        return
      }
      console.log('!!! TEM PREGÃO: ', pregao)
      let ultimaAtividade = parseISO(pregao.dataAbertura.date)
      if (this.ultimoLance) {
        // Existe lance. Verificar se o lance é antes ou depois do status pregao
        const dataLance = parseISO(this.ultimoLance.data.date)
        console.log('!!! TEM LANCE: ', dataLance)
        if (isAfter(dataLance, ultimaAtividade)) {
          // Lance foi depois da abertura do pregão do lote, calcular o cronômetro baseando-se na data do lance
          // this.ativaTimer(dataLance)
          console.log('!!! LANCE DEPOIS DO PREGÃO')
          ultimaAtividade = dataLance
        } else {
          console.log('!!! LANCE ANTES DO PREGÃO')
          // Calcula cronometro baseando-se na data de abertura do pregao
          // this.ativaTimer(dataPregao)
        }
      }
      console.log('!!! ULTIMA ATIVIDADE', ultimaAtividade)
      this.timeUltimaAtividade = ultimaAtividade
      this.timeLimite = add(ultimaAtividade, {seconds: this.getTimer()})
      console.log('!!! LIMITE: ', this.timeLimite)
      this.$intervalCronometro = setInterval(() => {
        if (this.comunicatorClass && this.comunicatorClass.getServertime()) {
          this.timeUltimaAtividade = this.comunicatorClass.getServertime()
        } else {
          this.timeUltimaAtividade = add(this.timeUltimaAtividade, {seconds: 1})
        }
      }, 1000)
    },
    desativaTimer () {
      this.counter = 0
      this.timeUltimaAtividade = null
      this.timeLimite = null
      if (this.$intervalCronometro) {
        clearInterval(this.$intervalCronometro)
      }
    }*/
    ativaTimer () {
      console.log('Ativando timer...')
      if (!this.lote.numero) {
        console.log('Número do lote inválido, impossível ativar o cronometro', this.lote)
        return
      }
      if (!this.isRobo && !this.isLoteEmPregao && !this.isCronometroSempreAtivo) {
        return
      }
      this.$intervalCronometro && clearInterval(this.$intervalCronometro)
      const cb = () => {
        let ultimaAtividade
        console.log('TIMER LOTE ', this.lote.numero)
        const now = this.comunicatorClass && this.comunicatorClass.getServertime() ? this.comunicatorClass.getServertime() : new Date().getTime()
        if (this.isRobo) {
          let loteNumero = Number(this.lote.numero)
          ultimaAtividade = parseISO(this.leilao.dataProximoLeilao.date)
          if (loteNumero === 1) {
            ultimaAtividade = add(ultimaAtividade, {seconds: (this.tempoIntervaloPrimeiroLote)})
          } else {
            ultimaAtividade = add(ultimaAtividade, {seconds: (this.tempoIntervaloEntreLotes * loteNumero)})
          }
        } else {
          if (this.isCronometroSempreAtivo) {
            ultimaAtividade = parseISO(this.leilao.dataProximoLeilao.date)
          } else {
            const pregao = this.lote.historicoPregao ? this.lote.historicoPregao.find(h => !h.dataEncerramento) : null
            if (!pregao) {
              console.error('Não é possível ligar o cronômetro sem um pregão ativo para o lote')
              return
            }
            console.log('!!! TEM PREGÃO: ', pregao)
            ultimaAtividade = parseISO(pregao.dataAbertura.date)
            ultimaAtividade = add(ultimaAtividade, {seconds: (this.tempoCronometro)})
          }
        }
        if (this.ultimoLance) {
          // Existe lance. Verificar se o lance é antes ou depois do status pregao
          const dataLance = parseISO(this.ultimoLance.data.date)
          console.log('!!! TEM LANCE: ', dataLance)
          if (isAfter(dataLance, sub(ultimaAtividade, {seconds: this.leilao.timerPregao}))) {
            // Lance foi depois da abertura do pregão do lote, calcular o cronômetro baseando-se na data do lance
            // this.ativaTimer(dataLance)
            console.log('!!! LANCE DEPOIS DO PREGÃO')
            ultimaAtividade = add(dataLance, {seconds: this.leilao.timerPregao})
          } else {
            console.log('!!! LANCE ANTES DO PREGÃO')
            // Calcula cronometro baseando-se na data de abertura do pregao
            // this.ativaTimer(dataPregao)
          }
        }
        this.timeUltimaAtividade = ultimaAtividade - now
      }
      cb()
      this.$intervalCronometro = setInterval(cb, 1000)
    },
    desativaTimer (force = false) {
      console.log('Desativando timer do lote', this.lote.numero)
      if (force !== true && (this.leilao.controleSimultaneo || this.leilao.cronometroSempreAtivo)) return
      this.counter = 0
      this.timeUltimaAtividade = null
      this.timeLimite = null
      if (this.$intervalCronometro) {
        console.log('Intervalo existe')
        clearInterval(this.$intervalCronometro)
      }
    }
  }
}

export default Cronometro
