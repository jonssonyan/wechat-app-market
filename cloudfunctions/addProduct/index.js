// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 添加商品
exports.main = async (event, context) => {
    const {category_id, name, price, state, stock, description} = event;
    const wxContext = cloud.getWXContext();
    try {
        return await db.collection('product').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                category_id: category_id,
                name: name,
                open_id: wxContext.OPENID,
                price: price,
                state: state,
                stock: stock,
                description: description,
                create_time: new Date().getTime()
            }
        })
    } catch (e) {
        console.error(e)
    }
};
