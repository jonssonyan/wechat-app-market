// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const {pageNum = 1, pageSize = 10, filter = {}} = event;

    let orders = await db.collection('order')
        .where(filter)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize).get();
    let res = orders.data;
    for (let i = 0; i < res.length; i++) {
        res[i].product = await db.collection('product').where({_id: res[i].product_id}).limit(1).get().then(res => res.data[0])
        res[i].createTime = dataToString(res[i].create_time)
    }
    return orders;
};

// 时间戳转换为 yyyy-MM-dd HH:mm:ss 的字符串格式
function dataToString(time) {
    let da = new Date(time);
    let year = da.getFullYear();
    let month = da.getMonth() + 1;
    let date = da.getDate();
    let hours = da.getHours();
    let minutes = da.getMinutes();
    let seconds = da.getSeconds();
    return [year, month, date].join("-") + " " + [hours, minutes, seconds].join(':');
}
