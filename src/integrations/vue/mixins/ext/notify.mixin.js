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
        this.$interval = setInterval(() => {
          if (!this.comunicator) {
            console.log('Comunicator does not exists, try in 3 seconds to bind')
            return
          }
        }, 3000)
        this.comunicator._interceptors.push(this.bindMessage)
        clearInterval(this.$interval)
        isBinded = true
      }
    },
    unbindEvents () {
      // this.comunicator.off('lance', this.onLance)
      this.$interval && clearInterval(this.$interval)
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
      if (this.hasNotify(data)) {
        this['notify_' + this.notifyType(data)] && this['notify_' + this.notifyType(data)](data)
      }
    },
    hasNotify (event) {
      return event && event.notify
    },
    notifyType (event) {
      if (event && event.notify && event.notify.type) {
        return event.notify.type
      }
      return null
    }
  }
}

module.exports = Mixin
