const location = {
  name: '冰冰家',
  address: '南宁安吉万达华府',
  latitude: 22.868257,
  longitude: 108.292419
};

Page({
  data: {
    markers: [
      {
        iconPath: '/static/icon/location.png',
        id: 0,
        latitude: location.latitude,
        longitude: location.longitude,
        width: 32,
        height: 32
      }
    ],
    controls: [
      {
        id: 1,
        iconPath: '/static/icon/nav.png',
        position: {
          left: 0,
          top: 230,
          width: 48,
          height: 48
        },
        clickable: true
      }
    ]
  },
  locate(e) {
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      scale: 18,
      name: location.name,
      address: location.address
    });
  },
  call(e) {
    const data = e.target.dataset;
    wx.makePhoneCall({
      phoneNumber: data.number
    });
  },
  regionchange(e) {
    console.log(e.type);
  },
  markertap(e) {
    console.log(e.markerId);
  },
  controltap(e) {
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      scale: 18,
      name: location.name,
      address: location.address
    });
  }
});
