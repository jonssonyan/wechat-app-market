// miniprogram/pages/userInfo/userInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {},
        commentParam: {
            filter: {},
            pageSize: 10,
            pageNum: 1
        },
        comments: []
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
        this.selectPageComment().then(res => {
            this.setData({
                ['comments']: res
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
        let that = this;
        this.setData({
            ['commentParam.pageNum']: that.data.commentParam.pageNum++
        })
        this.selectPageComment().then((res) => {
            that.data.comments.push(res)
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    async selectPageComment() {
        let openid = null;
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            openid = data.openid
        });
        if (openid === null) {
            openid = await wx.cloud.callFunction({
                name: 'getWXContext'
            }).then(e => e.result.openid);
        }
        this.setData({
            ['commentParam.filter.seller_open_id']: openid
        })
        // 设置人员信息
        console.log(openid)
        let user = await wx.cloud.callFunction({
            name: 'selectOneUser',
            data: {filter: {open_id: openid}}
        }).then(e => e.result[0]);
        this.setData({
            ['user']: user
        })
        return await wx.cloud.callFunction({
            name: 'selectPagComment',
            data: this.data.commentParam
        }).then(e => e.result.data);
    }
})