import { Peer } from 'peerjs-esnext/dist/peerjs';
import { PEER_HOST, PEER_PATH } from '../utils/constants';

export default class Game {
  constructor(userId) {
    this.state = {};
    this.connections = new Map();
    this.peer = new Peer(`${userId}`, {
      pingInterval: 1000,
      host: PEER_HOST,
      path: PEER_PATH,
      port: 443,
      secure: true,
      debug: process.env.NODE_ENV !== 'production' ? 3 : 1
    });
    this.peer.on('error', console.error); // TODO: show error or something else
    this.peer.on('connection', this.subscribe);

    this._sync = 0;
    this._retry = 0;
    this._timer = null;
  }

  setState(state) {
    if (state) {
      this.state = {
        ...this.state,
        ...state
      };
    }
  }

  isSynchronized() {
    return this._sync >= this.connections.size;
  }

  handleData(peerId, data) {
    switch (data.type) {
      case 'sync':
        // sync state
        this.setState(data.payload);
        // send success
        this.send('sync-success', { peerId });
        break;
      case 'sync-callback':
        // check success from sender
        if (data.payload.peerId === this.peer.id) {
          // one peer syncronised
          ++this._sync;

          // check that all peer synchronized
          if (this.isSynchronized()) {

            // reset
            window.clearTimeout(this._timer);
            this._retry = 0;
          }
        }
    }
  }

  connect(peerId) {
    this.subscribe(this.peer.connect(peerId));
  }

  subscribe(connection) {
    this.connections.set(connection.peer, connection);

    // ensure json serialization
    connection.serialization = 'json';
    connection.on('data', (data) => {
      // fake data?
      if (data) {
        this.handleData(connection.peer, data);
      }
    });
  }

  send(type, payload) {
    // broadcast
    this.connections.forEach((connection) => {
      connection.send({ type, payload });
    });
  }

  sync() {
    // clear old
    window.clearTimeout(this._timer);

    if (this._retry >= 3) {
      // TODO: show error or something else
      return;
    }

    // pending retry
    this._timer = window.setTimeout(() => {
      this.sync();
    }, 5000);

    // new iter
    ++this._retry;

    // count of synchronized peers
    this._sync = 0;

    // send current state
    this.send('sync', this.state);
  }
}
