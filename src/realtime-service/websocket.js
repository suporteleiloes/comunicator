class WebsocketInterface {
  constructor (uri, config) {
    this.uri = uri
    if (!window.WebSocket) {
      console.error('Browser does not support Websocket protocol')
      return
    }
    this._comunicator = new WebSocket(uri);
  }

  driver () {
    return this._comunicator
  }
}

export default WebsocketInterface
