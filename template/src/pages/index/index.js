// Author; axetroy
Page({
  data: {},
  onLoad: async function() {
    console.log("Component load.");

    wx.getSystemInfo({
      success: res => {
        console.log(res);
        this.setData({
          windowHeight: res.windowHeight
        });
      }
    });

    wx.getUserInfo({
      success: res => {
        console.log(res);
        console.log(this);
        this.setData({
          userInfo: res.userInfo
        });
      },
      fail(err) {
        console.error(err);
      }
    });
  }
});
