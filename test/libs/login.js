import http from './http.js'

async function login (user, pass) {
  try {
    http.defaults.headers['uloc-mi'] = 'localhost'
    let session = await http.post(`/api/auth`,
      'user=' + user + '&pass=' + pass
    )
    let userData = session.data
    http.defaults.headers.common['Authorization'] = 'Bearer ' + userData.token
    console.log('Logado com sucesso.')
  } catch (e) {
    //console.log(e)
    throw new Error(e.message)
  }
    /*.then(response => {
      let userData = response.data
      http.defaults.headers.common['Authorization'] = 'Bearer ' + userData.token
      return resolve(userData)
    })
    .catch(({response}) => {
      return reject(commomErrors(response))
    })*/
}

export default login
