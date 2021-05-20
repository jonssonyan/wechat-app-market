// miniprogram/pages/buyDetail/buyDetail.js
const {$Message} = require('../../components/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        visible1: false
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
        return await wx.cloud.callFunction({
            name: 'selectOneOrder',
            data: {filter: {_id: _id}, isBuy: false}
        }).then(e => e.result[0]);
    },
    handleClick() {
        this.setData({
            visible1: true
        });
    },
    handleClose1() {
        this.setData({
            visible1: false
        });
    },
    handleClick1() {
        wx.cloud.callFunction({
            name: 'updateOrder',
            data: {order: {_id: this.data.order._id, state: 1}}
        }).then(e => {
            // 页面不刷新，手动更改状态
            this.setData({
                ['order.state']: 1
            })
            $Message({
                content: '确认收获成功',
                type: 'success'
            });
            this.handleClose1()
        });
    },
    backToMe() {
        wx.switchTab({
            url: '/pages/me/me'
        })
    }
})