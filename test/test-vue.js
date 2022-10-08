import Vue from 'vue'
import LoteMixin from '../src/integrations/vue/mixins/leilao.mixin.js'

Vue.runtimeCompiler = true
console.log('Test vue...');

var app = new Vue({
  el: '#app',
  runtimeCompiler: true,
  mixins: [LoteMixin],
  data: {
    message: 'Hello Vue!'
  },
  mounted () {
    console.log('Vue instance started')
  }
})

// app.$mount()
