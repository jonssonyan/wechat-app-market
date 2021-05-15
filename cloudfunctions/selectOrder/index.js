// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    let {pageNum, pageSize, filter} = event;

    pageNum = pageNum ? pageNum : 1; // 不传默认第一页
    pageSize = pageSize ? pageSize : 10; // 不传默认一个10条数据
    filter = filter ? filter : {};

    return await db.collection('order').where(filter)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize).get().then(orders => {
            return orders;
        }).catch((e) => {
            console.log('selectOrder error' + e)
        });
};
