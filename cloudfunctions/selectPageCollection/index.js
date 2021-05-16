// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const {pageNum = 1, pageSize = 10, filter = {}} = event;
    const countResult = await db.collection('collection').where(filter).count();
    const total = countResult.total; // 总记录数
    const totalPage = Math.ceil(total / pageSize); // 总共有多少页
    let hasMore = pageNum < totalPage;

    let collectionsResult = await db.collection('collection')
        .where(filter)
        .orderBy('create_time', 'desc')
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize).get().then(res => {
            res.hasMore = hasMore;
            res.pageNum = pageNum;
            res.pageSize = pageSize;
            res.total = total;
            return res;
        });
    let res = collectionsResult.data;
    for (let i = 0; i < res.length; i++) {
        res[i].products = await db.collection('product').where({_id: res[i].product_id}).get().then(res => res.data)
        res[i].createTime = dataToString(res[i].create_time)
    }
    return collectionsResult;
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