import Game from '../game';
import { secondsToTime } from '../../utils/date';
import { shuffle } from '../../utils/data';

const DELTA_SYNC_TIME = 2; // 2s

export const CORE_SIGNAL = {
  SETTINGS_REQUEST: 1001,
  SETTINGS_RESPONSE: 1002,

  JOIN_REQUEST: 1003,
  JOIN_RESPONSE: 1004,

  READY_REQUEST: 1005,
  READY_RESPONSE: 1006,

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
    // received creator or self
    const host = settings.creator || user.vkUserId;
    super(user, host);

    if (settings.teams) {
      // reset team
      settings.teams.forEach((team) => {
        team.users = [];
        team.peers = [];
        team.points = 0;
      });
    }

    // immutable in game
    this.settings = settings;

    // current game stage
    this.stage = null;

    // current game state
    this.current = {
      // current queue item
      item: {
        team: null,
        peer: null
      },

      // game lap
      lap: -1
    };

    // current queue
    this.queue = [];
  }

  maxUsersInTeam() {
    if (!this.settings.teams) {
      return 0;
    }
    return Math.ceil((this.connections.size + 1) / this.settings.teams.length);
  }

  getTeamByName(name) {
    if (!this.settings.teams) {
      return null;
    }
    return this.settings.teams.find((team) => {
      return team.name === name;
    });
  }

  _onInit() {
    super._onInit();
    if (!this.settings.teams) {
      // request settings from host
      this.send(this.host, {
        signal: CORE_SIGNAL.SETTINGS_REQUEST
      });
    }
  }

  _createQueue() {
    // [[{ team1, peer1 },{ team1, peer2 }], [{ team2, peer1 }]]
    const rawQueue = this.settings.teams.map((team) => {
      return team.peers.map((peerId) => {
        return {
          team: team.name,
          peer: peerId
        };
      });
    });

    let needAlignQueue = false;

    const maxTeamLength = rawQueue.reduce((acc, teamQueue) => {
      if (teamQueue.length > acc) {
        if (acc > 0) {
          needAlignQueue = true;
        }

        acc = teamQueue.length;
      }
      return acc;
    }, 0);

    // [[{ team1, peer1 },{ team1, peer2 }], [{ team2, peer1 },{ team2, peer1 }]]
    if (needAlignQueue) {
      // add queue item for each unaligned team
      rawQueue.forEach((teamQueue) => {
        while (teamQueue.length < maxTeamLength) {
          const randomQueue = shuffle(teamQueue);
          const alignLength = maxTeamLength - teamQueue.length;
          teamQueue.push(...randomQueue.slice(0, alignLength));
        }
      });
    }

    // [{ team1, peer1 },{ team2, peer1 },{ team1, peer2 },{ team2, peer1 }]
    const flatQueue = [];
    for (let p = 0; p < maxTeamLength; ++p) {
      for (let t = 0; t < rawQueue.length; ++t) {
        flatQueue.push(rawQueue[t][p]);
      }
    }

    // [{ team2, peer1 },{ team1, peer2 },{ team2, peer1 },{ team1, peer1 }]
    const queue = flatQueue.reverse();

    return queue;
  }

  _enqueue() {
    // ensure that queue is not empty
    if (this.queue.length === 0) {
      this.queue = this._createQueue();
    }

    // next lap
    this.lap += 1;

    // next item
    this.current.item = this.queue.pop();
  }

  join(name) {
    this.send(this.host, {
      signal: CORE_SIGNAL.JOIN_REQUEST,
      payload: name
    });
  }

  ready() {
    this.send(this.host, {
      signal: CORE_SIGNAL.READY_REQUEST
    });
  }

  start() {
    this.send(this.host, {
      signal: CORE_SIGNAL.STAGE_START_SYNC
    });

    this.timer = window.setTimeout(() => {
      if (this.stage !== STAGE.END) {
        this.send(this.host, {
          signal: CORE_SIGNAL.STAGE_GAME_TIMEOUT
        });
      }
    }, secondsToTime(this.settings.time));
  }

  points(points) {
    const team = this.settings.teams.find((team) => {
      return team.peers.includes(this.id);
    });

    this.send(this.host, {
      signal: CORE_SIGNAL.POINTS,
      payload: {
        team: team.name,
        points
      }
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
        this._signalReadyResponse(peerId);
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
    if (this.id === this.host) {
      const trust =
        this.current.item.peer === peerId &&
        this.current.item.team === data.payload.name;

      if (trust) {
        const team = this.getTeamByName(data.payload.name);
        if (team) {
          team.points += data.payload.points;
        }
      }
    } else {
      if (peerId === this.host) {
        const team = this.getTeamByName(data.payload.name);
        if (team) {
          team.points = data.payload.points;
        }
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
    if (this.id === this.host) {
      const trust = this.current.item.peer === peerId;
      if (trust) {
        this.sync.add(peerId);

        if (this.sync.size >= this.current.peers.length) {
          const team = this.getTeamByName(this.current.item.team);

          team.peers.forEach((peerId) => {
            if (peerId === this.current.peer) {
              this.send(peerId, {
                signal: CORE_SIGNAL.STAGE_GAME
              });
            } else {
              this.send(peerId, {
                signal: CORE_SIGNAL.STAGE_MEMBER
              });
            }
          });

          this.timer = window.setTimeout(() => {
            this.send(this.host, {
              signal: CORE_SIGNAL.STAGE_GAME_TIMEOUT
            });
          }, secondsToTime(this.settings.time + DELTA_SYNC_TIME));
        }
      }
    }
  }

  _signalStageGameTimeout(peerId) {
    const trust = peerId === this.current.item.peer || peerId === this.host;
    if (trust) {
      window.clearTimeout(this.timer);
      if (this.id === this.host) {
        this.send(this.current.item.peer, {
          signal: CORE_SIGNAL.STAGE_END
        });
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

  _signalReadyRequest(peerId) {
    this.sync.add(peerId);
    this.bus.emit('update');

    this.send(this.host, {
      signal: CORE_SIGNAL.READY_RESPONSE
    });
  }

  _signalReadyResponse(peerId) {
    if (this.id === this.host) {
      this.sync.add(peerId);

      if (this.isSynchronized()) {
        this.sync.clear();

        this.broadcast({
          signal: CORE_SIGNAL.STAGE_WAIT
        });
      }
    }
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
    if (!team || !team.users || !team.peers) {
      return false;
    }

    const isAlreadyJoined = team.peers.includes(peerId);
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
      // success for all
      this.broadcast({
        signal: CORE_SIGNAL.JOIN_RESPONSE,
        payload
      });
    } else {
      // fail to peer
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
            const user = this.meta.get(payload.peerId);

            team.peers.push(payload.peerId);
            team.users.push(user);
          } else {
            const index = team.peers.indexOf(payload.peerId);

            if (index !== -1) {
              team.peers.splice(index, 1);
              team.users.splice(index, 1);
            }
          }
        });
        this.bus.emit('update');
      } else {
        const err = new Error('Cannot join');
        err.type = 'join';
        this.handleError(err);
      }
    }
  }
}
