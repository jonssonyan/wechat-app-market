// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

    const {product = {}} = event;
    if (product._id !== undefined || null || '') {
        if (product.stock === 0) {
            product.state = 0
        }
        try {
            return await db.collection('product').where({
                _id: product._id
            }).update({
                data: {
                    name: product.name,
                    stock: product.stock,
                    price: product.price,
                    state: product.state,
                    category_id: product.category_id,
                    description: product.description
                },
            })
        } catch (e) {
            console.error(e)
        }
    }
}