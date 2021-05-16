// miniprogram/pages/placeAnOrder/placeAnOrder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        methods: [{id: 1, name: '见面交易'}],
        method: {},
        orderParam: {
            dbName: 'order',
            order: {
                num: 1,
                address: null
            }
        },
        product: {}
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
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            that.setData({
                ['product']: data.product
            })
        })
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 切换付款方式
    bindPickerChange({detail}) {
        let method = this.data.methods[detail.value];
        this.setData({
            ['method']: method
        });
    },
    // 切换下单数量
    handleChangeNum({detail}) {
        this.setData({
            ['orderParam.order.num']: detail.value
        })
    },
    placeAnOrder() {
        console.log(this.data.orderParam)
    }
})