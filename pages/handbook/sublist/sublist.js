var app = getApp()
var rawlist = wx.getStorageSync('cashflow') || []

Page({
  data: {
    mainindex: '',
    typearray: app.globalData.typearray,
    typeindex: '',
    title: '',
    subtitle: '',
    sum: 0,
    persum: 0,
    sublist: []
  },
  onLoad: function (params) {
    // 生命周期函数--监听页面加载
    var typelist = wx.getStorageSync('typelist') || []

    this.setData({
      mainindex: params.mainindex,
      typeindex: params.typeindex,
      title: rawlist[params.mainindex].title,
      subtitle: typelist[params.typeindex].name,
    })
    wx.setNavigationBarTitle({
      title: this.data.title + ' - ' + this.data.subtitle
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    rawlist = wx.getStorageSync('cashflow') || []
    var templist = rawlist[this.data.mainindex].items
    var sublist = []
    var sum = 0
    var persum = 0
    for (var i = 0; i < templist.length; i++) {
      if (templist[i].typeindex == this.data.typeindex) {
        sum += parseFloat(templist[i].cost)
        persum += parseFloat(templist[i].cost) / templist[i].member
        templist[i].id = i
        sublist.push(templist[i])
      }
    }
    this.setData({
      sum: sum.toFixed(2),
      persum: persum.toFixed(2),
      sublist: sublist
    })
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
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '小账本', // 分享标题
      desc: '您的私人账本', // 分享描述
      path: '/pages/index/index' // 分享路径
    }
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.sublist.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      sublist: this.data.sublist
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY })
    that.data.sublist.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      sublist: that.data.sublist
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
  },
  //删除事件
  del: function (e) {
    var index = e.currentTarget.dataset.index
    rawlist[this.data.mainindex].items.splice(this.data.sublist[index].id,1)
    this.data.sublist.splice(index, 1)
    this.setData({
      sublist: this.data.sublist
    })
    wx.setStorageSync('cashflow', rawlist)
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    this.onShow()
  }
})