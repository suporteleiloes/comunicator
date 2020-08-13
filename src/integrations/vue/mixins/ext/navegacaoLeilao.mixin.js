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
    bindMessage (event) {
      console.log('Bind message interceptor', event)
      let data
      try {
        data = JSON.parse(event.data)
      } catch (e) {
        console.log('Invalid message, ignoring comunication. Reason: Message must be a valid JSON')
        return
      }
      if (this.hasLeilaoNavEvent(data)) {
        this['event_' + data.type] && this['event_' + data.type](data)
      }
    },
    hasLeilaoNavEvent (event) {
      return event && event.type && ['aberturaLeilao', 'mudaLote', 'statusLote', 'statusLeilao'].includes(event.type)
    }
  }
}

module.exports = Mixin
