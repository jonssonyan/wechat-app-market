Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: [],
        param: {
            dbName: 'product',
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
        this.selectPage().then(res => {
            this.setData({
                ['products']: res
            })
        });
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
        this.setData({
            ['param.pageNum']: this.data.param.pageNum++
        })
        this.selectPage().then(res => {
            this.data.products.push(res)
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
        let products = [];
        await wx.cloud.callFunction({
            name: 'getWXContext'
        }).then(e => {
            that.setData({
                ['param.filter.open_id']: e.result.openid
            })
        })
        if (that.data.param.filter.open_id) {
            await wx.cloud.callFunction({
                name: 'selectPageProduct',
                data: that.data.param
            }).then((e) => {
                products = e.result.data;
            })
        }
        return products;
    }
});
