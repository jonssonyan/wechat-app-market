// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 添加订单详情
exports.main = async (event, context) => {
    const {num, orderId, productId} = event;
    try {
        return await db.collection('order_detail').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                num: num,
                order_id: orderId,
                product_id: productId
            }
        })
    } catch (e) {
        console.error(e)
    }
}
