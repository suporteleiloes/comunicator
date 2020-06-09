import Comunicator from '../src/index.js'
import RealtimeInterface from '../src/realtime-service/interface.js'

const com = new Comunicator('https://api.endpoint', 'gateway:connection:config', RealtimeInterface)

//
com.lance(1, 2400);

console.log(com.comunicator)
