// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const {filter = {}, isBuy = false} = event;

    let res = await db.collection('order').where(filter).limit(1).get().then(res => res.data);
    for (let i = 0; i < res.length; i++) {
        res[i].createTime = dataToString(res[i].create_time)
        res[i].product = await db.collection('product').where({_id: res[i].product_id}).get().then(res => res.data);
        res[i].user = await db.collection('user').where({open_id: (isBuy ? res[i].seller : res[i].buyer)}).get().then(res => res.data);
    }
    return res;
}

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