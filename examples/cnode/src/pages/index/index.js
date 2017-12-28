//index.js
import r2 from 'wxapp-r2';

class Bcd{
  constructor(){

  }
  test(){

  }
}


Page({
  data: {
    posts: []
  },
  resolveTab(tab) {
    const obj = {
      share: '分享',
      ask: '问答'
    };
    return obj[tab] || tab;
  },
  goToDetail(event) {
    const data = event.currentTarget.dataset;
    const id = data.postid;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  },
  async fetchData() {
    try {
      const res = await r2('https://cnodejs.org/api/v1/topics').json;
      if (res.success) {
        console.log(res.data);
        this.setData({
          posts: res.data.map(d => {
            d.tag = this.resolveTab(d.tab);
            return d;
          })
        });
      }
    } catch (err) {
      console.error(err);
    }
  },
  onLoad: async function() {
    try {
      await this.fetchData();
    } catch (err) {
      console.error(err);
    }
  }
});
