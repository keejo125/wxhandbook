var util = require('../../../utils/util.js')
var formatLocation = util.formatLocation
var curDate = util.curDate
var app = getApp()
var list = []


Page({
  data: {
    act: 'new',
    isfocus: true,
    numberarray: app.globalData.numberarray,
    numberindex: 0,
    typearray: app.globalData.typearray,
    typeindex: 0,
    mainindex: 0,
    subindex: 0,
    subtitle: '',
    comment: '',
    cost: '',
    date: '2016-09-01',
    time: '12:01',
    hasLocation: false,
    location: {},
    inidata: {}
  },

  onLoad: function (params) {
    // 生命周期函数--监听页面加载
    list = wx.getStorageSync('cashflow') || []
    var typelist = wx.getStorageSync('typelist') || []
    var typearray = []
    if (typelist.length == 0) {
      typearray = app.globalData.typearray
    } else {
      for (var i = 0; i < typelist.length; i++) {
        typearray.push(typelist[i].name)
      }
    }
    if (params.act === 'new') {
      var curdate = curDate(new Date())
      this.setData({
        act: 'new',
        isfocus: true,
        mainindex: params.mainindex,
        typearray: typearray,
        date: curdate[0],
        time: curdate[1]
      })
    } else {
      var billinfo = list[params.mainindex].items[params.subindex]
      this.setData({
        act: 'edit',
        isfocus: false,
        mainindex: params.mainindex,
        subindex: params.subindex,
        numberindex: billinfo.member - 1,
        typeindex: billinfo.typeindex || 0,
        typearray: typearray,
        subtitle: billinfo.subtitle,
        comment: billinfo.comment,
        cost: billinfo.cost,
        date: billinfo.date,
        time: billinfo.time,
        hasLocation: billinfo.hasLocation || false,
        location: billinfo.location,
        inidata: billinfo
      })
    }
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    list = wx.getStorageSync('cashflow') || []
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  // onShareAppMessage: function () {
  //   // 用户点击右上角分享
  //   return {
  //     title: 'title', // 分享标题
  //     desc: 'desc', // 分享描述
  //     path: 'path' // 分享路径
  //   }
  // },

  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: res,
          // locationAddress: res.address
        })
      }
    })
  },
  bindNumberChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      numberindex: e.detail.value
    })
  },
  bindTypeArrayChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      typeindex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (this.data.act === 'new') {
      list[this.data.mainindex].items.push(
        {
          subtitle: e.detail.value.title,
          comment: e.detail.value.detail,
          cost: parseFloat(e.detail.value.cost || '0'),
          date: e.detail.value.date,
          time: e.detail.value.time,
          member: parseInt(e.detail.value.member) + 1,
          typeindex: parseInt(e.detail.value.typeindex),
          hasLocation: this.data.hasLocation,
          location: this.data.location
        }
      )
    } else {
      list[this.data.mainindex].items[this.data.subindex] = {
        subtitle: e.detail.value.title,
        comment: e.detail.value.detail,
        cost: parseFloat(e.detail.value.cost),
        date: e.detail.value.date,
        time: e.detail.value.time,
        member: parseInt(e.detail.value.member) + 1,
        typeindex: parseInt(e.detail.value.typeindex),
        hasLocation: this.data.hasLocation,
        location: this.data.location
      }
    }
    list[this.data.mainindex].items.sort(function (a, b) {
      var d1 = new Date(a.date.replace(/-/g, '/') + ' ' + a.time)
      var d2 = new Date(b.date.replace(/-/g, '/') + ' ' + b.time)
      return d1 - d2
    })
    wx.setStorageSync('cashflow', list)
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
      success: function (res) {
        // success
        console.log('goback succ')
      },
      fail: function () {
        // fail
        console.log('goback fail')
      },
      complete: function () {
        // complete
      }
    })
  },
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    // this.setData({
    //   hasLocation: false
    // })
    if (this.data.act === 'new') {
      var curdate = curDate(new Date())
      this.setData({
        act: 'new',
        date: curdate[0],
        time: curdate[1]
      })
    } else {
      var billinfo = this.data.inidata
      this.setData({
        act: 'edit',
        numberindex: billinfo.member - 1,
        subtitle: billinfo.subtitle,
        comment: billinfo.comment,
        cost: billinfo.cost,
        date: billinfo.date,
        time: billinfo.time,
        hasLocation: billinfo.hasLocation || false,
        location: billinfo.location
      })
    }
  }

})