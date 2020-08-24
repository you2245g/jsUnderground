var circleArray = []; //圓圈回合
var crossArray = [];  //叉叉回合
var OXStatus = true; //true為圓圈回合、false為叉叉回合
var Oscore = localStorage.getItem('Oscore')*1;  //圈圈分數(取自暫存資料)
var Xscore = localStorage.getItem('Xscore')*1;  //叉叉分數(取自暫存資料)
const OXPlay = document.querySelectorAll('.OXPlay');  //圈叉欄位設置
//贏的八條線陣列(對照用)
const winnerArray = [//橫
                     [0,1,2],
                     [3,4,5],
                     [6,7,8],
                     //直
                     [0,3,6],
                     [1,4,7],
                     [2,5,8],
                     //交叉
                     [0,4,8],
                     [2,4,6],
                    ] ;

//遊戲開始鍵
$('.btnStart').click(function(){
    //變化封面
    $('#cover').addClass('hide');
    $('#playGround').removeClass('hide');
    //變化背景顏色
    $('body').css('backgroundColor','#ff6d70');
    //遊戲初始為圈圈的回合
    Oturn();
    //將暫存比數資料引入
    updateScore();
    //動態加入data-num
    for(var i = 0;i<OXPlay.length;i++){
        OXPlay[i].setAttribute("data-num",i);
    }
});

//遊戲Restart鍵
$('.btnRestart').click(function(){
    //顯示版顯示原位
    $('.OXBoard').removeClass('hide');
    $('.endPhase').addClass('hide');
    $('.OWIN').addClass('hide');
    $('.XWIN').addClass('hide');
    $('.drawGame').addClass('hide');
    //遊戲初始設定(記分板圈叉顯示初始，輪到圈的回合)
    Oturn();
    for(var i = 0;i<OXPlay.length;i++){
        OXPlay[i].innerHTML = '';
    }
    //遊戲內計算初始化
    circleArray = [];
    crossArray = [];
    OXStatus = true;
});


//OXPlay點按監聽
for(var i = 0; i<OXPlay.length;i++){
    //設置迴圈
    OXPlay[i].addEventListener('click',function(obj){
        var data = obj.target;

        var dataNum = data.dataset.num;    //取dataset值
        var check = data.innerHTML !== ''; //檢查內元素為空值

        if(check){return}
        if(OXStatus === true){  //當輪到圈的回合時
            //填入圈圈符號
            data.innerHTML = `<div class="OMark"><!----></div>`;
            //遊戲板外觀(for Xturn)
            Xturn();
            //置入資料
            circleArray.push(dataNum);
            //檢查獲勝條件
            checkWinner(circleArray);
        } else if(OXStatus === false){  //當輪到叉的回合時
            //填入叉叉符號
            data.innerHTML = `<div class="XMark"><!----></div>`;
            //遊戲板外觀(for Oturn)
            Oturn();
            //置入資料
            crossArray.push(dataNum);
            //檢查獲勝條件
            checkWinner(crossArray);
        }
        OXStatus = !OXStatus;  //每次點按翻轉true false
    }); 
}


//判斷勝負
function checkWinner(checkArray){

    //產生新陣列，並且升序排列
    var ascending = checkArray.map(val => parseInt(val)).sort();
    //迴圈檢查(檢查已產生true)
    for(i = 0;i<winnerArray.length;i++){
        //產生檢查值
        var check = ascending.includes(winnerArray[i][0]) && 
                    ascending.includes(winnerArray[i][1]) && 
                    ascending.includes(winnerArray[i][2]);

        
        //圈圈贏(OXStatus判斷回合)
        if(check && OXStatus === true){
            //顯示板，圈加一分
            $('.OXBoard').addClass('hide');
            $('.endPhase').removeClass('hide');
            $('.OWIN').removeClass('hide'); 
            //預防第九手顯示畫面
            $('.drawGame').addClass('hide');
            //加分並上傳
            Oscore+=1;
            updateScore();
            return
        }
        //叉叉贏(OXStatus判斷回合)
        else if(check && OXStatus === false){
            //顯示板，X加一分
            $('.OXBoard').addClass('hide');
            $('.endPhase').removeClass('hide');
            $('.XWIN').removeClass('hide');
            //加分並上傳
            Xscore+=1;
            updateScore();
            return
        }    
        //判斷第九手無勝負產生
        else if(circleArray.length + crossArray.length === 9){
            //顯示板，無計分
            $('.OXBoard').addClass('hide');
            $('.endPhase').removeClass('hide');
            $('.drawGame').removeClass('hide');
        }
        //將比數寫入本地暫存資料
        localStorage.setItem('Oscore', Oscore);
        localStorage.setItem('Xscore', Xscore);
    }
}

function updateScore(){
    $('.XScoreBoard').text(Xscore);
    $('.OScoreBoard').text(Oscore);
}

function Xturn(){
    //記分板OXsign
    //移除舊有
    $('.scroeBoard > div:eq(0)').removeClass('playOff');
    $('.scroeBoard > div:eq(4)').removeClass('playOn');
    //添加
    $('.scroeBoard > div:eq(0)').addClass('playOn');
    $('.scroeBoard > div:eq(4)').addClass('playOff');
    //Yourturn文字
    $('.notice > div:eq(1)').addClass('invisible');
    $('.notice > div:eq(0)').removeClass('invisible');
}

function Oturn(){
    //記分板OXsign
    //移除舊有    
    $('.scroeBoard > div:eq(0)').removeClass('playOn');
    $('.scroeBoard > div:eq(4)').removeClass('playOff');
    //添加
    $('.scroeBoard > div:eq(0)').addClass('playOff');
    $('.scroeBoard > div:eq(4)').addClass('playOn');
    //Yourturn文字
    $('.notice > div:eq(0)').addClass('invisible');
    $('.notice > div:eq(1)').removeClass('invisible');
}