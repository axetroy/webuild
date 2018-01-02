function paramsify(object) {
  const list = [];
  for (let attr in object) {
    if (object.hasOwnProperty(attr)) {
      list.push(attr + '=' + object[attr]);
    }
  }
  return list.join('&');
}

module.exports = {
  paramsify
};
