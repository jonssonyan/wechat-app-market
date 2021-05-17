// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 添加订单
exports.main = async (event, context) => {
    const {order} = event;
    try {
        return await db.collection('order').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                address: order.address,
                buyer: order.buyer,
                create_time: new Date().getTime(),
                seller: order.seller,
                state: 0, // 等待收获
                num: order.num,
                total_price: order.totalPrice,
                product_id: order.productId
            }
        })
    } catch (e) {
        console.error(e)
    }
};
