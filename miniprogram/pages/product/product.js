Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: [],
        param: {
            dbName: 'product',
            pageNum: 1,
            pageSize: 10
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
        const that = this;
        wx.cloud.callFunction({
            name: 'selectPage',
            data: that.data.param
        }).then((e) => {
            let products = e.result.data;
            for (let i = 0; i < products.length; i++) {
                wx.cloud.callFunction({
                    name: 'selectList',
                    data: {
                        dbName: 'image',
                        filter: {
                            product_id: products[i]._id
                        }
                    }
                }).then(e => {
                    let fileId = e.result.data[0].file_id;
                    if (fileId !== undefined && fileId !== null && fileId !== '') {
                        wx.cloud.getTempFileURL({
                            fileList: [{
                                fileID: fileId,
                                maxAge: 60 * 60,
                            }]
                        }).then(res => {
                            if (res.fileList.length > 0) {
                                products[i].pic = res.fileList[0].tempFileURL
                            }
                        }).catch(error => {
                            console.log(error)
                        });
                    }
                });
            }
            console.log(products)
            that.setData({
                ['products']: products
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

    }
})
