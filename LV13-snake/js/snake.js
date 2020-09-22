
var nn = new Vue({
    el:'#wrapper',
    data:{
        gameStarter:true,  //開始遊戲true
        gameRunning:false, //遊戲中false
        endPhase:false,    //遊戲結束階段false
        Score:0,           //分數
        bestScore:localStorage.getItem('bestScore')*1,  //取自本地最佳分數
        gameState:'',   //遊戲狀態（設定為空）
        //時間控制
        currentTime:0,  //現在時間
        timeStep:5,     //時間間距
        frameStep:150,  //
        //座標控制
        xAxis:22,    //X座標軸
        yAxis:10,    //y座標軸
        availablePixel:[],  //可用畫素陣列
        currentFood:[],     //食物座標
        //蛇身體物件
        snake:{
            direction:'',
            bodyPixel:[], //蛇身體由陣列組成
        },
    },
    mounted(){
        $('#wrapper').focus();   //提供封面tab畫面
        this.gamePlace();        //初始化座標系統
    },
    methods:{
        //座標系統製作
        gamePlace(){
            for(let y = 1;y<=this.yAxis;y++){
                for(let x = 1;x<=this.xAxis;x++){
                    let str = $(`<div data-coor="${x}-${y}"></div>`)
                    $('.pixel').append(str)     //加入座標系統
                }
            }
        },
        //所有key控制
        keyControl(obj){
            let vm = this;
            let code = obj.keyCode;
            //空白鍵啟動遊戲(gameStarter)
            if(code === 32 && vm.gameStarter){
                vm.gameStart();
            }
            //遊戲畫面鍵盤蛇頭控制(上下左右鍵)
            //上鍵(gameRunning)
            else if(code === 38 && vm.gameRunning){
                if(this.snake.direction ==='down' || this.snake.direction ==='up'){return}; //當蛇往下走時，按此鍵無效
                this.snake.direction = 'up';
            }
            //下鍵(gameRunning)
            else if(code ===40 && vm.gameRunning){
                if(this.snake.direction ==='up' || this.snake.direction ==='down'){return}; //當蛇往上走時，按此鍵無效
                this.snake.direction = 'down';
            }
            //左鍵(gameRunning)
            else if(code === 37 && vm.gameRunning){
                if(this.snake.direction ==='right' || this.snake.direction ==='left'){return}; //當蛇往右走時，按此鍵無效
                this.snake.direction = 'left';
            }
            //右鍵(gameRunning)
            else if(code === 39 && vm.gameRunning){
                if(this.snake.direction ==='left' || this.snake.direction ==='right'){return}; //當蛇往左走時，按此鍵無效
                this.snake.direction = 'right';
            }
            //遊戲結束鍵盤控制(X與Y鍵)
            //Y鍵(再進行遊戲)
            else if(code === 89 && vm.endPhase){
                vm.gameStart()   //啟動遊戲
            }
            //N鍵(回首頁)
            else if(code === 78 && vm.endPhase){  
                vm.gameStarter = true
                vm.endPhase = false
            }
        },
        //開始遊戲切換畫面(按空白鍵)
        gameStart(){
            let vm = this;
            //畫面變動
            vm.gameStarter = false;
            vm.gameRunning = true;
            //開始遊戲內容
            vm.initGame();      //遊戲開始
            vm.startMainLoop(); //遊戲記時器
        },
        //遊戲開始
        initGame(){
            let vm = this
            //清空畫面及填充可用陣列
            for(let y = 1;y<=vm.yAxis;y++){
                for(let x = 1;x<=vm.xAxis;x++){
                    //移除所有的attr
                    $(`[data-coor="${x}-${y}"]`).removeAttr('class')
                    $(`[data-coor="${x}-${y}"]`).removeAttr('style') 
                    $(`[data-coor="${x}-${y}"]`).empty()
                    vm.availablePixel.push(`${x}-${y}`)
                }
            }       
            //計分版分數歸零
            vm.Score = 0 
            //蛇狀態預還原
            vm.snake.direction = 'up' 
            vm.snake.bodyPixel = []  
            //蛇初始座標
            vm.snakeLocating(7,8)  //(x,y)座標系統
            vm.snake.bodyPixel.push([7, 8])

            //初始化食物
            vm.ramdonFood() 

        },
        //遊戲記時器(每隔一段時間就將現在時間加上時間間距)
        startMainLoop(){
            let vm = this
            let gameInterval = setInterval(function(){
                vm.currentTime += vm.timeStep
                //遊戲加快機制
                if(vm.currentTime >= vm.frameStep){
                    vm.currentTime %= vm.frameStep

                    vm.snakeMove()  //執行移動

                    if(vm.gameState === ''){return} //如果蛇正常移動，則return
                    //遊戲畫面控制及資訊歸零
                    clearInterval(gameInterval)  //取消計時器

                    //設定1.5秒後執行
                    setTimeout(function(){
                        vm.gameState = ''         //將gameState還原
                        vm.availablePixel = []    //清空可用畫素      
                        vm.gameRunning = false    //遊戲畫面關閉
                        vm.endPhase = true        //進入遊戲結束畫面
                        vm.frameStep = 150        //時間回到初始值
                        //判斷bestScore是否留存記錄
                        if(vm.bestScore > vm.Score){return}
                        vm.bestScore = vm.Score
                        localStorage.setItem('bestScore', vm.bestScore)
                    }, 1500)

                }
            },vm.timeStep)
        },
        //蛇位置(成功與否回傳布林值)
        snakeLocating(x,y){
            let str = `${x}-${y}`
            let indexOf = this.availablePixel.indexOf(str)   //檢查可用像素索引值

            if(indexOf !== -1){  
                this.availablePixel.splice(indexOf,1)         //從可用的畫素中刪除

                let addTaken = $('<div class="taken"></div>')
                $(`[data-coor="${str}"]`).append(addTaken)  //選擇指定畫素填入(div)

                return true   //抓畫素成功
            }else {    
                return false  //抓畫素失敗
            }
        },
        //食物位置隨機出現(成功與否回傳布林值)
        ramdonFood(){
            let vm = this
            if(vm.availablePixel ===0){return false}  //當可用畫素等於0時，回報false
            var indexOf = Math.floor(Math.random()*vm.availablePixel.length) //從可用pixel隨機取得索引

            vm.currentFood = vm.availablePixel.splice(indexOf,1)[0].split('-')            //取得currentFood的x及y值
            //轉成數值
            let currentX = parseInt(vm.currentFood[0])
            let currentY = parseInt(vm.currentFood[1])

            $(`[data-coor="${currentX}-${currentY}"]`).addClass('food') //選擇指定畫素填入食物

            //Y軸十字座標線
            for(i = 1;i<11;i++){
                $(`[data-coor="${currentX - i}-${currentY}"]`).css('background-color', `rgba(255,255,255,${0.3 / i})`)
                $(`[data-coor="${currentX + i}-${currentY}"]`).css('background-color', `rgba(255,255,255,${0.3 / i})`)
            }
            //X軸十字座標線
            for(i = 1;i<5;i++){
                $(`[data-coor="${currentX}-${currentY - i}"]`).css('background-color', `rgba(255,255,255,${0.3 / i})`)
                $(`[data-coor="${currentX}-${currentY + i}"]`).css('background-color', `rgba(255,255,255,${0.3 / i})`)
            }

            return true
        },
        //判斷蛇頭碰到食物或碰壁(判斷輸贏)
        snakeMove(){  
            let vm = this

            let head = vm.snake.bodyPixel[vm.snake.bodyPixel.length - 1]  //蛇頭為陣列尾
            let nextHead = []   //蛇的下一個頭(由方向控制)

            //控制蛇移動的上下左右
            if(vm.snake.direction === 'up'){
                nextHead.push(head[0],head[1] - 1)
            }else if(vm.snake.direction ==='down'){
                nextHead.push(head[0],head[1] + 1)
            }else if(vm.snake.direction === 'left'){
                nextHead.push(head[0] - 1,head[1])
            }else if(vm.snake.direction ==='right'){
                nextHead.push(head[0] + 1,head[1])
            }

            //蛇頭與食物座標疊合時
            if(nextHead[0] == vm.currentFood[0] && nextHead[1] == vm.currentFood[1]){
                //將新頭塞進座標
                vm.snake.bodyPixel.push(nextHead)   
                //蛇頭外觀改變
                $(`[data-coor="${nextHead[0]}-${nextHead[1]}"]`).removeClass('food')

                let addTaken = $('<div class="taken"></div>')
                $(`[data-coor="${nextHead[0]}-${nextHead[1]}"]`).append(addTaken)

                //加上分數
                vm.Score ++
                //迴圈清理背景(style)
                for(let y = 1;y<=vm.yAxis;y++){
                    for(let x = 1;x<=vm.xAxis;x++){
                        //移除所有的style
                        $(`[data-coor="${x}-${y}"]`).removeAttr('style') 
                    }
                } 

                //加上beep音效
                let beep = document.getElementById('beep')
                beep.play()

                vm.adjustSpeed(vm.Score)  //隨時檢查分數，調整速度
                
                if(!vm.ramdonFood()){
                    vm.gameState = 'aceMove' //當場內無可用座標時，則獲勝
                }
            //若蛇頭正常行進時(需正常釋放畫素)
            }else if(vm.snakeLocating(nextHead[0],nextHead[1])){
                vm.snake.bodyPixel.push(nextHead)

                let tail = vm.snake.bodyPixel.splice(0,1)[0]
                vm.releasePixel(tail[0],tail[1])
                $(`[data-coor="${tail[0]}-${tail[1]}"]`).empty()  //尾端釋放div
                $(`[data-coor="${tail[0]}-${tail[1]}"] > div`).removeAttr('style')


            //其他狀態(輸的回合)
            } else{
                //如果X0軸撞牆
                if(nextHead[0]<=0){  
                    $(`[data-coor="${nextHead[0] + 1}-${nextHead[1]}"] > div`).css('background-color','red')
                } 
                //如果X22軸撞牆
                else if(nextHead[0]>= vm.xAxis){
                    $(`[data-coor="${nextHead[0] - 1}-${nextHead[1]}"]  > div`).css('background-color','red')
                }
                //如果Y0軸撞牆
                else if(nextHead[1]<=0){
                    $(`[data-coor="${nextHead[0]}-${nextHead[1] + 1}"]  > div`).css('background-color','red')
                }
                //如果Y22軸撞牆
                else if(nextHead[1]>= vm.yAxis){
                    $(`[data-coor="${nextHead[0]}-${nextHead[1] - 1}"]  > div`).css('background-color','red')
                }
                //其他狀況:ex撞到身體
                $(`[data-coor="${nextHead[0]}-${nextHead[1]}"]  > div`).css('background-color','red')
                //播放gameOver音效
                let gameOverMusic = document.getElementById('gameOverMusic')
                gameOverMusic.play()
                //回傳badMove(遊戲結束)
                vm.gameState = 'badMove'
            }

        },
        //時間速度(由蛇身體判斷時間加速)
        adjustSpeed(length){
            if(length >= 40){
                this.frameStep = 50
            }else if(length >= 30){
                this.frameStep = 75
            }else if(length >= 20){
                this.frameStep >= 100
            }else if(length >= 10){
                this.frameStep = 125
            }
        },
        //移除被釋放的像素
        releasePixel(x,y){
            let vm = this
            $(`[data-coor="${x}-${y}"]`).removeClass('taken') //移除蛇身體外觀
            $(`[data-coor="${x}-${y}"]`).removeClass('food')  //移除食物外觀
            vm.availablePixel.push(`${x}-${y}`)   //將被釋放的畫素加回可用畫素
        },



    },
})
