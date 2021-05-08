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
        this.selectPage();
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
        let that = this;
        this.setData({
            ['param.pageNum']: that.data.param.pageNum++
        })
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

    cardClick: function (e) {
        console.log(e)
    },

    selectPage() {
        const that = this;
        wx.cloud.callFunction({
            name: 'selectPage',
            data: that.data.param
        }).then((e) => {
            let products = e.result.data;
            for (let i = 0; i < products.length; i++) {
                let da = new Date(products[i].create_time);
                let year = da.getFullYear();
                let month = da.getMonth() + 1;
                let date = da.getDate();
                let hours = da.getHours();
                let minutes = da.getMinutes();
                let seconds = da.getSeconds();
                products[i].create_time = [year, month, date].join("-") + " " + [hours, minutes, seconds].join(':');
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
                                products[i].thumb = res.fileList[0].tempFileURL
                            }
                        }).catch(error => {
                            console.log(error)
                        });
                    }
                });
            }
            that.setData({
                ['products']: products
            })
        })
    }
});
