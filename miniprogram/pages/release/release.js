Page({
    data: {
        name: '',
        price: '',
        stock: 1,
        state: true
    },
    onLoad: function (options) {

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
