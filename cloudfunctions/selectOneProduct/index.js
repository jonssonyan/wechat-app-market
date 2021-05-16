// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const {filter = {}} = event;

    const wxContext = cloud.getWXContext()

    let productResult = await db.collection('product').where(filter).limit(1).get();
    let res = productResult.data;
    for (let i = 0; i < res.length; i++) {
        res[i].images = await db.collection('image').where({product_id: res[i]._id}).get().then(res => res.data)
        res[i].category = await db.collection('category').where({_id: res[i].category_id}).get().then(res => res.data);
        res[i].createTime = dataToString(res[i].create_time)
        let countResult = await db.collection('collection').where({
            product_id: res[i]._id,
            open_id: wxContext.OPENID
        }).count();
        res[i].isCollection = countResult.total > 0;
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