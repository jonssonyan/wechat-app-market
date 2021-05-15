// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const {filter = {}, pageSize = 10, pageNum = 1} = event;

    const countResult = await db.collection('product').where(filter).count();
    const total = countResult.total; // 总记录数
    const totalPage = Math.ceil(total / pageNum); // 总共有多少页
    let hasMore = pageNum < totalPage;
    let productResult = await db.collection('product').where(filter).skip((pageNum - 1) * pageSize).limit(pageSize).get().then(res => {
        res.hasMore = hasMore;
        res.pageNum = pageNum;
        res.pageSize = pageSize;
        res.total = total;
        return res;
    });
    let res = productResult.data;
    for (let i = 0; i < res.length; i++) {
        res[i].images = await db.collection('image').where({product_id: res[i]._id}).get().then(res => res.data)
    }
    return productResult;
}