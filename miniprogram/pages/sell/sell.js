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
        param: {
            dbName: 'order',
            pageNum: 1,
            pageSize: 10,
            filter: {
                open_id: null
            }
        },
        // 查询商品时的参数对象
        productParam: {
            dbName: 'product',
            filter: {}
        },
        // 存放 商品id和商品名称 键值对Map
        productMap: null
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
        this.selectPage().then((res) => {
            that.setData({
                ['orders']: res
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
        // 获取商品列表，商品id=>商品名称
        await wx.cloud.callFunction({
            name: 'selectList',
            data: that.data.productParam
        }).then((e) => {
            let map = new Map();
            let productList = e.result.data;
            for (let i = 0; i < productList.length; i++) {
                map.set(productList[i]._id, productList[i].name)
            }
            that.setData({
                ['productMap']: map
            })
        })
        let orders = [];
        await wx.cloud.callFunction({
            name: 'getWXContext'
        }).then(e => {
            // 获取订单列表
            that.setData({
                ['param.filter.seller']: e.result.openid
            })

        })
        if (that.data.param.filter.seller) {
            await wx.cloud.callFunction({
                name: 'selectOrder',
                data: that.data.param
            }).then((e) => {
                orders = e.result.data;
                // 遍历订单列表，获取商品的名称，两个云函数嵌套，得到的数据没有渲染到界面上，所以采用存在data中然后在取值的方法
                for (let i = 0; i < orders.length; i++) {
                    orders[i].productName = that.data.productMap.get(orders[i].product_id)
                    orders[i].create_time = this.dataToString(orders[i].create_time)
                }
            })
        }
        return orders;
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
