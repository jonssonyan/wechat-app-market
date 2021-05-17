Page({

    /**
     * 页面的初始数据
     */
    data: {
        images: ['/images/picture/index_1.png', '/images/picture/index_2.png'],
        indicatorDots: true,
        autoplay: false,
        interval: 2000,
        duration: 500,
        categorys: [],
        categoryParam: {
            dbName: 'category'
        },
        products: [],
        productParam: {
            pageNum: 1,
            pageSize: 10
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 展示分类
        this.selectCategory();

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
        // 展示商品
        this.selectProductPage().then(res => {
            this.setData({
                ['products']: res
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
            ['productParam.pageNum']: that.data.productParam.pageNum++
        })
        this.selectProductPage().then((res) => {
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
            await wx.cloud.getTempFileURL({
                fileList: [{
                    fileID: products[i].images[0].file_id,
                    maxAge: 60 * 60, // one hour
                }]
            }).then(res => {
                // get temp file URL
                products[i].tempFileURL = res.fileList[0].tempFileURL
            })
        }
        return products;
    },
    // 商品的单击事件
    productClick(product) {
        let productId = product.currentTarget.dataset.product._id;
        wx.navigateTo({
            url: '/pages/product/product',
            events: {},
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {productId: productId})
            }
        })
    },
    // 展示分类
    selectCategory() {
        wx.cloud.callFunction({
            name: 'selectList',
            data: this.data.categoryParam
        }).then(e => {
            let categorys = [];
            let data = e.result.data;
            let pageNum = 1;
            let totalPage = Math.ceil(data.length / 6);
            while (pageNum <= totalPage) {
                let category = [];
                let start = (pageNum - 1) * 6;
                let end = (start + 6) <= data.length ? (start + 6) : data.length;
                for (let i = start; i < end; i++) {
                    category.push(data[i]);
                }
                categorys.push(category);
                pageNum++;
            }
            this.setData({
                categorys: categorys
            })
        });
    },
    // 分类的单击事件
    categoryClick(category) {
        let categoryId = category.currentTarget.dataset.category._id;
        wx.navigateTo({
            url: '/pages/productList/productList',
            events: {},
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {categoryId: categoryId})
            }
        })
    }
})
