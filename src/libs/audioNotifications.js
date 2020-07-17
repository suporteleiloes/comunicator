const AudioNotification = {
  lance: new Audio('https://static.suporteleiloes.com/global/audios/lance.mp3'),
  meuLance: new Audio('https://static.suporteleiloes.com/global/audios/meulance.mp3'),
  err: new Audio('https://static.suporteleiloes.com/global/audios/error.mp3'),
  vendido: new Audio('https://static.suporteleiloes.com/global/audios/vendido.mp3')
}

if (typeof module !== 'undefined') {
  module.exports = AudioNotification;
}
