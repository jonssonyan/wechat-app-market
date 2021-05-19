// miniprogram/pages/sellDetail/sellDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: {}
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
        this.selectOneOrder().then(res => {
            this.setData({
                ['order']: res
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
    async selectOneOrder() {
        // 将上一个界面传来的参数
        const eventChannel = this.getOpenerEventChannel()
        let _id = null;
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            _id = data.order._id
        });
        console.log(_id)
        return await wx.cloud.callFunction({
            name: 'selectOneOrder',
            data: {_id: _id}
        });
    }
})