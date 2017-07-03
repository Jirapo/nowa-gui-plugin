const co = require('co');
const WebSocket = require('ws');


class Plugin {
  constructor({ name }) {
    this.name = name;
    this.fn = () => {};
  }

  * renderPromts(promts) {
    const that = this;
    return new Promise(resolve => {
      const socket = new WebSocket(`ws://127.0.0.1:${that.port}`);
      socket.on('open', () => {
        socket.send(JSON.stringify(promts));
      });
      socket.on('message', data => {
        resolve(data);
        socket.terminate();
      });
    });
  }

  run(_ctx, _port) {
    this.port = _port;
    const ctx = Object.assign(_ctx, { renderPromts: this.renderPromts.bind(this) });
    
    return co(this.fn(ctx));
  }

  use(fn) {
    this.fn = fn.bind(this);
  }


  // run() {
  //   const fnStacks = this.fnStacks;
  //   const ctx = this.ctx;
  //   return co(function* () {
  //     const createNext = (rest) => {
  //       return function* () {
  //         if (rest.length > 0) {
  //           yield rest[0](ctx, createNext(rest.slice(1)));
  //         }
  //       };
  //     };
  //     yield createNext(fnStacks);
  //   })
  // }
}

module.exports = Plugin;
