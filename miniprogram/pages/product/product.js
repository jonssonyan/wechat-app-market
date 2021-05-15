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
        let that = this;
        this.selectPage().then(res => {
            that.setData({
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
        let that = this;
        this.setData({
            ['param.pageNum']: that.data.param.pageNum++
        })
        this.selectPage().then(res => {
            that.data.products.push(res)
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
                name: 'selectPage',
                data: that.data.param
            }).then((e) => {
                products = e.result.data;
                for (let i = 0; i < products.length; i++) {
                    // 设置创建日期
                    products[i].create_time = that.dataToString(products[i].create_time);
                }
            })
        }
        return products;
    },
    // 时间戳转换为 yyyy-MM-dd HH:mm:ss 的字符串格式
    dataToString(time) {
        let da = new Date(time);
        let year = da.getFullYear();
        let month = da.getMonth() + 1;
        let date = da.getDate();
        let hours = da.getHours();
        let minutes = da.getMinutes();
        let seconds = da.getSeconds();
        return [year, month, date].join("-") + " " + [hours, minutes, seconds].join(':');
    }
});
