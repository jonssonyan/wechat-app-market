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
        let collections = collectionsResult.result.data

        for (let i = 0; i < collections.length; i++) {
            let products = collections[i].products;
            for (let j = 0; j < products.length; j++) {
                let res = await wx.cloud.getTempFileURL({
                    fileList: [{
                        fileID: products[i].images[0].file_id,
                        maxAge: 60 * 60, // one hour
                    }]
                });
                // get temp file URL
                products[i].tempFileURL = res.fileList[0].tempFileURL
            }
        }
        console.log(collections)
        return collections;
    },
    cardClick(collection) {
        console.log(collection)
    }
})