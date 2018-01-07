Page({
  data: {},
  onLoad(query) {
    try {
      this.setData({ params: JSON.parse(query.params) });
    } catch (err) {}
  }
});
