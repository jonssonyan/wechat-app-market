Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
        addUserParam: {
            user: {}
        }
    },
    onLoad: function (options) {

    },
    // 请求API授权，获得用户头像和昵称
    async getUserProfile(e) {
        await wx.getUserProfile({
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
        await wx.cloud.callFunction({
            name: 'addUser',
            data: {
                user: this.data.userInfo
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
    },
    async toUserInfo() {
        let openid = await wx.cloud.callFunction({
            name: 'getWXContext'
        }).then(e => e.result.openid);
        wx.navigateTo({
            url: '/pages/userInfo/userInfo',
            events: {},
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {openid: openid})
            }
        })
    }
});
