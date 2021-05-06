// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

// 分页查询通用函数
exports.main = async (event, context) => {
    let {dbName, filter, pageSize, pageNum} = event;
    pageNum = pageNum ? pageNum : 1; // 不传默认第一页
    pageSize = pageSize ? pageSize : 10; // 不传默认一个10条数据
    filter = filter ? filter : {};
    const countResult = await db.collection(dbName).where(filter).count();
    const total = countResult.total; // 总记录数
    const totalPage = Math.ceil(total / 10); // 总共有多少页
    let hasMore = pageNum <= totalPage;
    return db.collection(dbName).where(filter).skip((pageNum - 1) * pageSize).limit(pageSize).get().then(res => {
        res.hasMore = hasMore;
        return res;
    })
};
