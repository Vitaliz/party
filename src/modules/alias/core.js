import Game from '../game';
import { secondsToTime } from '../../utils/date';

const DELTA_SYNC_TIME = 4; // 4s

export const CORE_SIGNAL = {
  SETTINGS_REQUEST: 1001,
  SETTINGS_RESPONSE: 1002,

  JOIN_REQUEST: 1003,
  JOIN_RESPONSE: 1004,

  READY_REQUEST: 1005,
  READY_RESPONSE: 1006,

  CONNECT_PEERS: 1007,
  CONNECT_SYNC: 1008,

  STAGE_WAIT: 2001,

  STAGE_START: 2002,
  STAGE_START_SYNC: 2003,

  STAGE_GAME: 2005,
  STAGE_GAME_TIMEOUT: 2006,

  STAGE_END: 2008,
  STAGE_END_SYNC: 2009,

  STAGE_RESULT: 2010,
  STAGE_VIEWER: 2011,
  STAGE_MEMBER: 2012,

  POINTS: 2013
};

export const STAGE = {
  WAIT: 0,
  START: 1,
  GAME: 2,
  END: 3,
  RESULT: 4,
  VIEWER: 5,
  MEMBER: 6
};

export default class Core extends Game {
  constructor(user, settings) {
    const host = settings.creator || user.vkUserId;
    super(user, host);

    if (settings.teams) {
      settings.teams.forEach((team) => {
        team.users = [];
        team.points = 0;
      });
    }

    this.settings = settings;
    this.current = {
      iter: 0,
      queue: 0,
      points: 0,
      peers: null,
      peer: null
    };
    this.stage = null;
  }

  maxUsersInTeam() {
    if (!this.settings.teams) {
      return 0;
    }
    return Math.ceil((this.connections.size + 1) / this.settings.teams.length);
  }

  _onInit() {
    super._onInit();
    if (!this.settings.teams) {
      this.send(this.host, {
        signal: CORE_SIGNAL.SETTINGS_REQUEST
      });
    }
  }

  _onNext() {
    const next = this._enqueue();

    this.current.peer = next;
    this.send(next, {
      signal: CORE_SIGNAL.STAGE_GAME_ACTIVE
    });
  }

  _onNextTeam() {
    const next = this._enqueueTeam();

    this.current.peers = next.users.map((user) => {
      return +user.vkUserId;
    });

    this.current.peers.forEach((peerId) => {
      this.send(peerId, {
        signal: CORE_SIGNAL.STAGE_START
      });
    });
  }

  _enqueue() {
    const iter = this.current.iter;

    ++this.current.iter;
    if (this.current.iter >= this.current.peers.length) {
      this.current.iter = 0;
    }

    return this.current.peers[iter];
  }

  _enqueueTeam() {
    const iter = this.current.queue;

    ++this.current.queue;
    if (this.current.queue >= this.settings.teams.length) {
      this.current.iter = 0;
    }

    return this.settings.teams[iter];
  }

  join(name) {
    this.send(this.host, {
      signal: CORE_SIGNAL.JOIN_REQUEST,
      payload: name
    });
  }

  ready() {
    if (this.host !== this.id) {
      this.send(this.host, {
        signal: CORE_SIGNAL.READY_REQUEST
      });
    } else {
      if (this.isSynchronized()) {
        const peers = Array.from(this.sync);
        this.sync.clear();

        this.broadcast({
          signal: CORE_SIGNAL.CONNECT_PEERS,
          payload: peers
        });
      }
    }
  }

  wait() {
    this._signalStageWait(this.id);
    this.broadcast({
      signal: CORE_SIGNAL.STAGE_WAIT
    });
  }

  start() {
    this.send(this.host, {
      signal: CORE_SIGNAL.STAGE_START_SYNC
    });
  }

  points(points) {
    this.send(this.host, {
      signal: CORE_SIGNAL.POINTS,
      payload: points
    });
  }

