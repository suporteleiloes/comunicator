const Status = require('../../../../helpers/LoteStatus')
const Lote = {
  data () {
    return {
    }
  },
  computed: {
    loteNumero () {
      if (this.lote && this.lote.numero && this.lote.numero !== 'null' && !Number.isNaN(Number(this.lote.numero))) {
        let str = String(this.lote.numero)
        let pad = '000'
        return pad.substring(0, pad.length - str.length) + str
      }
      return 'S/N'
    },
    loteStatusString () {
      if (this.lote.status === null) {
        return '-'
      }
      if (typeof Status.Status[this.lote.status] !== 'undefined') {
        return Status.Status[this.lote.status].title
      }
      return 'Status inválido'
    },
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {}
}

module.exports = Lote
