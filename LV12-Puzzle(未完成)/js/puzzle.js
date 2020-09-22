var nn = new Vue({

    el:'#wrapper',
    data:{
        coverPage:true,
        playgroundPage:false,

        startX:0,    //紀錄X座標起始點
        startY:0,    //紀錄Y座標起始點
        onHold:0,        //被選擇的編號
        isInblock:true,  //判斷有無置入容器
        textShow:false,  //文字區塊顯示控制
        buttonText:'',   //主要按鈕文字
        buttonHidden:false, //嚮應式按鈕顯示
    },
    methods:{
        //遊戲開始按鈕
        gameStart(){
            this.coverPage = false
            this.playgroundPage = true
            //this.puzzlePosition()
            this.buttonText = '重新排列'
        },
        //產出puzzleUnit1~9的class
        puzzleUnit(val){
            return `puzzleUnit${val}`
        },
        //產出拼圖背景圖
        puzzleChip(val){
            return　`img/Puzzle-${val}.png`
        },
        //產生拼圖塊class
        forDrag(val){
            return `forDrag${val}`
        },
        //使拼圖塊產生對應的style
        outward(val){
            let img = new Image();
            img.src = `img/Puzzle-${val}.png`
            img.onload = function(){
                if(img.width>img.height){
                    document.querySelector(`.forDrag${val}`).style.height="100%"
                }else{
                    document.querySelector(`.forDrag${val}`).style.width="100%"
                }
            }
        },
        //使拼圖產生隨機位置
        puzzlePosition(){
            for(let i = 1;i<10;i++){
                var left = Math.floor(Math.random() * 600);
                var top = Math.floor(Math.random() * 400);
                document.querySelector(`.puzzleUnit${i}`).style.left =`${left}px`;
                document.querySelector(`.puzzleUnit${i}`).style.top =`${top}px`;
            }
        },
        //物件dragStart & dragEnd事件
        dragStart(obj){
            this.onHold = obj.target.className.charAt(7)  //獲取編號(forDragN)
            setTimeout(
                () => obj.target.className += ' invisible',0
            ); //被拖時立即不見
            this.isInblock = false
            
            startX = obj.clientX - document.querySelector(`.puzzleUnit${this.onHold}`).offsetLeft;
            startY = obj.clientY - document.querySelector(`.puzzleUnit${this.onHold}`).offsetTop;
            
        },
        dragEnd(obj){
            obj.target.classList.remove('invisible')
            //未置入容器時允許位移
            if(this.isInblock === true){return}
            if(this.isInblock ===false){
                document.querySelector(`.puzzleUnit${this.onHold}`).style.left = obj.clientX - startX + "px";
                document.querySelector(`.puzzleUnit${this.onHold}`).style.top = obj.clientY - startY + "px";
            }



        },
        //拼圖格drag事件
        dragEnter(obj){
            obj.target.className ='hoverd'
        },
        dragLeave(obj){
            obj.target.className =''
        },
        drop(obj){
            obj.target.className =''
            this.isInblock = true
            //使top與left歸零
            document.querySelector(`.puzzleUnit${this.onHold}`).style.left = "0px";
            document.querySelector(`.puzzleUnit${this.onHold}`).style.top = "0px";

            obj.target.append(`<img src="img/Puzzle-1.png" draggable="true" class="froDrag1" style="width:100%;">`);

        },
    },

});
