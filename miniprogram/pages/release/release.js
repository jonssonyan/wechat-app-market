const {$Message} = require('../../components/base/index');

Page({
    data: {
        categorys: [],
        category: {},
        product: {
            name: '',
            price: '',
            stock: 1,
            state: true,
            category_id: null
        },
        files: [],
        urls: []
    },
    onLoad: function (options) {
        this.setData({
            selectFile: this.selectFile.bind(this),
            uplaodFile: this.uplaodFile.bind(this)
        });
        wx.cloud.callFunction({
            name: 'selectList',
            data: {
                dbName: 'category'
            }
        }).then(e => {
            this.setData({
                categorys: e.result.data
            })
        });
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
        console.log(this.data.product);
        console.log(this.data.urls)
    },
    bindPickerChange: function (e) {
        let category = this.data.categorys[e.detail.value];
        this.setData({
            ['category']: category,
            ['product.category_id']: category._id
        });
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
    selectFile(files) {
        console.log('files', files)
        // 返回false可以阻止某次文件上传
    },
    uplaodFile(files) {
        let tempFiles = files.tempFiles;
        var that = this;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < tempFiles.length; i++) {
                let path = tempFiles[i].path;
                let pathCloud = 'image/' + new Date().getTime() + path.split('/')[3];
                wx.cloud.uploadFile({
                    cloudPath: pathCloud,
                    // 本地文件路径
                    filePath: path
                }).then(res => {
                    that.data.urls.push(res.fileID);
                    resolve({'urls': that.data.urls});
                }).catch(error => {
                    reject(error)
                })
            }
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    uploadError(e) {
        let type = e.detail.type;
        let msg;
        if (type === 1) {
            msg = '图片超过大小限制';
        } else if (type === 2) {
            msg = '选择图片失败';
        } else if (type === 3) {
            msg = '图片上传失败';
        }
        $Message({
            content: msg,
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
