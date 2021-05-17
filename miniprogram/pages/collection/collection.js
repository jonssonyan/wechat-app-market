// miniprogram/pages/collection/collection.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        collections: [],
        addCollectionParam: {
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
        this.selectPageCollection().then(collections => {
            this.setData({
                ['collections']: collections
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
    async selectPageCollection() {
        // 获取openid
        let openId = null;
        await wx.cloud.callFunction({
            name: 'getWXContext'
        }).then(e => {
            openId = e.result.openid
        })
        this.setData({
            ['addCollectionParam.filter.open_id']: openId
        })
        let collectionsResult = await wx.cloud.callFunction({
            name: 'selectPageCollection',
            data: this.data.addCollectionParam
        });
        return collectionsResult.result.data
    },
    cardClick(collection) {
        console.log(collection)
    }
})