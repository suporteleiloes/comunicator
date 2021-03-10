const Status = require('../../../../helpers/LoteStatus')
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
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {}
}

module.exports = Lote
