var nn = new Vue({

    el:"#wrapper",
    data:{
        //coverPage元件
        coverPage:true,   
        coverButtonText:['網站上線','感情姻緣','事業工作','家庭生活','求財運勢','參選總統'],
        selectButtonData:0,  //被選擇的抽籤型式
        //drawResult元件
        drawResult:false, 
        drawEnd:false,    
        detail:false,     
        //籤詩資料
        url:'./draw.json',       //籤載入址
        drawList:'',     //抽籤號
        drawTitle:'',    //籤列號
        fate:'',         //命運
        drawName:'',     //籤名
        poem:'',  //籤詩
        mean:'',     //聖意
        explan:'',   //釋義
    },
    methods:{
        //按鈕dataNum設置
        buttonDataNum(val){
            return `${val + 1}` //產生1~6數字
        },
        //選擇抽籤型式
        selectDraw(obj){
            this.selectButtonData = obj.target.dataset.num;
            //迴圈清除style
            for(i = 1;i<this.coverButtonText.length + 1; i++){
                $(`[data-num="${i}"]`).removeAttr('style');
            }
            //設置style
            $(`[data-num="${this.selectButtonData}"]`).css({'background-color':'rgba(255,255,255,0.5)','color':'black'});
            //移除開始抽籤disabled
            $('#coverPage button:last-child').removeAttr('disabled');
        },
        //執行抽籤
        startDraw(){
            let vm = this;
            let data = [];  //籤詩空陣列

            //執行抽籤
            axios.get(vm.url)
            .then(function (response) {
                //for外觀
                data = JSON.parse(response.request.responseText);
                let luckyNumber = Math.floor(Math.random()* data.length);  //產出幸運號碼

                //填入資料
                vm.drawList = `【 ${data[luckyNumber].drawList} 】`;
                vm.drawTitle = data[luckyNumber].drawTitle;
                vm.fate = data[luckyNumber].fate;   
                vm.drawName = `${vm.drawList}&emsp;${vm.drawTitle}&emsp;${vm.fate}`;
                //詩詞資料
                vm.poem = data[luckyNumber].poem.replace(/；/g,'<br>');
                //聖意
                let strA = data[luckyNumber].mean.slice(0,15) + '<br>';
                let strB = data[luckyNumber].mean.slice(16,31);
                let str = strA.concat(strB);
                vm.mean = str.replace(/。/g,'&emsp;');
                //釋義
                vm.explan = data[luckyNumber].explan.replace(/，/g,'&emsp;').replace(/。/g,'<br>');

            })
            .catch(function (error) {
              console.log(error);
            });

            //畫面更換
            vm.coverPage = false;
            vm.drawResult = true;

            //加入音效
            let drawRing = document.getElementById('drawRing');
            drawRing.play();

            //先顯示抽籤結果
            vm.drawEnd = true;
            vm.detail = false;

            //加上css動畫
            
            //動畫後延兩秒執行
            setTimeout(function(){
                vm.drawEnd = false;
                vm.detail = true;

            },5000)
            
        },
        //重新開始
        reStart(){
            //畫面復位
            this.drawResult = false;
            this.detail = false;
            this.coverPage = true;
            //按鈕css樣式復位
            //迴圈清除style
            for(i = 1;i<this.coverButtonText.length + 1; i++){
                $(`[data-num="${i}"]`).removeAttr('style');
            }
            //移除開始抽籤disabled
            $('#coverPage > div > button:last-child').attr('disabled','disabled');

        },
    },

})