// miniprogram/pages/sell/sell.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [],
        param: {
            pageNum: 1,
            pageSize: 10
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.selectPage();
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
            ['param.pageNum']: that.data.param.pageNum++
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    selectPage() {
        const that = this;
        wx.cloud.callFunction({
            name: 'selectOrder',
            data: this.data.param
        }).then((e) => {
            let orders = e.result.data;
            console.log(orders);
            that.setData({
                ['orders']: orders
            })
        })
    }
})
