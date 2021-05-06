// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const MAX_LIMIT = 100;
// 查询所有分类，不分页
exports.main = async (event, context) => {
    let {dbName, filter} = event;
    const countResult = await db.collection(dbName).where(filter).count();
    const total = countResult.total;
    filter = filter ? filter : {};
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100);
    // 承载所有读操作的 promise 的数组
    const tasks = [];
    for (let i = 0; i < batchTimes; i++) {
        const promise = db.collection(dbName).where(filter).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
        tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
        return {
            data: acc.data.concat(cur.data),
            errMsg: acc.errMsg,
        }
    })
};
