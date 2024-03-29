import {differenceInSeconds, isAfter, add, sub, parseISO} from 'date-fns'
import * as StatusLeilao from "../../../../helpers/LeilaoStatus.js"
import * as StatusLote from "../../../../helpers/LoteStatus.js"
import LoteStatus, {STATUS_FAKE_DOULHE_UMA, STATUS_PREGAO} from "../../../../helpers/LoteStatus.js";
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
      hideTimer: false,
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
      return this.lote && StatusLote.STATUS_PREGAO.includes(this.lote.status)
    },
    timerPregao () {
      const timeleft = this.timeUltimaAtividade

      /**
       * Passa se robô for não estiver ativo, se cronômetro sempre ativo estiver desabilitado e o lote não esteja em pregão
       */
      if (!this.isRobo && !this.isLoteEmPregao && !this.isCronometroSempreAtivo) {
        const minutes = Math.floor(this.tempoCronometro / 60)
        const seconds = Math.floor(this.tempoCronometro % 60)
        return `${this.pad(minutes)}:${this.pad(seconds)}`
      }

      if (timeleft < 0) {
        return !this.isRobo || !this.isCronometroSempreAtivo ? '00:00' : `00:00:00`
      }

      const days = Math.floor(timeleft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeleft % (1000 * 60)) / 1000)
      if (!this.isRobo && !this.isCronometroSempreAtivo) {
        return `${this.pad(minutes)}:${this.pad(seconds)}`
      }
      // isRobo
      if (!this.isCronometroSempreAtivo) {
        // Cronômetro deve ativar somente no momento do encerramento
        if (this.lote.status !== StatusLote.STATUS_EM_PREGAO) {
          let tempo
          if (Number(this.lote.numero) === 1) {
            tempo = Math.abs(this.tempoIntervaloPrimeiroLote) || this.tempoCronometro
          } else {
            tempo = this.tempoCronometro
          }
          const minutes = Math.floor(tempo / 60)
          const seconds = Math.floor(tempo% 60)
          return `${this.pad(minutes)}:${this.pad(seconds)}`
        }
      }
      if (days > 0) {
        return `${days}d ${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
      }
      return !this.isCronometroSempreAtivo ? `${this.pad(minutes)}:${this.pad(seconds)}` : `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`
    },
    /**
     * @deprecated
     * @returns {string|string}
     */
    timerPregaoFormatado () {
      return this.timerPregao
    },
    percentTimeleft () {
      return this.isRobo || this.isLoteEmPregao ? this.calcPercentTimer() : 100
    }
  },
  mounted () {
    this.$nextTick(() => {
      if ((this.isCronometroSempreAtivo && this.leilao.status <=  StatusLeilao.STATUS_EM_LEILAO) || (this.lote && this.lote.status < 5)) {
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
    calcPercentTimer () {
      const secondsLeft =  Math.floor(this.timeUltimaAtividade / 1000)
      const timer = this.tempoCronometro
      // console.log('Seconds Left: ', secondsLeft)
      // console.log('Timer: ', timer)
      if (secondsLeft > timer) return 100
      if (secondsLeft <= 0) return 0
      // console.log('Downtimer', timeleft, (timeleft * (percent / 100)))
      return  Math.floor((secondsLeft * 100) / timer)
    },
    ativaTimer () {
      console.log('Ativando timer...')
      this.desativaTimer(true)
      if (!this.lote) {
        if (this.isCronometroSempreAtivo && this.leilao.status <= StatusLeilao.STATUS_EM_LEILAO) {
          if (!this.lote) {
            this.lote = {numero: 1, status: StatusLote.STATUS_ABERTO_PARA_LANCES}
          }
        } else {
          console.log('Lote inválido, impossível ativar o cronometro', this.lote)
          return
        }
      }
      if ((!this.isRobo || !this.isControleSimultaneo) && !this.isLoteEmPregao && !this.isCronometroSempreAtivo) {
        return
      }
      if (this.lote.status >= LoteStatus.STATUS_HOMOLOGANDO && this.lote.status !== StatusLote.STATUS_FAKE_DOULHE_UMA && this.lote.status !== StatusLote.STATUS_FAKE_DOULHE_DUAS) {
        return
      }
      const cb = () => {
        let ultimaAtividade, dataLimiteLances
        const now = this.comunicatorClass && this.comunicatorClass.getServertime() ? this.comunicatorClass.getServertime() : new Date().getTime()

        if (this.isVendaDireta) {
          if (this.isCronometroSempreAtivo) {
            ultimaAtividade = this.leilao.vendaDireta && this.leilao.dataLimitePropostas ? parseISO(this.leilao.dataLimitePropostas.date) : parseISO(this.leilao.dataProximoLeilao.date)
            const diff = ultimaAtividade - now
            this.timeUltimaAtividade = diff
          } else {
            this.desativaTimer(true)
          }
          return
        }

        if (this.isRobo) {
          ultimaAtividade = this.lote.dataFechamento ? parseISO(this.lote.dataFechamento.date) : parseISO(this.leilao.dataProximoLeilao.date)
          if (this.lote.dataLimiteLances) {
            dataLimiteLances = parseISO(this.lote.dataLimiteLances.date)
            if (isAfter(dataLimiteLances, ultimaAtividade)) {
              ultimaAtividade = dataLimiteLances
            }
          }
        } else {
          if (this.isCronometroSempreAtivo) {
            ultimaAtividade = parseISO(this.leilao.dataProximoLeilao.date)
          } else {
            const pregao = this.lote.historicoPregao ? this.lote.historicoPregao.find(h => !h.dataEncerramento) : null
            if (!pregao) {
              console.error('Não é possível ligar o cronômetro sem um pregão ativo para o lote')
              this.desativaTimer(true)
              return
            }
            // console.log('!!! TEM PREGÃO: ', pregao)
            ultimaAtividade = parseISO(pregao.dataAbertura.date)
            ultimaAtividade = add(ultimaAtividade, {seconds: (this.tempoCronometro)})
          }
        }
        if (!this.isRobo && this.ultimoLance) {
          const fechamento = this.lote.dataFechamento ? parseISO(this.lote.dataFechamento.date) : parseISO(this.leilao.dataProximoLeilao.date)
          // Existe lance. Verificar se o lance é antes ou depois do status pregao
          const dataLance = parseISO(this.ultimoLance.data.date)
          // console.log('!!! TEM LANCE: ', dataLance)
          if (isAfter(dataLance, sub(ultimaAtividade, {seconds: this.leilao.timerPregao}))) {
            // Lance foi depois da abertura do pregão do lote, calcular o cronômetro baseando-se na data do lance
            // this.ativaTimer(dataLance)
            // console.log('!!! LANCE DEPOIS DO PREGÃO')
            ultimaAtividade = add(dataLance, {seconds: this.leilao.timerPregao})
          } else {
            // console.log('!!! LANCE ANTES DO PREGÃO')
            // Calcula cronometro baseando-se na data de abertura do pregao
            // this.ativaTimer(dataPregao)
          }
        }

        const diff = ultimaAtividade - now
        this.timeUltimaAtividade = diff

        if (!this.isControleSimultaneo && this.lote.status < LoteStatus.STATUS_EM_PREGAO && (diff / 1000) < this.leilao.timerPregao) {
          this.timeUltimaAtividade = this.leilao.timerPregao * 1000
          this.hideTimer = true
          return
        }

        this.hideTimer = false

        this.verificarAcoesRobo()
        this.verificarAcoesLeilaoRobo()
      }
      cb()
      this.$intervalCronometro = setInterval(cb, 1000)
    },
    desativaTimer (force = false) {
      this.lote && console.log('Desativando timer do lote', this.lote.numero)
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
