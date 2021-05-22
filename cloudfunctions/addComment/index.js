// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const {comment} = event;

    // 一个人对一个商家的指定商品只能评价一次
    let countResult = await db.collection('comment').where({
        seller_open_id: comment.seller_open_id,
        buyer_open_id: wxContext.OPENID,
        order_id: comment.order_id
    }).count();
    // 如果已经收藏则返回false
    if (countResult.total > 0) return "您已经评论过了"

    try {
        await db.collection('comment').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                seller_open_id: comment.seller_open_id,
                buyer_open_id: wxContext.OPENID,
                order_id: comment.order_id,
                create_time: new Date().getTime(),
                content: comment.content,
                star: comment.star
            }
        });
    } catch (e) {
        console.error(e)
    }
}