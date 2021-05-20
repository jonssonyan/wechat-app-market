// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {

    const {order = {}} = event;
    if (order._id !== undefined || null || '') {
        try {
            return await db.collection('order').where({
                _id: order._id
            }).update({
                data: {
                    address: order.address,
                    buyer: order.buyer,
                    num: order.num,
                    product_id: order.product_id,
                    seller: order.seller,
                    state: order.state,
                    total_price: order.total_price
                },
            })
        } catch (e) {
            console.error(e)
        }
    }
}