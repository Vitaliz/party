import Game from '../game';

export default class Core extends Game {
  constructor(user, settings) {
    super(user);

    if (settings.teams) {
      settings.teams.forEach((team) => {
        team.users = [];
      });
    } else {
      this._bus.once('init', this._onInit.bind(this));
    }

    this.settings = settings;
  }

  _onInit() {
    if (this.settings.creator) {
      this.connect(this.settings.creator);
    }
  }

  handleConnection(connection) {
    super.handleConnection(connection);
    connection.send({ type: 'settings', payload: this.settings });
  }

  handleData(peerId, data) {
    switch (data.type) {
      case 'join':
        this._onJoin(data.payload);
        break;
      case 'settings':
        this._onSettings(data.payload);
        break;
      default:
        super.handleData(peerId, data);
        break;
    }
  }

  _onJoin(payload) {
    this.settings.teams.forEach((team) => {
      if (team.name === payload.name) {
        team.users = [
          ...team.users,
          payload.meta
        ];
      } else {
        team.users = team.users.filter((user) => {
          return user.vkUserId !== payload.meta.vkUserId;
        });
      }
    });
    this._bus.emit('update');
  }

  _onSettings(payload) {
    this.settings = {
      ...this.settings,
      ...payload
    };
    this._bus.emit('update');
  }

  join(name) {
    const payload = { meta: this._meta, name };
    if (this.settings.creator) {
      this.send('join', payload);
    } else {
      this._onJoin(payload);
    }
  }
}
