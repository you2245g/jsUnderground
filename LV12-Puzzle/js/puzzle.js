var nn = new Vue({

    el:'#wrapper',
    data:{
        coverPage:true,
        playgroundPage:false,
    },
    methods:{
        //遊戲開始按鈕
        gameStart(){
            this.coverPage = false
            this.playgroundPage = true
        }
    },

});