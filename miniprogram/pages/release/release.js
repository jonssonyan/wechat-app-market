const {$Message} = require('../../components/base/index');

Page({
    data: {
        product: {
            name: '',
            price: '',
            stock: 1,
            state: true
        },
        files: []
    },
    onLoad: function (options) {
        this.setData({
            selectFile: this.selectFile.bind(this),
            uplaodFile: this.uplaodFile.bind(this)
        })
    },
    handleChangeStock({detail}) {
        this.setData({
            ['product.stock']: detail.value
        })
    },
    handleChangeState(event) {
        const detail = event.detail;
        this.setData({
            ['product.state']: detail.value
        })
    },
    handleSubmit() {
        console.log(this.data.product)
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    selectFile(files) {
        // 选择图片时的过滤函数，返回true表示图片有效
        console.log('files', files)
    },
    uplaodFile(files) {
        console.log('upload files', files)
        // 文件上传的函数，返回一个promise
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('some error')
            }, 1000)
        })
    },
    uploadError(e) {
        $Message({
            content: '上传失败',
            type: 'warning'
        });
    },
    uploadSuccess(e) {
        $Message({
            content: '上传成功',
            type: 'success'
        });
    }
});
