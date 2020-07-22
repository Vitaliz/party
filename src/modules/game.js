import { Peer, util } from 'peerjs-esnext/dist/peerjs-esnext';
import { PEER_HOST, PEER_PATH } from '../utils/constants';
import globalBus, { createBus } from '../utils/bus';

export const SIGNAL = {
  HOST_WHO: 1,
  HOST_IS: 2,

  READY: 3,
  READY_SYNC: 4,

  META: 5,
  CONNECT: 6
};

export default class Game {
  constructor(meta, host) {
    this.id = +meta.vkUserId;

    this.timer = null;
    this.bus = createBus();
    this.connections = new Map();
    this.sync = new Set();

    this._meta = meta;
    this.meta = new Map();
    this.meta.set(this.id, this._meta);

    this.host = +host;
    this.peer = new Peer(String(meta.vkUserId), {
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
        bundlePolicy: 'max-compat',
        rtcMuxPolicy: 'negotiate'
      }
    });

    // react to errors
    this.peer.on('error', this.handleError.bind(this));

    // simple reconnect
    this.peer.on('disconnected', () => {
      if (!this.peer.destroyed) {
        this.peer.reconnect();
      }
    });

    // wait open state
    this.peer.on('open', () => {
      this.peer.on('connection', (connection) => {
        this.handleConnection(connection, (peerId) => {
          // send meta
          this.send(peerId, {
            signal: SIGNAL.META,
            payload: this._meta
          });

          // broadcast connect
          if (this.id === this.host) {
            this.broadcast({
              signal: SIGNAL.CONNECT,
              payload: peerId
            });
          }
        });
      });

      if (this.id === this.host) {
        // init immediately if host
        this._onInit();
      } else {
        // connect to host
        this.connect(this.host);
      }
    });
  }

  _onInit() {
    this.bus.emit('init');
  }

  _onReady(peerId, callback) {
    // Safari bug: open event !== ready connection
    // so just poll by timeout

    let syncTimer = null;
    let isReady = false;

    const readyHandler = (id) => {
      if (id === peerId) {
        isReady = true;
        this.bus.detach('peer:ready', readyHandler);
        callback();
      }
    };
    this.bus.on('peer:ready', readyHandler);

    const syncWaitLoop = () => {
      if (!isReady) {
        this.send(peerId, {
          signal: SIGNAL.READY
        });

        syncTimer = window.setTimeout(() => {
          syncWaitLoop();
        }, 200);
      } else {
        window.clearTimeout(syncTimer);
      }
    };

    syncWaitLoop();
  }

  handleConnection(connection, callback) {
    // react to errors
    connection.on('error', this.handleError.bind(this));
    // wait open state
    connection.on('open', () => {
      const peerId = +connection.peer;

      // ensure json serialization
      connection.serialization = 'json';
      connection.on('data', (data) => {
        // fake data?
        if (data) {
          this.handleData(peerId, data);
        }
      });

      // save connection
      this.connections.set(peerId, connection);

      // connection ready state
      this._onReady(peerId, () => {
        callback(peerId);
      });
    });
  }

  connect(peerId) {
    if (peerId === this.id) {
      // no need to connect to yourself
      return;
    }

    if (this.connections.has(peerId)) {
      // already connected
      return;
    }

    // connect manually
    const connection = this.peer.connect(String(peerId));

    // subscribe
    this.handleConnection(connection, (peerId) => {
      // send meta
      this.send(peerId, {
        signal: SIGNAL.META,
        payload: this._meta
      });

      // request for host
      this.send(peerId, {
        signal: SIGNAL.HOST_WHO
      });
    });
  }

  handleError(err) {
    // TODO: show error or something else
    console.error(err);
    globalBus.emit('app:error', err);
  }

  handleData(peerId, data) {
    switch (data.signal) {
      case SIGNAL.HOST_WHO:
        this._signalHostWho(peerId);
        break;
      case SIGNAL.HOST_IS:
        this._signalHostIs(peerId, data);
        break;
      case SIGNAL.META:
        this._signalMeta(peerId, data);
        break;
      case SIGNAL.CONNECT:
        this._signalConnect(peerId, data);
        break;
      case SIGNAL.READY:
        this._signalReady(peerId);
        break;
      case SIGNAL.READY_SYNC:
        this._signalReadySync(peerId);
        break;
    }
  }

  _signalHostWho(peerId) {
    this.send(peerId, {
      signal: SIGNAL.HOST_IS,
      payload: this.host
    });
  }

  _signalHostIs(peerId, data) {
    if (peerId === data.payload) {
      this.host = data.payload;
      this._onInit();
    } else {
      this.connect(data.payload);
    }
  }

  _signalMeta(peerId, data) {
    this.meta.set(peerId, data.payload);
    this.bus.emit('update');
  }

  _signalConnect(peerId, data) {
    if (peerId === this.host) {
      const isNeed =
        data.payload !== this.id &&
        data.payload !== this.host;

      if (isNeed) {
        this.connect(data.payload);
      }
    }
  }

  _signalReady(peerId) {
    this.send(peerId, {
      signal: SIGNAL.READY_SYNC
    });
  }

  _signalReadySync(peerId) {
    this.bus.emit('peer:ready', peerId);
  }

  send(peerId, data) {
    if (peerId === this.id) {
      this.handleData(peerId, data);
    } else {
      let connection = this.connections.get(peerId);

      if (connection) {
        connection.send(data);
      } else {
        const err = new Error('Connection not established');
        err.type = 'peer-unavailable';
        this.handleError(err);
      }
    }
  }

  broadcast(data) {
    // to self
    this.send(this.id, data);

    // to other
    this.connections.forEach((connection) => {
      connection.send(data);
    });
  }

  isSynchronized() {
    // (sync) gt or eq (other + self)
    return this.sync.size >= (this.connections.size + 1);
  }

  attach(callback) {
    if (this.bus) {
      this.bus.on('update', callback);
    }
  }

  detach(callback) {
    if (this.bus) {
      this.bus.detach('update', callback);
    }
  }

  destroy() {
    // ensure that timer is clear
    window.clearTimeout(this.timer);

    // firstly, destroy bus
    this.bus.detachAll();
    this.bus = null;

    // connections cannot destroy themselves...
    this.connections.forEach((connection) => {
      // ...so close each connection gracefully
      connection.close();
    });

    // finally clean up
    this.connections.clear();
    this.connections = null;

    // clear sync
    this.sync.clear();
    this.sync = null;

    // peer connection is awful so just destroy
    this.peer.removeAllListeners();
    this.peer.destroy();
    this.peer = null;
  }
}
Game.util = util;
