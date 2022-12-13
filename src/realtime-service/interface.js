import WebsocketInterface from './websocket.js'
import actions from './actions.js'
import devLog from '../helpers/log.js'
let _log = () => void (0)
if (process) {
  _log = devLog('dev')
}

/**
 * Comunicador v2.1.0
 * Responsável pela comunicação realtime entre os sistemas de leilão
 * Esta biblioteca deve prover uma transparência entre a aplicação e o tipo de serviço para comunicação,
 * seja ele websocket ou outro.
 * Author: Tiago Felipe <tiago@tiagofelipe.com>
 * +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=
 */

const Comunicator = (function () {

  const Comunication = function (uri, config, ComunicatorInterface) {

    /**
     * Holds the uri to connect to
     * @type {String}
     * @private
     */
    this._uri = uri;
    this._config = config;

    /**
     * If Comunicator driver is connected
     * @type {String|Array|Object}
     * @private
     */
    this._isConnected = false;

    /**
     * Inform if client has support to Comunicator techonology
     * @type boolean
     */
    this._hasSupport = false;

    /**
     * Attemps to reconnect case connection lost
     * @type int
     */
    this._attempts = 0;
    this._maxAttempts = null;
    this._intervalAttempts = null;
    this._closedByUser = false;

    /**
     * Session instance of connection
     * @type object|null
     */
    this._session = null;

    /**
     * Reliable events
     * @type int
     */
    this._events = ['com/connect', 'com/disconnect', 'com/error'];

    /**
     * Interceptors message
     * @type {*[]}
     */
    this._interceptors = [];

    /**
     * Topics subscribe
     * @type {*[]}
     */
    this.$_topics = [];

    /**
     * Class for Comunication provider
     */
    if (typeof ComunicatorInterface !== 'undefined') {
      this._comunicator = ComunicatorInterface;
      this._hasSupport = true;
    } else {
      if (window.WebSocket) {
        this._comunicator = WebsocketInterface;
        this._hasSupport = true;
      }
    }
    /**
     * Hold event callbacks
     * @type {Object}
     * @private
     */
    this._listeners = {};

    this.on('com/connect', (env) => {
      clearInterval(this._intervalAttempts);
      _log('Comunicator connection re-establish');
    });
    this.on('com/disconnect', (env) => {
      if (this._closedByUser) {
        _log('Closed by user. No need to reconnect');
        return;
      }
      // let hasLimit = _maxAttempts !== null
      clearInterval(this._intervalAttempts);
      this._intervalAttempts = setInterval(() => {

        if (this._maxAttempts === null) {
          _log('Comunicator connection lost, attempt to reconnect: ' + this._attempts + ' attempt');
        } else {
          _log('Comunicator connection lost, attempt to reconnect: ' + this._attempts + ' of ' + this._maxAttempts);
        }

        this._attempts = this._attempts + 1;
        this.connect();

      }, 10000) // 10 seconds
    });

    //calls the Comunication connect function.
    this.connect();
  };

  Comunication.prototype.hasSupport = function () {
    return this._hasSupport;
  }

  Comunication.prototype.connect = function () {

    if (!this._hasSupport) {
      //throw new Error('Browser no support realtime comunication provider');
      _log('Browser no support realtime comunication provider');
      return;
    }

    _log(`Connecting to ${this._uri}`)

    let com
    try {
      let service = new this._comunicator(this._uri, this._config);
      com = service.driver()
    } catch (e) {
      _log(e.message);
      this.fire({type: 'com/disconnect', data: {code: 0, reason: e.message}});
      return;
    }

    this._session = com;

    com.onopen = (env) => {
      this.fire({type: 'com/connect', data: env});
      this._isConnected = true;
    };
    com.onclose = (env) => {
      this.fire({type: 'com/disconnect', data: env})
      this._isConnected = false;
    }
    com.onmessage = (data) => this.parseMessage(data);
    com.onerror = (env) => this.fire({type: 'com/error', data: env})

  };

  /**
   * Close connection
   */
  Comunication.prototype.close = function () {
    this._closedByUser = true;
    this._session.close();
    this._session = null;
  }

  /**
   * Check if driver is connected
   *
   * @return boolean
   */
  Comunication.prototype.isConnected = function () {
    return this._isConnected;
  };

  /**
   * Adds a listener for an event type
   *
   * @param {String} type
   * @param {function} listener
   */
  Comunication.prototype.on = function (type, listener) {
    // Check if listener is valid on actions list
    if (typeof actions[type] === 'undefined' && typeof this._events.indexOf(type) === -1) {
      throw new Error(`Event '${type}' is invalid. No action exists.`);
    }
    if (typeof this._listeners[type] === 'undefined') {
      this._listeners[type] = [];
    }

    this._listeners[type].push(listener);
  };

  /**
   * Fires an event for all listeners.
   * @param {String} event
   */
  Comunication.prototype.fire = function (event) {
    if (typeof event === 'string') {
      event = {type: event};
    }
    if (!event.target) {
      event.target = this;
    }

    _log('Fire event ' + event.type + ' whith data: ', null, event.data)

    if (!event.type) {
      throw new Error('Event object missing *type* property.');
    }

    if (this._listeners[event.type] instanceof Array) {
      let listeners = this._listeners[event.type];
      for (let i = 0, len = listeners.length; i < len; i++) {
        listeners[i].call(this, event.data, event.type);
      }
    }
  };

  /**
   * Removes a listener from an event
   *
   * @param {String} type
   * @param {function} listener
   */
  Comunication.prototype.off = function (type, listener) {
    if (this._listeners[type] instanceof Array) {
      let listeners = this._listeners[type];
      for (let i = 0, len = listeners.length; i < len; i++) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          break;
        }
      }
    }
  };

  /**
   * Parse an message and process event, if valid
   *
   * @param Mixed data
   */
  Comunication.prototype.parseMessage = function (_event) {
    _log('Message received: ')
    _log(_event)
    if (this._interceptors && this._interceptors.length) {
      this._interceptors.map(fcn => {
        fcn && fcn(_event)
      })
    }
    if (typeof _event['data'] === 'undefined') {
      _log('Event without data');
      return;
    }

    let event;
    try {
      event = JSON.parse(_event.data)
    } catch (e) {
      _log('Invalid message, ignoring comunication. Reason: Message must be a valid JSON');
      return;
    }

    if (typeof event['_client'] !== 'undefined') {
      _log('Event with client predefined, need to check topics');
      if (!this.$_topics.includes(event['_client'])) {
        _log('You are not subscribed to the topic');
        return;
      }
      _log('Topic check');
    }

    if (typeof event['type'] === 'undefined') {
      _log('Invalid event, propert *type* is not defined');
      return;
    }

    // Verify if is an valid event
    if (typeof actions[event.type] === 'undefined') {
      _log(`Event *${event.type}* not found`);
      return;
    }

    if (typeof event['data'] === 'undefined') {
      _log('Event without data');
      return;
    }

    this.fire({type: event.type, data: actions[event.type](event.data)})

  };

  /**
   * Subscribe in an topic
   * @param {String} topic
   */
  Comunication.prototype.subscribe = function (topic) {
    _log(`Subscribe on topic ${topic}`, 1);
    if (!this.$_topics.includes(topic)) {
      this.$_topics.push(topic)
      _log(`Subscribe on ${topic} is now enabled`, 1);
    } else {
      _log(`Subscribe on ${topic} already exists, nothing to do`, 1);
    }
  };

  /**
   * Unsubscribe in an topic
   * @param {String} topic
   */
  Comunication.prototype.unsubscribe = function (topic) {
    _log(`Unsubscribe on topic ${topic}`, 1);
    if (this.$_topics.includes(topic)) {
      this.$_topics.push(topic)
      _log(`Unsubscribe on ${topic} successfully`, 1);
    } else {
      _log(`Unsubscribe on ${topic} is not necessary because topic is not subscribed, nothing to do`, 1);
    }
  };

  return {
    connect: function (uri, config, driver) {
      return new Comunication(uri, config, driver);
    }
  }

})();

export default Comunicator
