Page({
    data: {
        name: '',
        num: 0,
        price: '',
        stock: 1,
        state: true
    },
    onLoad: function (options) {

    },
    handleChangePrice({detail}) {
        this.setData({
            num: detail.value
        })
    },
    handleChangeStock({detail}) {
        this.setData({
            stock: detail.value
        })
    },
    onChange(event) {
        const detail = event.detail;
        this.setData({
            state: detail.value
        })
    },
    handleClick() {
        console.log(this.data.state)
    }
});
