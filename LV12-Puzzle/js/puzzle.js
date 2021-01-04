let nn = new Vue({
    el:'#wrapper',
    data:{
        coverPage:true,
        playgroundPage:true,
        gameStatus:'打散拼圖',
        titleStatus:"請完成這幅《清明上河圖》",
        piece:9, //拼圖共有九片
        screenWidth:0,  //視窗寬度尺寸(用於監聽)
        imgWidth:[],
        imgHeight:[],
        widthMulti:0,
        //drag功能
        dragStatus:"",   //最後選取狀態(判斷有無進入容器)
        nowSelect:0,     //選取值
        dragContainer:0, //指定容器值
        dragNode:null,   //被drag的節點
        //獲勝後要執行
        articleShow: false,
        //執行動畫(article)
        article:null,
    },
    mounted(){
        this.screenWidth = window.innerWidth;
        window.onresize = () => { this.screenWidth = window.innerWidth };
    },
    watch:{  //監聽視窗尺寸，動態取得圖片大小及尺寸
        screenWidth:function(value){
            let multi = 0;  //乘數
            let task = [];
            //判斷取得乘積
            if(value <= 767){ 
                multi = 0.592555;
                this.widthMulti = value - 123;
            }
            else if( value >=768 && value < 1024 ){ 
                multi = 0.666666;
                this.widthMulti = value - 170;
            }
            else{ 
                multi = 0.9258888;
                this.widthMulti = value - 217;
            }
            //取得照片寬及高度
            for(let i=1 ; i<=this.piece ; i++){
                task.push(
                    new Promise((resolve, reject) => {
                        let img = new Image();
                        img.src = `img/Puzzle-${i}.png`;
                        img.onload = function(){ resolve({width:this.width * multi, height:this.height * multi}) } //promise物件取得正確長寬
                        img.onerror = function(e){ reject(e.type) }
                    })
                )
            }
            //將資料回傳至data
            Promise.all(task).then(result =>{
                for(let i = 0; i<result.length ; i++){
                    this.imgWidth.push(result[i].width);
                    this.imgHeight.push(result[i].height);
                }
            });
        },
    },
    methods:{
        gameStart(){  //遊戲開始(顯示頁面，打散拼圖)
            let vm = this;
            vm.coverPage = false;
            setTimeout(function(){ vm.randomPuzzle() }, 0);
        },
        resetBtn(){  //遊戲結束按鈕
            let vm = this;
            if(vm.gameStatus ==='打散拼圖'){vm.randomPuzzle()}
            if(vm.gameStatus === '重新開始'){
                vm.coverPage = true;
                vm.articleShow = false;
                vm.titleStatus = "請完成這幅《清明上河圖》";
            }  //狀態為重新開始時回歸封面
        },
        //打散拼圖函式
        randomPuzzle(){
            let vm = this;
            for(let i = 1;i<10;i++){
                var left = Math.floor(Math.random() * vm.widthMulti);  //寬度乘數
                var top = Math.floor(Math.random() * 400);   //高度乘數
                $(`.puzzleUnit${i}`).css({
                    "left":`${left}px`,"top":`${top}px`
                });
            }
        },
        //拼圖拖拉
        dragStart(event){
            let vm = this;
            vm.dragStatus = "";
            vm.nowSelect = event.target.parentNode.dataset.num;
            //隱藏元件
            setTimeout( () => $(`.puzzleUnit${vm.nowSelect}`).addClass('invisible'),0);
            //定義位置(fordrop實現)
            let style = window.getComputedStyle(event.target.parentNode, null);  
            //現有父元素位置 減 點下滑鼠位置
            event.dataTransfer.setData("text/plain",
            (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
            vm.dragNode = event.target.parentNode;
        },
        dragenter(event){
            let vm = this;
            event.target.className += " hover";
            vm.dragContainer = event.target.dataset.num;
        },
        dragleave(event){ event.target.className = "block" },
        dragEnd(){
            let vm = this;
            $(`.puzzleUnit${vm.nowSelect}`).removeClass('invisible');
            vm.dragStatus = $(`.block[data-num="${vm.dragContainer}"]`).attr("class");
            $(`.block[data-num="${vm.dragContainer}"]`).attr("class","block");
        },
        //判斷拼圖塊歸於何處
        drop(event){
            let vm = this;
            //求得座標，定義位置
            let offset = event.dataTransfer.getData("text/plain").split(','); 
            //判斷是否置入容器 
            setTimeout(function(){
                if (vm.dragStatus == "block hover") {  //置入容器
                    vm.dragNode.removeAttribute("style");
                    event.target.appendChild(vm.dragNode);
                }else{   // 任意位置
                    $(`.puzzleUnit${vm.nowSelect}`).css({ 
                        "left": event.clientX + parseInt(offset[0],10) + 'px', 
                        "top": event.clientY + parseInt(offset[1],10)  + 'px'
                    });
                    document.querySelector('.playground').appendChild(vm.dragNode);
                }
            }, 0)
            setTimeout( () => vm.checkWin(),1 );  //檢查獲勝條件
        },
        checkWin(){
            let vm = this;
            let check = 0;  //每次觸發讓check = 0
            for(let i = 1 ; i<= vm.piece ; i++){
                if( $(`.block[data-num='${i}']`).children().attr("class") == undefined){ return }
                if( $(`.block[data-num='${i}']`).children().attr("class").slice(-1) == i){ check += 1 }
            }
            if(check === 9 ){ //當check等於9時，則彈出獲勝資訊
                vm.articleShow = true;
                vm.article = true;
                vm.gameStatus = "重新開始";
                vm.titleStatus = "恭喜完成《清明上河圖》";
                for(let i = 1;i<=vm.piece;i++){
                    $(`.puzzleUnit${i}`).attr("draggable","false");
                }
            }
        },
        //結束按鈕判斷
        btnMouseOver(){
            let vm = this;
            if(vm.articleShow == false){return}
            vm.article = false;
            vm.gameStatus = '重新開始';
        },
        btnMouseout(){
            let vm = this;
            if(vm.articleShow == false){return}
            vm.article = true;
            vm.gameStatus = '顯示圖片';
        },
        //每片拼圖css
        puzzleUnit(val){ return `puzzleUnit${val}` },
        //產出拼圖背景圖
        puzzleChip(val){ return　`img/Puzzle-${val}.png` },
        //拼圖外觀
        widthSet(val){ let vm = this; return ` ${vm.imgWidth[val - 1]}px ` },
        heightSet(val){ let vm = this; return ` ${vm.imgHeight[val - 1]}px ` }
    },
});