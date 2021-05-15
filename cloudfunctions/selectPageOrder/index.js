// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const {pageNum = 1, pageSize = 10, filter = {}} = event;

    let orders = await db.collection('order').where(filter)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize).get().then(res => res);
    for (let order in orders) {
        order.product = await db.collection('product').where({_id: order.product_id}).get()
    }
    return orders;
};