  handleData(peerId, data) {
    switch (data.signal) {
      case CORE_SIGNAL.SETTINGS_REQUEST:
        this._signalSettingsRequest(peerId);
        break;
      case CORE_SIGNAL.SETTINGS_RESPONSE:
        this._signalSettingsResponse(peerId, data);
        break;
      case CORE_SIGNAL.JOIN_REQUEST:
        this._signalJoinRequest(peerId, data);
        break;
      case CORE_SIGNAL.JOIN_RESPONSE:
        this._signalJoinResponse(peerId, data);
        break;
      case CORE_SIGNAL.READY_REQUEST:
        this._signalReadyRequest(peerId);
        break;
      case CORE_SIGNAL.READY_RESPONSE:
        this._signalReadyRespone(peerId);
        break;
      case CORE_SIGNAL.CONNECT_PEERS:
        this._signalConnectPeers(peerId, data);
        break;
      case CORE_SIGNAL.CONNECT_SYNC:
        this._signalConnectSync(peerId);
        break;
      case CORE_SIGNAL.STAGE_WAIT:
        this._signalStageWait(peerId);
        break;
      case CORE_SIGNAL.STAGE_START:
        this._signalStageStart(peerId);
        break;
      case CORE_SIGNAL.STAGE_START_SYNC:
        this._signalStageStartSync(peerId);
        break;
      case CORE_SIGNAL.STAGE_GAME:
        this._signalStageGame(peerId);
        break;
      case CORE_SIGNAL.STAGE_GAME_TIMEOUT:
        this._signalStageGameTimeout(peerId);
        break;
      case CORE_SIGNAL.STAGE_END:
        this._signalStageEnd(peerId);
        break;
      case CORE_SIGNAL.STAGE_END_SYNC:
        this._signalStageEndSync(peerId);
        break;
      case CORE_SIGNAL.STAGE_RESULT:
        this._signalStageResult(peerId);
        break;
      case CORE_SIGNAL.STAGE_VIEWER:
        this._signalStageViewer(peerId);
        break;
      case CORE_SIGNAL.STAGE_MEMBER:
        this._signalStageMember(peerId);
        break;
      case CORE_SIGNAL.POINTS:
        this._signalPoints(peerId, data);
        break;
      default:
        super.handleData(peerId, data);
        break;
    }
  }

  _signalPoints(peerId, data) {
    if (this.current.peers.includes(peerId)) {
      const team = this.settings.teams.find((team) => {
        return team.users.some((user) => {
          return +user.vkUserId === peerId;
        });
      });
      if (team) {
        team.points += data.payload;
      }
    }
  }

  _signalStageWait(peerId) {
    if (peerId === this.host) {
      this.stage = STAGE.WAIT;
      this.bus.emit('update');
    }
  }

  _signalStageStart(peerId) {
    if (peerId === this.host) {
      this.stage = STAGE.START;
      this.bus.emit('update');
    }
  }

  _signalStageStartSync(peerId) {
    this.sync.add(peerId);

    if (this.sync.size >= this.current.peers.length) {
      this.timer = window.setTimeout(() => {
        this._signalStageGameTimeout();
      }, secondsToTime(this.settings.time + DELTA_SYNC_TIME));

      this.current.peers.forEach((peer) => {
        this.send(peer, {
          signal: CORE_SIGNAL.STAGE_GAME
        });
      });
    }
  }

  _signalStageGameTimeout(peerId) {
    window.clearTimeout(this.timer);

    if (this.id === this.host) {
      this.broadcast({
        signal: CORE_SIGNAL.SETTINGS_RESPONSE,
        payload: this.settings
      });
      this.state.current.peers.forEach((peer) => {
        if (peer === this.id) {
          this._signalStageEnd(this.id);
        } else {
          this.send(peer, {
            signal: CORE_SIGNAL.STAGE_END
          });
        }
      });
    } else {
      if (peerId === this.host) {
        this.stage = STAGE.WAIT;
        this.bus.emit('update');
      }
    }
  }

  _signalStageGame(peerId) {
    if (peerId === this.host) {
      this.stage = STAGE.GAME;
      this.bus.emit('update');
    }
  }

  _signalStageEnd(peerId) {
    if (peerId === this.host) {
      this.stage = STAGE.END;
      this.bus.emit('update');
    }
  }

