import Game from '../game';

export default class Core extends Game {
  constructor(userId, settings) {
    super(userId);
    this.setState({
      settings
    });
  }

  handleData(peerId, data) {
    switch (data.type) {
      default:
        super.handleData(peerId, data);
    }
  }
}
