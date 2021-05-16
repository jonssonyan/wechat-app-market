// miniprogram/pages/product/product.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        images: [],
        indicatorDots: true,
        autoplay: false,
        interval: 2000,
        duration: 500,
        product: {},
        productParam: {
            name: 'product',
            filter: {}
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
        this.selectOneProduct().then(res => {
            this.setData({
                ['product']: res,
                ['images']: res.tempFileURLs
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
    async selectOneProduct() {
        let that = this;
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            that.setData({
                ['productParam.filter._id']: data.productId
            })
        });
        let product = {};
        await wx.cloud.callFunction({
            name: 'selectOneProduct',
            data: that.data.productParam
        }).then(e => {
            product = e.result.data[0];
        });
        let images = product.images;
        let tempFileURLs = [];
        for (let i = 0; i < images.length; i++) {
            await wx.cloud.getTempFileURL({
                fileList: [{
                    fileID: images[i].file_id,
                    maxAge: 60 * 60, // one hour
                }]
            }).then(res => {
                // get temp file URL
                tempFileURLs.push(res.fileList[0].tempFileURL);
            })
        }
        product.tempFileURLs = tempFileURLs;
        return product;
    },
    buy(product) {
        wx.navigateTo({
            url: '/pages/placeAnOrder/placeAnOrder',
            events: {},
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {product: product.currentTarget.dataset.product})
            }
        })
    },
    collection(product) {
        console.log(product)
    }
})