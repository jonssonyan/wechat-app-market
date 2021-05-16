// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const {collection} = event;

    let countResult = await db.collection('collection').where({
        open_id: collection.open_id,
        product_id: collection.product_id
    }).count();
    // 如果已经收藏则返回false
    if (countResult.total > 0) {
        return false
    }

    try {
        await db.collection('collection').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                open_id: collection.open_id,
                product_id: collection.product_id,
                create_time: new Date().getTime()
            }
        });
        return true;
    } catch (e) {
        console.error(e)
    }
}