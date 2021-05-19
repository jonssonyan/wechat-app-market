const {$Message} = require('../../components/base/index');

Page({
    data: {
        // 控制弹窗的显示与隐藏
        visible: true,
        hasUserInfo: false,
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
    async handleSubmit() {
        // 修改商品
        await wx.cloud.callFunction({
            name: 'updateProduct',
            data: {
                product: this.data.product
            }
        });
        // 修改成功后跳转至我的商品界面
        wx.switchTab({
            url: '/pages/me/me'
        });
    },
    bindPickerChange: function (e) {
        let category = this.data.categorys[e.detail.value];
        this.setData({
            ['category']: category,
            ['product.categoryId']: category._id
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
    },
    deleteFile(e) {
        this.data.urls.splice(e.detail.index, 1)
    },
    handleOk() {
        wx.switchTab({
            url: '/pages/me/me'
        })
    },
    handleCancel() {
        this.setData({
            visible: false
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 将上一个界面传来的参数设置到本页面中
        let that = this;
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            that.setData({
                ['product']: data.product
            })
        });

        this.setData({
            selectFile: this.selectFile.bind(this),
            uplaodFile: this.uplaodFile.bind(this)
        });
        wx.cloud.callFunction({
            name: 'selectList',
            data: {
                dbName: 'category',
                filter: {}
            }
        }).then(e => {
            this.setData({
                categorys: e.result.data
            })
        });

        wx.cloud.callFunction({
            name: 'selectList',
            data: {
                dbName: 'category',
                filter: {_id: that.data.category_id}
            }
        }).then(e => {
            this.setData({
                ['category']: e.result.data[0]
            })
        });
    }
});