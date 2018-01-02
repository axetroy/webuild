const production = require('../../production');
const { paramsify } = require('../../utils');

Page({
  data: {
    prods: production
  },
  go2detail: function(e) {
    const data = e.currentTarget.dataset;
    console.log(data);
    wx.navigateTo({
      url: '/pages/detail/index?' + paramsify(data)
    });
  }
});
