class Comunicator {
  constructor (gateway, comunicator, axiosInstance) {
    this.gatewayEnv = gateway;
    this.comunicator = comunicator;
    this.http = axiosInstance
  }

  lance (loteId, valor) {
    return new Promise((resolve, reject) => {
      this.http.post(`/api/lote/${loteId}/lance`, {
        valor: valor
      })
        .then(response => {

        })
        .catch(error => {

        })
    });
  }
}

if (typeof module !== 'undefined') {
  module.exports = Comunicator;
}
