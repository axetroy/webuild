/**
 * compose two function into one
 * @returns {Function}
 */
function compose() {
  const funcs = [].slice.call(arguments);
  return function() {
    const ctx = this;
    const argv = [].slice.call(arguments);
    let result;
    funcs.forEach(function(func) {
      result = func.apply(ctx, argv);
    });
    return result;
  };
}

/**
 * create global object
 * @returns {*}
 */
function getGlobal() {
  const g = typeof wx !== "undefined" ? wx : this || {};
  const global = {
    Array,
    Date,
    Error,
    Function,
    Math,
    Object,
    RegExp,
    String,
    TypeError,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    process: {
      env: {}
    }
  };

  global.global = global;

  for (let key in g) {
    if (g.hasOwnProperty(key)) {
      // proxy all key
      Object.defineProperty(global, key, {
        get() {
          return g[key];
        }
      });
      // promisify all method with Async suffix
      if (typeof g[key] === "function" && !/sync$/.test(key)) {
        Object.defineProperty(global, key + "Async", {
          get() {
            return function(argv) {
              return new Promise(function(resolve, reject) {
                const success = compose(argv.success, data => resolve(data));
                const fail = compose(argv.fail, err => reject(err));
                g[key](Object.assign({}, argv, { success, fail }));
              });
            };
          }
        });
      }
    }
  }

  return global;
}
