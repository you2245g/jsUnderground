var nn = new Vue({

    el:'#wrapper',
    data:{
        galleryText:['Depression','Angry','Pressure','Lust','Violence'],
        nowArray:[0,1,2,3,4],
    },
    mounted(){
        //初始input欄focus
        $( "input" ).focus();
        //css初始化設定
        this.cssHandler();
    },
    methods:{
        //圖像src return
        gallery(key){
            return `background-image: url('img/slider_${key}.jpg');`
        },
        //左控制
        leftHandler(){
            let vm = this;
            //陣列操作(減相)
            vm.nowArray.forEach(function(item,index,array){
                array[index] = item - 1;
                if(array[index] < 0){
                    array[index] = vm.galleryText.length - 1;
                }
            });
            //css渲染
            vm.cssHandler();
        },
        //右控制
        rightHandler(){
            let vm = this;
            //陣列操作(加相)
            vm.nowArray.forEach(function(item, index, array){
                array[index] = item + 1;
                if(array[index] == vm.galleryText.length){
                    array[index] = 0;
                }
            });
            //css渲染
            vm.cssHandler();
        },
        //消除功能
        eliminate(){
            let name = document.getElementById('name').value;  //求出input值
            let index = this.galleryText.indexOf(name);        //求出順位
            let check = $(`.imgDist > div > div:eq(${index})`).attr('style');  //求出檢查值

            //不符合時執行(索引找不到或check裡已有background-color)
            if(index == -1 || check =='background-color: black;'){
                $('input').val('');
                $('.writting').attr('class','writting animate__animated animate__shakeX');
                setTimeout(function(){
                    $('.writting').attr('class','writting');
                },500);
                return
            }
            //符合時執行
            //消除動畫效果
            $(`.imgDist > div > div:eq(${index})`).css({
                "animation-name":"animate",
                "animation-duration":"2s",
                "animation-fill-mode":"forwards",
            });
            //文字及照片效果(設定兩秒後執行)
            setTimeout(function(){
                //變紅色及增加刪除線
                let del = $(`<del>${name}</del>`);
                $(`.imgDist p:eq(${index})`).css('color','red').text('').append(del);  
                //照片黑屏
                $(`.imgDist > div > div:eq(${index})`).removeAttr('style');
                $(`.imgDist > div > div:eq(${index})`).css('background-color','black');
                //input欄清空
                $('input').val('');
            },2001);
        },
        
        
        //css樣式渲染
        cssHandler(){
            $(`.imgDist > div:lt(${this.galleryText.length})`).attr('class','');  //去除既有css
            $(`.imgDist > div:eq(${this.nowArray[0]})`).addClass('first');
            $(`.imgDist > div:eq(${this.nowArray[1]})`).addClass('previous');
            $(`.imgDist > div:eq(${this.nowArray[2]})`).addClass('selected');
            $(`.imgDist > div:eq(${this.nowArray[3]})`).addClass('next');
            $(`.imgDist > div:eq(${this.nowArray[4]})`).addClass('last');  
        },

    },
})
