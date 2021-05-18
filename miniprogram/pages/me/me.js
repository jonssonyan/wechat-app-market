Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false
    },
    onLoad: function (options) {

    },
    // 请求API授权，获得用户头像和昵称
    getUserProfile(e) {
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
                // 将用户信息设置到全局变量
                var app = getApp();
                app.globalData.userInfo = res.userInfo;
                app.globalData.hasUserInfo = true;
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
            }
        })
    },
    getUserInfo(e) {
        // 将用户信息设置到全局变量
        var app = getApp();
        app.globalData.userInfo = e.detail.userInfo;
        app.globalData.hasUserInfo = true;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    onShow: function () {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
    }
});
