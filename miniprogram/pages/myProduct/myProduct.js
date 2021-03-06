const {$Message} = require('../../components/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: [],
        param: {
            dbName: 'product',
            pageNum: 1,
            pageSize: 10,
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
                name: '删除',
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
        this.selectPage().then(res => {
            this.setData({
                ['products']: res
            })
        });
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
        this.setData({
            ['param.pageNum']: this.data.param.pageNum++
        })
        this.selectPage().then(res => {
            this.data.products.push(res)
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    cardClick: function (product) {
        this.setData({
            ['visible']: true,
            ['product']: product.currentTarget.dataset.product
        });
    },

    async selectPage() {
        const that = this;
        let products = [];
        await wx.cloud.callFunction({
            name: 'getWXContext'
        }).then(e => {
            that.setData({
                ['param.filter.open_id']: e.result.openid
            })
        })
        if (that.data.param.filter.open_id) {
            await wx.cloud.callFunction({
                name: 'selectPageProduct',
                data: that.data.param
            }).then((e) => {
                products = e.result.data;
            })
        }
        for (let i = 0; i < products.length; i++) {
            let res = await wx.cloud.getTempFileURL({
                fileList: [{
                    fileID: products[i].images[0].file_id,
                    maxAge: 60 * 60, // one hour
                }]
            });
            // get temp file URL
            products[i].tempFileURL = res.fileList[0].tempFileURL
        }
        return products;
    },
    async handleClickItem({detail}) {
        let that = this;
        switch (detail.index) {
            case 0:
                // 跳转至商品详情界面
              await  wx.navigateTo({
                    url: '/pages/productDetail/productDetail',
                    events: {},
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', {product: that.data.product})
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
    handleCancel() {
        this.setData({
            ['visible']: false
        });
    },
    async handleClick1() {
        await wx.cloud.callFunction({
            name: 'deleteProduct',
            data: {
                filter: {
                    _id: this.data.product._id
                }
            }
        })
        wx.switchTab({
            url: '/pages/me/me'
        })
    },
    handleClose1() {
        this.setData({
            ['visible']: false,
            ['visible1']: false
        });
    }
});
