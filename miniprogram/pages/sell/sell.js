// miniprogram/pages/sell/sell.js
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
        let that = this;
        this.selectPage().then((res) => {
            that.setData({
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
        let that = this;
        this.setData({
            ['param.pageNum']: that.data.orderParam.pageNum++
        })
        this.selectPage().then(res => {
            that.data.orders.push(res)
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    cardClick: function (order) {
        this.setData({
            ['visible']: true,
            ['order']: order.currentTarget.dataset.order
        });
    },
    async selectPage() {
        const that = this;
        let orders = [];
        // 设置当前用户的openid
        await wx.cloud.callFunction({
            name: 'getWXContext'
        }).then(e => {
            that.setData({
                ['orderParam.filter.seller']: e.result.openid
            })
        })
        if (that.data.orderParam.filter.seller) {
            // 获取订单列表
            await wx.cloud.callFunction({
                name: 'selectPageOrder',
                data: that.data.orderParam
            }).then((e) => {
                orders = e.result.data
            })
        }
        for (let i = 0; i < orders.length; i++) {
            let products = orders[i].products;
            let res = await wx.cloud.getTempFileURL({
                fileList: [{
                    fileID: products[i].images[0].file_id,
                    maxAge: 60 * 60, // one hour
                }]
            });
            // get temp file URL
            products[i].tempFileURL = res.fileList[0].tempFileURL
        }
        return orders;
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
        })
        wx.switchTab({
            url: '/pages/me/me'
        })
    },
    // 取消删除
    handleClose1() {
        this.setData({
            ['visible']: false,
            ['visible1']: false
        });
    },
    handleClickItem({detail}) {
        let that = this;
        switch (detail.index) {
            case 0:
                // 跳转至商品详情界面
                // wx.navigateTo({
                //     url: '/pages/sellDetail/sellDetail',
                //     events: {},
                //     success: function (res) {
                //         // 通过eventChannel向被打开页面传送数据
                //         res.eventChannel.emit('acceptDataFromOpenerPage', {order: that.data.order})
                //     }
                // })
                console.log(that.data.order)
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
});
