function paramsify(object) {
  const list = [];
  for (let attr in object) {
    if (object.hasOwnProperty(attr)) {
      const val = object[attr];
      list.push(attr + '=' + typeof val ? JSON.stringify(val) : val);
    }
  }
  return list.join('&');
}

module.exports = {
  paramsify
};
