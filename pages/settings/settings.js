//settings.js
//获取应用实例
var app = getApp()
var list = wx.getStorageSync('typelist') || []
var typearray = app.globalData.typearray
Page({
    data: {
        modalHidden: true,
        temptitle: '',
        list: [],
    },
    onLoad: function () {
        // 生命周期函数--监听页面加载
        if (list.length == 0) {
            for (var i = 0; i < typearray.length; i++) {
                list.push({
                    id: i,
                    name: typearray[i],
                    edit: false
                })
            }
        }
        this.setData({
            list: list
        })
    },
    clearAll: function () {
        var that = this
        wx.showModal({
            title: '警告',
            content: '请确认自建类别未在使用，且删除所有自建分类后无法找回！',
            success: function (res) {
                if (res.confirm) {
                    var list = [];
                    for (var i = 0; i < typearray.length; i++) {
                        list.push({
                            id: i,
                            name: typearray[i],
                            edit: false
                        })
                    }
                    wx.setStorageSync('typelist', list)
                    that.setData({
                        list: list
                    })
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    },
    showModal: function (e) {
        this.setData({
            modalHidden: !this.data.modalHidden
        })
    },
    setTitle: function (e) {
        this.setData({
            temptitle: e.detail.value
        })
        return {
            value: ''
        }
    },
    modalBindaconfirm: function (e) {
        var templist = this.data.list
        templist.push({
            id: templist.length,
            name: this.data.temptitle,
            edit: true
        })
        this.setData({
            modalHidden: !this.data.modalHidden,
            temptitle: '',
            list: templist
        })
        wx.setStorageSync('typelist', templist)
    },
    modalBindcancel: function () {
        this.setData({
            modalHidden: !this.data.modalHidden,
        })
    },
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e) {
        //开始触摸时 重置所有删除
        this.data.list.forEach(function (v, i) {
            if (v.isTouchMove)//只操作为true的
                v.isTouchMove = false
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            list: this.data.list
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
        that.data.list.forEach(function (v, i) {
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
            list: that.data.list
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
        if (this.data.list[e.currentTarget.dataset.index].edit) {
            this.data.list.splice(e.currentTarget.dataset.index, 1)
            this.setData({
                list: this.data.list
            })
            list = this.data.list
            wx.setStorageSync('typelist', list)
            wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '无法删除系统分类！',
                success: function (res) {
                    if (res.confirm) {
                        // console.log('用户点击确定')
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        }
    }
})
