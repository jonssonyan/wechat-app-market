// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

// 分页查询通用函数
exports.main = async (event, context) => {
    const {dbName, filter = {}, pageSize = 10, pageNum = 1} = event;

    const countResult = await db.collection(dbName).where(filter).count();
    const total = countResult.total; // 总记录数
    const totalPage = Math.ceil(total / pageSize); // 总共有多少页
    let hasMore = pageNum < totalPage;
    return await db.collection(dbName).where(filter).skip((pageNum - 1) * pageSize).limit(pageSize).get().then(res => {
        res.hasMore = hasMore;
        res.pageNum = pageNum;
        res.pageSize = pageSize;
        res.total = total;
        return res;
    })
};