  _signalStageEndSync(peerId) {
    if (this.id === this.host) {
      this.sync.add(peerId);

      if (this.sync.size >= this.current.peers.length) {
        this.current.peers.forEach((peer) => {
          this.send(peer, {
            signal: CORE_SIGNAL.STAGE_WAIT
          });
        });

        this._onNext();
      }
    }
  }

  _signalStageResult(peerId) {
    if (peerId === this.host) {
      this.stage = STAGE.RESULT;
      this.bus.emit('update');
    }
  }

  _signalStageViewer(peerId) {
    if (peerId === this.host) {
      this.stage = STAGE.VIEWER;
      this.bus.emit('update');
    }
  }

  _signalStageMember(peerId) {
    if (peerId === this.host) {
      this.stage = STAGE.MEMBER;
      this.bus.emit('update');
    }
  }

  _signalConnectSync(peerId) {
    this.sync.add(peerId);

    if (this.isSynchronized()) {
      this.wait();
    }
  }

  _signalConnectPeers(peerId, data) {
    const exclude = [this.id, this.host, peerId];
    const peers = data.payload.filter((peer) => {
      return !exclude.includes(peer);
    });
    if (peers.length === 0) {
      this.send(this.host, {
        signal: CORE_SIGNAL.CONNECT_SYNC
      });
    } else {
      peers.forEach((peer) => {
        const connection = this.peer.connect(String(peer));
        this.handleConnection(connection, (peerId) => {
          this.sync.add(peerId);

          if (this.isSynchronized()) {
            this.send(this.host, {
              signal: CORE_SIGNAL.CONNECT_SYNC
            });
          }
        });
      });
    }
  }

  _signalReadyRequest(peerId) {
    this.sync.add(peerId);
    this.bus.emit('update');

    this.send(this.host, {
      signal: CORE_SIGNAL.READY_RESPONSE
    });
  }

  _signalReadyResponse(peerId) {
    this.sync.add(peerId);
  }

  _signalSettingsRequest(peerId) {
    this.send(peerId, {
      signal: CORE_SIGNAL.SETTINGS_RESPONSE,
      payload: this.settings
    });
  }

  _signalSettingsResponse(peerId, data) {
    if (peerId === this.host) {
      this.settings = {
        ...this.settings,
        ...data.payload
      };
      this.bus.emit('update');
    }
  }

  _signalJoinCheck(peerId, data) {
    const team = this.settings.teams.find((team) => {
      return team.name === data.payload;
    });
    if (!team || !team.users) {
      return false;
    }

    const isAlreadyJoined = team.users.some((user) => {
      return +user.vkUserId === peerId;
    });
    if (isAlreadyJoined) {
      return false;
    }

    const max = this.maxUsersInTeam();
    if (team.users.length >= max) {
      return false;
    }

    return true;
  }

  _signalJoinRequest(peerId, data) {
    const success = this._signalJoinCheck(peerId, data);

    const payload = {
      peerId,
      success,
      name: data.payload
    };

    if (success) {
      // to other
      this.broadcast({
        signal: CORE_SIGNAL.JOIN_RESPONSE,
        payload
      });

      // to self
      this.send(this.id, {
        signal: CORE_SIGNAL.JOIN_RESPONSE,
        payload
      });
    } else {
      this.send(peerId, {
        signal: CORE_SIGNAL.JOIN_RESPONSE,
        payload
      });
    }
  }

  _signalJoinResponse(peerId, data) {
    if (peerId === this.host) {
      const { payload } = data;
      if (payload.success && this.settings.teams) {
        this.settings.teams.forEach((team) => {
          team.points = 0;

          if (team.name === payload.name) {
            const user = this.id === payload.peerId ?
              this.meta : this.meta.get(payload.peerId);

            team.users = [
              ...team.users,
              user
            ];
          } else {
            team.users = team.users.filter((user) => {
              return user.vkUserId !== payload.peerId;
            });
          }
        });
        this.bus.emit('update');
      } else {
        // TODO: show error or something else
        console.error('join reject');
      }
    }
  }
}
