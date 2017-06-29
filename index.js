const co = require('co');

class Plugin {
  constructor({ name }) {
    this.name = name;
    this.fnStacks = [];
  }

  init(ctx) {
    this.ctx = ctx;
  }

  use(fn) {
    this.fnStacks.push(fn);
    return this;
  }

  run() {
    const fnStacks = this.fnStacks;
    const ctx = this.ctx;
    return co(function* () {
      const createNext = (rest) => {
        return function* () {
          if (rest.length > 0) {
            yield rest[0](ctx, createNext(rest.slice(1)));
          }
        };
      };
      yield createNext(fnStacks);
    })
  }
}

module.exports = Plugin;
