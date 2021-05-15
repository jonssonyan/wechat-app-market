// miniprogram/pages/sell/sell.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 订单列表
        orders: [],
        // 查询订单时的参数对象
        orderParam: {
            dbName: 'order',
            pageNum: 1,
            pageSize: 10,
            filter: {
                open_id: null
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        this.selectPage().then((res) => {
            that.setData({
                ['orders']: res
            })
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        this.setData({
            ['param.pageNum']: that.data.orderParam.pageNum++
        })
        this.selectPage().then(res => {
            that.data.orders.push(res)
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    cardClick: function (e) {
        console.log(e)
    },
    async selectPage() {
        const that = this;
        let orders = [];
        // 设置当前用户的openid
        await wx.cloud.callFunction({
            name: 'getWXContext'
        }).then(e => {
            that.setData({
                ['orderParam.filter.seller']: e.result.openid
            })
        })
        if (that.data.orderParam.filter.seller) {
            // 获取订单列表
            await wx.cloud.callFunction({
                name: 'selectPageOrder',
                data: that.data.orderParam
            }).then((e) => {
                orders = e.result.data
            })
        }
        console.log(orders)
        return orders;
    }
});
