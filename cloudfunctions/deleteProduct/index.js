// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const {filter} = event

    // 删除商品
    await db.collection('product').where(filter).remove()
    // 删除商品关联的图片
    await db.collection('image').where({product_id: filter._id}).remove()
}