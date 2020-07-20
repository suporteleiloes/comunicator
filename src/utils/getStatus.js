export const getStatus = function (s, p) {
  if (typeof p[s] === 'undefined') {
    return {title: 'N/D', class: '', style: '', icon: ''}
  }
  return p[s]
}
