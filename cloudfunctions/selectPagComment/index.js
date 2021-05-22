// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const {filter = {}, pageSize = 10, pageNum = 1} = event;

    const countResult = await db.collection('comment').where(filter).count();
    const total = countResult.total; // 总记录数
    const totalPage = Math.ceil(total / pageSize); // 总共有多少页
    let hasMore = pageNum < totalPage;
    let commentPage = await db.collection('comment').where(filter).orderBy('create_time', 'desc').skip((pageNum - 1) * pageSize).limit(pageSize).get().then(res => {
        res.hasMore = hasMore;
        res.pageNum = pageNum;
        res.pageSize = pageSize;
        res.total = total;
        return res;
    });
    let comments = commentPage.data;
    for (let i = 0; i < comments.length; i++) {
        let seller = await db.collection('user').where({open_id: comments[i].seller_open_id}).get().then(res => res.data);
        let buyer = await db.collection('user').where({open_id: comments[i].buyer_open_id}).get().then(res => res.data);
        comments[i].seller = seller;
        comments[i].buyer = buyer;
        comments[i].create_time = dataToString(comments[i].create_time)
    }
    return commentPage;
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