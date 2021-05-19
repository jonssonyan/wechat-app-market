// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database();
// 通用函数云函数
exports.main = async (event, context) => {
    const {filter = {}, dbName} = event;
    await db.collection(dbName).where(filter).remove()
}