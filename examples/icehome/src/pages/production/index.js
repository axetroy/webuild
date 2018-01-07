const production = require('../../production');
const { paramsify } = require('../../utils');

Page({
  data: {
    prods: production
  },
  go2detail: function(e) {
    const data = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/detail/index?params=' + JSON.stringify(data.name)
    });
  }
});
