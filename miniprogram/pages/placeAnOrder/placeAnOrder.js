// miniprogram/pages/placeAnOrder/placeAnOrder.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        methods: [{id: 1, name: '见面交易'}],
        method: null,
        orderParam: {
            dbName: 'order',
            order: {
                num: 1,
                address: null,
                buyer: null,
                seller: null
            }
        },
        product: {},
        visible: false,
        msg: '',
        updateProductParam: {
            product: {}
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
        let that = this;
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            that.setData({
                // 商品
                ['product']: data.product,
                // 商品总价
                ['orderParam.order.totalPrice']: that.data.orderParam.order.num * data.product.price,
                // 商品id
                ['orderParam.order.productId']: data.product._id
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
    // 切换付款方式
    bindPickerChange({detail}) {
        let method = this.data.methods[detail.value];
        this.setData({
            ['method']: method
        });
    },
    // 切换下单数量
    handleChangeNum({detail}) {
        this.setData({
            ['orderParam.order.num']: detail.value,
            ['orderParam.order.totalPrice']: this.data.product.price * detail.value
        })
    },
    async placeAnOrder() {
        // 表单验证
        if (this.data.address === '') {
            this.setData({
                ['visible']: true,
                ['msg']: '请输入收货地址'
            })
            return
        }
        if (this.data.method == null) {
            this.setData({
                ['visible']: true,
                ['msg']: '请输入付款方式'
            })
            return
        }
        let that = this;
        let openid = await wx.cloud.callFunction({
            name: 'getWXContext',
            data: {}
        }).then(e => e.result.openid);
        if (openid !== undefined || null) {
            if (openid === this.data.product.open_id) {
                this.setData({
                    ['visible']: true,
                    ['msg']: '不能购买自己发布的商品'
                })
                return
            }
            this.setData({
                ['orderParam.order.buyer']: openid,
                ['orderParam.order.seller']: that.data.product.open_id
            });
            let suc = false;
            await wx.cloud.callFunction({
                name: 'addOrder',
                data: this.data.orderParam
            }).then(e => {
                suc = true;
            })
            if (suc) {
                this.setData({
                    ['updateProductParam.product._id']: that.data.product._id,
                    ['updateProductParam.product.stock']: that.data.product.stock - 1
                })
                await wx.cloud.callFunction({
                    name: 'updateProduct',
                    data: that.data.updateProductParam
                })
                wx.reLaunch({
                    url: '/pages/buy/buy'
                })
            }
        }
    },
    handleOk() {
        this.setData({
            ['visible']: false
        })
    }
})