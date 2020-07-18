import { Peer } from 'peerjs-esnext/dist/peerjs-esnext';
import { PEER_HOST, PEER_PATH } from '../utils/constants';
import { createBus } from '../utils/bus';

export default class Game {
  constructor(user) {
    this._meta = user;
    this._sync = new Set();
    this._retry = 0;
    this._timer = null;
    this._bus = createBus();

    this.state = {};
    this.connections = new Map();
    this.meta = new Map();
    this.peer = new Peer(String(user.vkUserId), {
      pingInterval: 1000,
      host: PEER_HOST,
      path: PEER_PATH,
      port: 443,
      secure: true,
      debug: process.env.NODE_ENV !== 'production' ? 3 : 1,
      config: {
        iceServers: [{
          url: 'stun:stun.ezavalishin.ru',
          urls: 'stun:stun.ezavalishin.ru'
        }, {
          url: 'turn:turn.ezavalishin.ru',
          urls: 'turn:turn.ezavalishin.ru',
          credential: 'pinkod',
          username: 'webrtc'
        }, {
          url: 'turns:turn.ezavalishin.ru',
          urls: 'turns:turn.ezavalishin.ru',
          credential: 'pinkod',
          username: 'webrtc'
        }],
        iceTransportPolicy: 'all',
        sdpSemantics: 'unified-plan',
        bundlePolicy: 'max-compat'
      }
    });
    // react to errors
    this.peer.on('error', this.handleError.bind(this));
    // wait open state
    this.peer.on('open', () => {
      this.peer.on('connection', this.handleConnection.bind(this));
      this._bus.emit('init');
    });
  }

  destroy() {
    // connections cannot destroy themselves...
    this.connections.forEach((connection) => {
      // ...so close each connection gracefully...
      connection.close();
    });
    // ...but peer connection is awful so just destroy
    this.peer.destroy();
  }

  setState(state) {
    if (state) {
      this.state = {
        ...this.state,
        ...state
      };
      this._bus.emit('update');
    }
  }

  handleError(err) {
    // TODO: show error or something else
    console.error(err);
  }

  handleConnection(connection) {
    this.subscribe(connection);
  }

  handleData(peerId, data) {
    switch (data.type) {
      case 'sync':
        // sync state
        this.setState(data.payload);
        // send success
        this.broadcast('sync-success', { vkUserId: peerId });
        break;
      case 'sync-callback':
        // check peer
        if (peerId === data.payload.vkUserId) {
          // one peer syncronized
          this._sync.add(peerId);

          // check that all peer synchronized
          if (this.isSynchronized()) {
            // reset
            window.clearTimeout(this._timer);
            this._retry = 0;

            // emit success
            this._bus.emit('update');
          }
        }
        break;
      case 'meta':
        // check peer
        if (peerId === data.payload.vkUserId) {
          this.meta.set(peerId, data.payload);
          this._bus.emit('update');
        }
        break;
    }
  }

  connect(peerId) {
    // connect manually
    this.handleConnection(this.peer.connect(String(peerId)));
  }

  subscribe(connection) {
    // react to errors
    connection.on('error', this.handleError.bind(this));
    // wait open state
    connection.on('open', () => {
      // ensure json serialization
      connection.serialization = 'json';
      connection.on('data', (data) => {
        // fake data?
        if (data) {
          this.handleData(+connection.peer, data);
        }
      });

      // save connection
      this.connections.set(+connection.peer, connection);

      // send meta data
      connection.send({ type: 'meta', payload: this._meta });
    });
  }

  broadcast(type, payload) {
    // broadcast
    this.connections.forEach((connection) => {
      connection.send({ type, payload });
    });
  }

  isSynchronized() {
    return this._sync.size >= this.connections.size;
  }

  sync() {
    // clear old
    window.clearTimeout(this._timer);

    if (this._retry >= 3) {
      // TODO: show error or something else
      return;
    }

    if (this._retry === 0) {
      // synchronized peers
      this._sync.clear();
    }

    // pending retry
    this._timer = window.setTimeout(() => {
      this.sync();
    }, 5000);

    // new iter
    ++this._retry;

    // send current state
    this.broadcast('sync', this.state);
  }

  attach(callback) {
    this._bus.on('update', callback);
  }

  detach(callback) {
    this._bus.detach('update', callback);
  }
}
