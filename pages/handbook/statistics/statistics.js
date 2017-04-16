var app = getApp()
var list = []
var wxCharts = require('../../../utils/wxcharts.js')
var typearray = []
var pieChart = null

Page({
    data: {
        mainindex: '',
        points: [],
        sum: 0,
        persum: 0,
        series: [],
        latitude: 39.984519,
        longitude: 116.307793,
        polyline: [],
        markers: []
    },
    onLoad: function (params) {
        // 生命周期函数--监听页面加载
        var typelist = wx.getStorageSync('typelist') || []
        if (typelist.length == 0) {
            typearray = app.globalData.typearray
        } else {
            for (var i = 0; i < typelist.length; i++) {
                typearray.push(typelist[i].name)
            }
        }
        this.setData({
            mainindex: params.mainindex
        })
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        list = wx.getStorageSync('cashflow') || []
        var sublist = list[this.data.mainindex].items
        var sum = 0
        var persum = 0
        var points = []
        var series = []
        var tempseries = []
        var hasLocation = false
        var midlatitude = 0
        var midlongitude = 0
        for (var i = 0; i < typearray.length; i++) {
            tempseries.push(0)
        }
        for (var i = 0; i < sublist.length; i++) {
            sum += parseFloat(sublist[i].cost)
            persum += parseFloat(sublist[i].cost) / sublist[i].member
            points.push({
                latitude: sublist[i].location.latitude,
                longitude: sublist[i].location.longitude,
                name: sublist[i].location.name
            })
            tempseries[sublist[i].typeindex] += parseFloat(sublist[i].cost)
            if (sublist[i].hasLocation) {
                hasLocation = true
            }
        }
        for (var i = 0; i < tempseries.length; i++) {
            if (tempseries[i] != 0) {
                series.push({
                    name: typearray[i],
                    data: tempseries[i],
                    id: i
                })
            }
        }
        if (hasLocation) {
            midlatitude = sublist[parseInt(sublist.length / 2)].location.latitude
            midlongitude = sublist[parseInt(sublist.length / 2)].location.longitude
        } else {
            var that = this
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    midlatitude = res.latitude,
                        midlongitude = res.longitude,
                        that.setData({
                            latitude: midlatitude,
                            longitude: midlongitude,
                        })
                }
            })
        }
        this.setData({
            sum: sum.toFixed(2),
            persum: persum.toFixed(2),
            series: series,
            points: points,
            latitude: midlatitude,
            longitude: midlongitude,
            polyline: [{
                points: points,
                color: "#5c95e6FF",
                width: 8,
                dottedLine: false
            }],
            markers: points
        })

        if (series.length == 0) {
            series.push({
                name: '无',
                data: 1
            })
        }
        var windowWidth = 320
        try {
            var res = wx.getSystemInfoSync()
            windowWidth = res.windowWidth
        } catch (e) {
            console.error('getSystemInfoSync failed!')
        }
        pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'pie',
            series: series,
            width: windowWidth * 0.96,
            height: 300,
            dataLabel: true,
        })
    },
    touchHandler: function (e) {
        var index = pieChart.getCurrentDataIndex(e)
        var mainindex = this.data.mainindex
        var typeindex = this.data.series[index].id
        wx.navigateTo({
            url: '../sublist/sublist?mainindex=' + mainindex + '&typeindex=' + typeindex,
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
})