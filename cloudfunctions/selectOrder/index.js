// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    let {pageNum, pageSize} = event;

    pageNum = pageNum ? pageNum : 1; // 不传默认第一页
    pageSize = pageSize ? pageSize : 10; // 不传默认一个10条数据

    const wxContext = cloud.getWXContext();
    let openid = wxContext.OPENID;
    let orders = await db.collection('order').where({seller: openid})
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize).get().then(orders => {
            for (let i = 0; i < orders.length; i++) {
                let da = new Date(orders[i].create_time);
                let year = da.getFullYear();
                let month = da.getMonth() + 1;
                let date = da.getDate();
                let hours = da.getHours();
                let minutes = da.getMinutes();
                let seconds = da.getSeconds();
                orders[i].create_time = [year, month, date].join("-") + " " + [hours, minutes, seconds].join(':');
            }
            return orders;
        });
    for (let i = 0; i < orders.length; i++) {
        orders[i].products = await db.collection('product').where({_id: orders[i].product_id).get()
            .then(products => {
                return products
            });
        console.log(orders[i])
    }
    return orders;
};
