export const getLances = function (lote) {
  return new Promise(((resolve, reject) => {
    if(lote.lances && Array.isArray(lote.lances)){
      return resolve(lote.lances)
    }
    // todo: find lances by lote id
  }))
}
