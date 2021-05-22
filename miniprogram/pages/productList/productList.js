// miniprogram/productList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: [],
        productParam: {
            pageNum: 1,
            pageSize: 10,
            filter: {
                name: ''
            },
            stockGt1Flag: true
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            that.setData({
                ['productParam.filter.category_id']: data.categoryId
            })
        })
        // 展示商品
        this.selectProductPage().then(res => {
            this.setData({
                ['products']: res
            })
        })
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
            ['productParam.pageNum']: that.data.productParam.pageNum++
        })
        this.selectPage().then((res) => {
            that.data.products.push(res)
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 分页查询商品
    async selectProductPage() {
        let products = [];
        await wx.cloud.callFunction({
            name: 'selectPageProduct',
            data: this.data.productParam
        }).then(e => {
            products = e.result.data
        });
        for (let i = 0; i < products.length; i++) {
            let res = await wx.cloud.getTempFileURL({
                fileList: [{
                    fileID: products[i].images[0].file_id,
                    maxAge: 60 * 60, // one hour
                }]
            })
            // get temp file URL
            products[i].tempFileURL = res.fileList[0].tempFileURL
        }
        return products;
    },
    // 商品单击事件
    async productClick(product) {
        let productId = product.currentTarget.dataset.product._id;
        await wx.navigateTo({
            url: '/pages/product/product',
            events: {},
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {productId: productId})
            }
        })
    },
    searchProduct() {
        this.selectProductPage().then(res => {
            this.setData({
                ['products']: res
            })
        })
    },
    bindNameChange(e) {
        this.setData({
            ['productParam.filter.name']: e.detail.detail.value
        })
    },
    reset() {
        this.setData({
            ['productParam.filter.name']: ''
        })
        this.selectProductPage().then(res => {
            this.setData({
                ['products']: res
            })
        })
    }
})