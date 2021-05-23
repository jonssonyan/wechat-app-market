// miniprogram/pages/collection/collection.js
const {$Message} = require('../../components/base/index');
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
        },
        visible: false,
        visible1: false,
        actions: [
            {
                name: '查看',
            },
            {
                name: '取消收藏',
                color: '#ed3f14'
            }
        ],
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
                        fileID: products[j].images[0].file_id,
                        maxAge: 60 * 60, // one hour
                    }]
                });
                // get temp file URL
                products[j].tempFileURL = res.fileList[0].tempFileURL
            }
        }
        return collections;
    },
    cardClick: function (collection) {
        this.setData({
            ['visible']: true,
            ['product']: collection.currentTarget.dataset.collection.products[0]
        });
    },
    handleCancel() {
        this.setData({
            ['visible']: false
        });
    },
    // 取消删除
    handleClose1() {
        this.setData({
            ['visible']: false,
            ['visible1']: false
        });
    },
    // 查看收藏商品详情
    async handleClickItem({detail}) {
        let that = this;
        switch (detail.index) {
            case 0:
                // 跳转至商品详情界面
                await wx.navigateTo({
                    url: '/pages/product/product',
                    events: {},
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', {productId: that.data.product._id})
                    }
                })
                break
            case 1:
                this.setData({
                    visible1: true
                });
                break
        }
    },
    // 取消收藏
    async handleClick1() {
        let openid = await wx.cloud.callFunction({
            name: 'getWXContext'
        }).then(e => e.result.openid);
        await wx.cloud.callFunction({
            name: 'delete',
            data: {dbName: 'collection', filter: {open_id: openid, product_id: this.data.product._id}}
        });
        $Message({
            content: '取消收藏成功',
            type: 'success'
        });
        this.handleClose1();
        this.onShow();
    }

})