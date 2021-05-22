// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const {user} = event
    const wxContext = cloud.getWXContext()

    let userResult = await db.collection('user').where({open_id: wxContext.OPENID}).count();
    // 如果如果用户信息没有入库则添加
    if (userResult.total === 0) {
        try {
            await db.collection('user').add({
                data: {
                    open_id: wxContext.OPENID,
                    nickName: user.nickName,
                    avatarUrl: user.avatarUrl,
                    country: user.country,
                    province: user.province,
                    gender: user.gender,
                }
            })
        } catch (e) {
            console.error(e)
        }
    } else {
        // 如果已经存在库里则更新用户信息
        try {
            await db.collection('user').where({open_id: wxContext.OPENID}).update({
                data: {
                    open_id: wxContext.OPENID,
                    nickName: user.nickName,
                    avatarUrl: user.avatarUrl,
                    country: user.country,
                    province: user.province,
                    gender: user.gender,
                }
            })
        } catch (e) {
            console.error(e)
        }
    }
}