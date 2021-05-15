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
            dbName: 'product'
        },
        imageParam: {
            dbName: 'image'
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
        // 展示分类
        this.selectCategory();
        // 展示商品
        this.selectProductPage()
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
    // 分页查询商品
    selectProductPage() {
        let that = this;
        let products = [];
        let imageMap = new Map();
        wx.cloud.callFunction({
            name: 'selectPage',
            data: that.data.productParam
        }).then(e => {
            products = e
        });
        wx.cloud.callFunction({
            name: 'selectList',
            data: this.data.imageParam
        }).then(e => {
            let images = e.result.data;
            images.forEach(image => {
                imageMap.set(image.product_id, image.file_id)
            })
        });
        for (let i = 0; i < products.length; i++) {
            let fileId = imageMap.get(products[i]._id);

        }
    },
    // 商品单击事件
    productClick(product) {
        console.log(product)
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
    categoryClick(category) {
        console.log(category)
    }
})
