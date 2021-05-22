// miniprogram/pages/comment/comment.js
const {$Message} = require('../../components/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        comment: {
            content: '',
            star: 1
        },
        butDisabled: false
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
        // 将上一个界面传来的参数设置到本页面中
        let that = this;
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            that.setData({
                ['comment.order_id']: data.order._id,
                ['comment.seller_open_id']: data.order.seller
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
    bindContentChange(e) {
        this.setData({
            ['comment.content']: e.detail.detail.value
        })
    },
    handleChangeStar({detail}) {
        this.setData({
            ['comment.star']: detail.value
        })
    },
    async handleClick() {
        if (this.data.comment.content === '') {
            $Message({
                content: '请输入评论内容',
                type: 'warning'
            });
            return
        }
        if (this.data.comment.seller_open_id === this.data.comment.buyer_open_id) {
            $Message({
                content: '不能评价自己的商品',
                type: 'warning'
            });
            return
        }
        this.setData({
            ['butDisabled']: true
        });
        await wx.cloud.callFunction({
            name: 'addComment',
            data: {
                comment: this.data.comment
            }
        });
        wx.switchTab({
            url: '/pages/me/me'
        })
    }
})