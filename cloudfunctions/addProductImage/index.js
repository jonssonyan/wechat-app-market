// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 添加商品和图片的关联关系
exports.main = async (event, context) => {
    const {imageId, productId} = event;
    try {
        return await db.collection('product_image').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                image_id: imageId,
                product_id: productId
            }
        })
    } catch (e) {
        console.error(e)
    }
}
