/**
 * Created by axetroy on 2017/7/2.
 */

const path = require('path');

const cwd = process.cwd();

const DEFAULT_CONFIG = {
  isProduction: process.env.NODE_ENV === 'production',
  paths: {
    cwd: cwd,
    root: cwd,
    src: path.join(cwd, 'src'),
    dist: path.join(cwd, 'build'),
    temp: path.join(cwd, '.temp')
  }
};

const CONFIG = Object.assign({}, DEFAULT_CONFIG);

module.exports = CONFIG;

module.exports.getConfig = function() {
  return CONFIG;
};
