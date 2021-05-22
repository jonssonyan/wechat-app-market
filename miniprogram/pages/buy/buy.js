// miniprogram/pages/buy/buy.js
const {$Message} = require('../../components/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 订单列表
        orders: [],
        // 查询订单时的参数对象
        orderParam: {
            dbName: 'order',
            pageNum: 1,
            pageSize: 10,
            filter: {
                buyer: null
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
        order: {}
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
        this.selectPage().then((res) => {
            this.setData({
                ['orders']: res
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
            ['orderParam.pageNum']: this.data.orderParam.pageNum++
        })
        this.selectPage().then(res => {
            this.data.orders.push(res)
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    async selectPage() {
        // 获取订单列表
        await wx.cloud.callFunction({
            name: 'getWXContext'
        }).then(e => {
            this.setData({
                ['orderParam.filter.buyer']: e.result.openid
            })
        })
        if (this.data.orderParam.filter.buyer) {
            let orders = await wx.cloud.callFunction({
                name: 'selectPageOrder',
                data: this.data.orderParam
            }).then((e) => e.result.data);
            for (let i = 0; i < orders.length; i++) {
                let products = orders[i].products;
                let res = await wx.cloud.getTempFileURL({
                    fileList: [{
                        fileID: products[0].images[0].file_id,
                        maxAge: 60 * 60, // one hour
                    }]
                });
                // get temp file URL
                products[0].tempFileURL = res.fileList[0].tempFileURL
            }
            return orders;
        }
    },
    cardClick(order) {
        this.setData({
            ['visible']: true,
            ['order']: order.currentTarget.dataset.order
        });
    },
    // 删除订单
    async handleClick1() {
        if (this.data.order.state === 0) {
            $Message({
                content: '订单未完成,暂不可删除',
                type: 'warning'
            });
            this.handleClose1();
            return
        }
        await wx.cloud.callFunction({
            name: 'delete',
            data: {
                filter: {
                    dbName: 'order',
                    filter: {
                        _id: this.data.order._id
                    }
                }
            }
        });
        this.handleClose1();
        this.onShow();
    },
    // 取消删除
    handleClose1() {
        this.setData({
            ['visible']: false,
            ['visible1']: false
        });
    },
    async handleClickItem({detail}) {
        let that = this;
        switch (detail.index) {
            case 0:
                // 跳转至商品详情界面
                await wx.navigateTo({
                    url: '/pages/buyDetail/buyDetail',
                    events: {},
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', {order: that.data.order})
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
    }
})