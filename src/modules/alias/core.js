import Game from '../game';

export const CORE_SIGNAL = {
  SETTINGS_REQUEST: 1001,
  SETTINGS_RESPONSE: 1002,

  JOIN_REQUEST: 1003,
  JOIN_RESPONSE: 1004
};

export default class Core extends Game {
  constructor(user, settings) {
    const host = settings.creator || user.vkUserId;
    super(user, host);

    if (settings.teams) {
      settings.teams.forEach((team) => {
        team.users = [];
      });
    }

    this.settings = settings;
  }

  _onInit() {
    super._onInit();
    if (!this.settings.teams) {
      this.send(this.host, {
        signal: CORE_SIGNAL.SETTINGS_REQUEST
      });
    }
  }

  join(name) {
    if (this.host !== this.id) {
      this.send(this.host, {
        signal: CORE_SIGNAL.JOIN_REQUEST,
        payload: name
      });
    } else {
      this.handleData(this.host, {
        signal: CORE_SIGNAL.JOIN_RESPONSE,
        payload: {
          peerId: this.host,
          success: true,
          name
        }
      });
    }
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
      default:
        super.handleData(peerId, data);
        break;
    }
  }

  _signalSettingsRequest(peerId) {
    this.send(peerId, {
      signal: CORE_SIGNAL.SETTINGS_RESPONSE,
      payload: this.settings
    });
  }

  _signalSettingsResponse(peerId, data) {
    if (+peerId === this.host) {
      this.settings = {
        ...this.settings,
        ...data.payload
      };
      this.bus.emit('update');
    }
  }

  _signalJoinRequest(peerId, data) {
    const success = true;

    const payload = {
      peerId,
      success,
      name: data.payload
    };

    if (success) {
      this.broadcast({
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
    if (+peerId === this.host) {
      const { payload } = data;
      if (payload.success) {
        this.settings.teams.forEach((team) => {
          if (team.name === payload.name) {
            const user = this.id === +payload.peerId ?
              this._meta : this.meta.get(+payload.peerId);

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
