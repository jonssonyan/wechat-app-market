// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 添加订单
exports.main = async (event, context) => {
    const {address, buyer, seller, state} = event;
    const wxContext = cloud.getWXContext();
    try {
        return await db.collection('order').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                address: address,
                buyer: wxContext.OPENID,
                create_time: new Date(),
                seller: seller,
                state: state
            }
        })
    } catch (e) {
        console.error(e)
    }
};
