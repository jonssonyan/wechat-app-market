// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 添加商品
exports.main = async (event, context) => {
    const {categoryId, name, price, state, stock} = event;
    const wxContext = cloud.getWXContext();
    try {
        return await db.collection('product').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                category_id: categoryId,
                name: name,
                open_id: wxContext.OPENID,
                price: price,
                state: state,
                stock: stock
            }
        })
    } catch (e) {
        console.error(e)
    }
};
