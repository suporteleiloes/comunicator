let isBinded = false

const Mixin = {
  mounted () {
    this.$nextTick(() => {
      this.bindEvents()
    })
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
        console.log(this.comunicator)
        this.comunicator._interceptors.push(this.bindMessage)
        isBinded = true
      }
    },
    unbindEvents () {
      // this.comunicator.off('lance', this.onLance)
      isBinded = false
    },
    bindMessage (data) {
      console.log('Bind message interceptor', data)
    }
  }
}

module.exports = Mixin
