//index.js
import r2 from 'wxapp-r2';
import timeago from 'timeago.js';

class Hello{
  constructor(){

  }
  test(){

  }
}


Page({
  data: {
    post: {}
  },
  resolveTab(tab) {
    const obj = {
      share: '分享',
      ask: '问答'
    };
    return obj[tab] || tab;
  },
  async fetchData(id) {
    try {
      const res = await r2(`https://cnodejs.org/api/v1/topic/${id}`).json;
      if (res.success) {
        const data = res.data;
        data.timeago = timeago(new Date()).format(new Date(res.data.create_at));
        data.tag = this.resolveTab(data.tab);
        console.log(data);

        this.setData({
          post: data
        });
      }
    } catch (err) {
      console.error(err);
    }
  },
  timeago(date) {
    console.info(date);
    return timeago(new Date()).format(date);
  },
  onLoad: async function(argv) {
    console.log(argv);
    try {
      await this.fetchData(argv.id);
    } catch (err) {
      console.error(err);
    }
  }
});
