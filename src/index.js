class Comunicator {
  constructor (api, gateway, comunicator) {
    this.api = api;
    this.comunicator = comunicator;
  }

  lance (loteId, valor){
    console.log('Lance ', loteId, valor)
  }
}

export default Comunicator
