// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const {filter = {}} = event;

    let productResult = await db.collection('product').where(filter).limit(1).get();
    console.log(productResult)
    let res = productResult.data;
    for (let i = 0; i < res.length; i++) {
        res[i].images = await db.collection('image').where({product_id: res[i]._id}).get().then(res => res.data)
    }
    return productResult;
}