Page({

    /**
     * 页面的初始数据
     */
    data: {
        categorys: [],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.cloud.callFunction({
            name: 'selectList',
            data: {
                dbName: 'category'
            }
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
