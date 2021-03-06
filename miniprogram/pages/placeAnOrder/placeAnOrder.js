const {$Message} = require('../../components/base/index');
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
                address: '',
                buyer: null,
                seller: null,
                contact: ''
            }
        },
        product: {},
        updateProductParam: {
            product: {}
        },
        butDisabled: false
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
    bindContactChange({detail}) {
        this.setData({
            ['orderParam.order.contact']: detail.detail.value
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
        if (this.data.orderParam.order.address === '') {
            $Message({
                content: '请输入收货地址',
                type: 'warning'
            });
            return
        } else if (this.data.method === null) {
            $Message({
                content: '请输入付款方式',
                type: 'warning'
            });
            return
        } else if (this.data.orderParam.order.contact === '') {
            $Message({
                content: '请输入手机号码',
                type: 'warning'
            });
            return
        }
        this.setData({
            ['butDisabled']: true
        });
        let that = this;
        let openid = await wx.cloud.callFunction({
            name: 'getWXContext',
            data: {}
        }).then(e => e.result.openid);
        if (openid !== undefined || null) {
            if (openid === this.data.product.open_id) {
                $Message({
                    content: '不能购买自己发布的商品',
                    type: 'warning'
                });
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
                    ['updateProductParam.product.stock']: that.data.product.stock - that.data.num
                })
                await wx.cloud.callFunction({
                    name: 'updateProduct',
                    data: that.data.updateProductParam
                })
                wx.switchTab({
                    url: '/pages/me/me'
                })
            }
        }
    },
    bindAddressChange(e) {
        this.setData({
            ['orderParam.order.address']: e.detail.detail.value
        })
    }
})