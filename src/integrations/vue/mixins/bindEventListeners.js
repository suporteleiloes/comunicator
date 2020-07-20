let isBinded = false

const Mixin = {
  created () {
    this.bindEvents()
  },
  beforeDestroy () {
    this.unbindEvents()
  },
  methods: {
    /**
     * Bind all events from realtime.
     * Is necessary to exists comunicator and comunicatorClass in the context
     */
    bindEvents () {
      if (!isBinded) {
        this.comunicator.on('lance', this.onLance)
        isBinded = true
      }
    },
    unbindEvents () {
      this.comunicator.off('lance', this.onLance)
      isBinded = false
    },
    onLance (data) {
      this.__parseLance && this.__parseLance((data.lote ? data.lote.id : data.lote), data)
    }
  }
}

module.exports = Mixin
