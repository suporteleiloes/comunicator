import Status from '../../../../helpers/LoteStatus.js'
const Lote = {
  data () {
    return {}
  },
  computed: {
    loteNumero () {
      if (this.lote && this.lote.numero && this.lote.numero !== 'null' && !Number.isNaN(Number(this.lote.numero))) {
        const str = String(this.lote.numero)
        const pad = '000'
        return pad.substring(0, pad.length - str.length) + str
      }
      return 'S/N'
    },
    isFechado () {
      return Number(this.lote.status) !== Status.STATUS_ABERTO_PARA_LANCES
    },
    isPermitidoLance () {
      return Number(this.lote.status) === Status.STATUS_ABERTO_PARA_LANCES || Number(this.lote.status) === Status.STATUS_EM_PREGAO || Number(this.lote.status) > 10000
    },
    loteStatusString () {
      if (this.lote.status === null) {
        return '-'
      }
      if (typeof Status.StatusFake[this.lote.status] !== 'undefined') {
        return Status.StatusFake[this.lote.status].title
      }
      return 'Status inválido'
    },
    fotos () {
      const fotos = []
      if (this.lote.bem.image) {
        fotos.push({id: 0, url: this.lote.bem.image.min.url, full: this.lote.bem.image.full.url})
      }
      const fotosSite = this.lote.bem.arquivos.slice().filter(ft => ft.site)
      if (fotosSite && fotosSite.length) {
        return [
          ...fotos,
          ...fotosSite
        ]
      }
      return fotos
    },
    lanceInicial () {
      return this.valorAtual
    },
    lanceIncremento () {
      return Number(this.lote.valorIncremento)
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
      if (this.ultimoLance) {
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
      if (this.ultimoLance) {
        return Number(this.ultimoLance.valor) + Number(this.lote.valorIncremento)
      }
      if (!this.lote.valorInicial) {
        if (this.lote.valorIncremento) {
          return Number(this.lote.valorIncremento)
        }
        return 1 // TODO: Poder digitar
      }
      return Number(this.lote.valorInicial)
    },
    lanceVencedor () {
      return this.ultimoLance
    },
    lances () {
      if (!this.lote.lances || !this.lote.lances.length) {
        return null
      }
      return this.lote.lances
      // return this.lote.lances.sort((a, b) => Number(a.valor) > Number(b.valor))
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {}
}

export default Lote
