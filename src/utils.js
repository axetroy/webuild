/**
 * Created by axetroy on 2017/7/19.
 */
const path = require("path");
const { promisify } = require("util");
const glob = require("glob");

/**
 * make the path unixify
 * @param p
 * @returns {string}
 */
function unixify(p) {
  return p
    .replace(/^\/+/g, "")
    .replace(/^[A-Z]/, match => match.toLowerCase())
    .replace(/\:/g, "")
    .replace(/\/\//g, "/")
    .replace(/\\/g, "/");
}

/**
 * query the files
 * @param selector
 * @param options
 * @returns {*}
 */
function query(selector, options = {}) {
  return promisify(glob)(selector, options);
}

/**
 * get relative path
 * @param fromPath
 * @param toPath
 * @returns {string}
 */
function resolveRequire(fromPath, toPath) {
  const r = path.relative(path.dirname(fromPath), toPath);
  return r.charAt(0) !== "." ? "./" + r : r;
}

module.exports = {
  unixify,
  query,
  resolveRequire
};
