//元件常數
const titlePage = document.getElementById('titlePage');
const playGround = document.getElementById('playGround'); 
const endPhase = document.getElementById('endPhase');
const btnStart = document.querySelector('.btnStart');      //開始遊戲按鈕事件監聽
const btnRestart = document.querySelector('.btnRestart');  //回到首頁

//倒數計時器列
var countTime = 60; //計算器為60秒
const setTime = document.querySelector('.setTime');     //取得倒數計時器文字

//keydown事件
const answerReply = document.querySelector('.answerReply');  //回答區
const score = document.querySelector('.score');  //計分
const finalScore = document.querySelector('.finalScore'); //顯示最後分數

//計算列常數(for printNumber())
const printNumber1 = document.querySelector('.printNumber1'); //運算第一數
const questionSign = document.querySelector('.questionSign'); //運算子
const printNumber2 = document.querySelector('.printNumber2'); //運算第二數
var answer = 0; //答案
var sign = '';  //符號


//首頁鍵點下
btnStart.addEventListener('click',function(){

    //設定點擊後，區塊顯現與消失
    titlePage.style.display = "none";
    playGround.style.display = "block";
    timeStart();    //執行倒數計時器
    printNumber();  //產出第一個問題

});

var scoreCount = 0; //設定初始為0分
//針對網頁元件作keydown事件
document.addEventListener('keydown',function(obj){

    if(obj.keyCode ===13 && answerReply.value !==''){

        //判斷答案對錯
        if(answerReply.value == answer){
            if(countTime >= 20){
                scoreCount++;  //加一分
            } else{
                scoreCount += 5; //20秒內答對加五分
            }
        } else {
            if(scoreCount !==0){
                scoreCount --;  //答錯扣一分
            }else{
                scoreCount -=0;  //答錯不倒扣
            }
        }

        //填入分數，清空答案列，以及換新題目
        score.innerText = scoreCount;
        answerReply.value = '';
        printNumber();  
    };
})

//回到首頁
btnRestart.addEventListener('click',function(){
    titlePage.style.display = "block";
    endPhase.style.display = "none";

    //歸零
    countTime = 60  //倒數計時器回歸60
    setTime.innerText = '01:00';  //計時器文字寫入

    scoreCount = 0; //分數歸0
    answer = 0;     //答案歸0
    score.innerText = 0;   //分數欄歸零
    finalScore.innerText = '';       //最終分數欄歸0
    answerReply.value = '';//答案欄清空
    //計時器css歸位
    setTime.style.color = "white";
    setTime.style.webkitTextStroke = "unset";
});

//倒數計時器
function timeStart(){

    var interval = setInterval(() => {
        countTime--;
        //倒數時間大於9時
        if(countTime > 9){
            setTime.innerText = '00:' +  countTime;
        //倒數時間小於9時
        } else if(countTime <= 9 && countTime >= 1){
            setTime.innerText = '00:0' + countTime;
            setTime.style.color = "red";
            setTime.style.webkitTextStroke = "2px yellow";

        //倒數時間為0時
        } else if(countTime === 0){
            setTime.innerText = '00:00';
            playGround.style.display = "none";
            endPhase.style.display = "block";
            finalScore.innerText = scoreCount; //顯示最後分數
            clearInterval(interval);    //計時器歸零
        }
    },1000);
}



//取得數字及計算結果
function printNumber(){
    var questionNumber1 ='';
    var questionNumber2 ='';

    //呈現三階段數字
    if(countTime >=40){
        questionNumber1 += randomNumber(10);
        questionNumber2 += randomNumber(10);

    } else if(countTime >= 20){
        questionNumber1 += randomNumber(100);
        questionNumber2 += randomNumber(100);
        if(questionNumber1.toString().length !==2 || questionNumber2.toString().length !==2){
            printNumber();
            return
        };  //確認是否為二位數

    } else if(countTime >= 0){
        questionNumber1 += randomNumber(1000);
        questionNumber2 += randomNumber(1000);
        if(questionNumber1.toString().length !==3 || questionNumber2.toString().length !==3){
            printNumber();
            return
        };  //確認是否為三位數
    }

    //令其為數字
    questionNumber1 = Number(questionNumber1);
    questionNumber2 = Number(questionNumber2);

    //判斷符號為加減乘除時
    //兩數相加
    if(gotSign() ==='+'){
        answer = questionNumber1 + questionNumber2;
        sign ='+';
    //減號時，判斷後數是否大於前數，否則將執行迴圈
    } else if(gotSign() ==='-'){
        if(questionNumber1 < questionNumber2){
            printNumber();
            return;
        } else{
            answer = questionNumber1 - questionNumber2; 
            sign ='-';
        }
    //兩數相乘
    } else if(gotSign() ==='x'){
        answer = questionNumber1 * questionNumber2;
        sign ='x';
    //兩數相除，後數不大於前數，且需除盡，否則將執行迴圈
    } else if(gotSign() ==='÷'){
        if(questionNumber1 < questionNumber2 || questionNumber1 % questionNumber2 != 0){
            printNumber();
            return;  
        } else {
            answer = questionNumber1 / questionNumber2;
            sign ='÷';
        }
    } else {
        printNumber();
        return;  
    }

    //印出成果
    printNumber1.innerText = questionNumber1;
    printNumber2.innerText = questionNumber2;
    questionSign.innerHTML = sign;  
}

//亂數生成數字
function randomNumber(obj){
    var i = Math.floor(Math.random() * obj);
    return String(i);
}

//取得計算符號
function gotSign(){
    var sign = ['+', '-', 'x', '÷'];
    return sign[randomNumber(4)];
}

