Page({
    data: {
        avatarUrl: '',
        nickName: '',
        result: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function (options) {

    },
    // 请求API授权，获得用户头像和昵称
    bindGetUserInfo(e) {
        // 查看是否授权
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserProfile({
                        success: function (res) {
                            that.setData({
                                result: true,// 结果
                                nickName: res.userInfo.nickName,// 微信昵称
                                avatarUrl: res.userInfo.avatarUrl,// 微信头像
                            })
                        }
                    })
                } else {
                    // 未授权，结果返回null
                    that.setData({
                        result: false,// 结果
                    })
                }
            }
        })
    }
});
