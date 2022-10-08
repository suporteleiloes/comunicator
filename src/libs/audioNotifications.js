// Wrapper for test
/*if (typeof Audio === 'undefined') {
  var Audio = function (url) {
    return {
      play () {
        console.log(`Play audio url: ${url}.`)
      }
    }
  }
}*/

const AudioNotification = {
  lance: typeof Audio !== "undefined" && new Audio('https://static.suporteleiloes.com/global/audios/lance.mp3'),
  meuLance: typeof Audio !== "undefined" && new Audio('https://static.suporteleiloes.com/global/audios/meulance.mp3'),
  err: typeof Audio !== "undefined" && new Audio('https://static.suporteleiloes.com/global/audios/error.mp3'),
  vendido: typeof Audio !== "undefined" && new Audio('https://static.suporteleiloes.com/global/audios/vendido.mp3')
}

export default AudioNotification
