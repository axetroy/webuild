Page({
  onShow: function() {
    wx.makePhoneCall({
      phoneNumber: '13377175342'
    });
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
