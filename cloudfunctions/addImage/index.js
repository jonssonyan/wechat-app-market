// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();
// 添加图片信息
exports.main = async (event, context) => {
    const {fileId, productId} = event;
    try {
        return await db.collection('image').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                file_id: fileId,
                product_id: productId
            }
        })
    } catch (e) {
        console.error(e)
    }
};
