// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const {filter = {}, stockGt1Flag = false, pageSize = 10, pageNum = 1} = event;
    const _ = db.command
    if (stockGt1Flag === true) {
        filter.stock = _.gt(1);
    }

    if (filter.name !== undefined || null || '') {
        filter.name = db.RegExp({
            regexp: '.*' + filter.name + '.*',
            options: 'i',
        });
    }

    const countResult = await db.collection('product').where(filter).count();
    const total = countResult.total; // 总记录数
    const totalPage = Math.ceil(total / pageNum); // 总共有多少页
    let hasMore = pageNum < totalPage;
    let productResult = await db.collection('product').where(filter).skip((pageNum - 1) * pageSize).orderBy('create_time', 'desc').limit(pageSize).get().then(res => {
        res.hasMore = hasMore;
        res.pageNum = pageNum;
        res.pageSize = pageSize;
        res.total = total;
        return res;
    });
    let res = productResult.data;
    for (let i = 0; i < res.length; i++) {
        res[i].images = await db.collection('image').where({product_id: res[i]._id}).get().then(res => res.data)
        res[i].create_time = dataToString(res[i].create_time)
    }
    return productResult;
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