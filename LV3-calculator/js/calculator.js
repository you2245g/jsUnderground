//將資料顯示於ID=result(記錄畫面)
function result(){     //取得
    return document.getElementById('result').innerText;
}

function resultnum(num){   //印出
    document.getElementById('result').innerText = num;
}

//將資料顯示於ID=calc(屏幕畫面)
function calc(){     //取得
    return document.getElementById('calc').innerText;
}

function calcnum(num){   //印出

    if(num ==""){   //假設是字串
        document.getElementById('calc').innerText = num;   //則不用格式化數字

    }else{  //假設是字串以外
        document.getElementById('calc').innerText = 
        (function(num){

            //檢查值是否為負數，及尾數是否為小數點
            if(num=="-"){
            return "";
            }
            else if(num.includes('.')){
                return num;
            }else if(num.length ===12){
                return num = NaN;
            }
            else{  
                var num = Number(num);
            }
        //將字串加上數字點（每三個加一點）               //將字串轉為數字
        var value = num.toLocaleString("en");  //字串轉成local EN
        return value;  //返回value
        })(num);  //每個印出的數字資料都格式化
    }
}

//取代字串中逗號
function reverseFormatNum(num){ 

    if(num.includes('.')){
        return num.replace(/,/g,'');  //replace(/取代字符/全域(g).'替代字符');(確認數列有無逗號)
    }else{
        return Number(num.replace(/,/g,''));  //replace(/取代字符/全域(g).'替代字符');
    }
}


//計算機操作鈕迴圈，及增加監聽事件
const calcOperator = document.getElementsByClassName('calc-operator');  //取得calc-operator常數
for(var i=0;i<calcOperator.length;i++){
    calcOperator[i].addEventListener('click',function(){   //為每個calc-operator增加監聽事件

        if(this.innerText ==="AC"){  //清除鈕事件
            resultnum('');
            calcnum('0');
        }

        else if(this.innerText ==="CE"){  //刪除鈕事件
            var outPut = reverseFormatNum(calc()).toString();  //將取得屏幕字元格式化，轉換成字串
            if(outPut.length >1){    //假設outPut字數大於一
                outPut = outPut.substr(0,[outPut.length]-1); //刪去一個字元
                calcnum(outPut);
            }
            else{   //假設outPut字數小於1
                calcnum('0');
            }
        }

        else if(this.innerText ==='.'){    //小數點事件
            var outPut = reverseFormatNum(calc()).toString();
            if(!outPut.includes('.')){
                outPut += this.innerText;  
            }  //判斷計算器內有無小數點
            calcnum(outPut);
        }   
        
        else if(this.innerText ==='00'){   //00事件
            var outPut = reverseFormatNum(calc());
            if(!outPut =='0'){   //假設outPut數值不為0時
                outPut += this.innerText;
            }else if(outPut ===''){   //假設calc()為空字串時
                outPut += '0';
            }
            calcnum(outPut);
        } 

        else if(this.innerText ==="+" || this.innerText ==="-" ||
                this.innerText ==="×" || this.innerText ==="÷"  )  //判斷按鍵為加減乘除
        {
            var outPut = calc();       //取出屏幕值
            var resultPut = result();  //取出紀錄值   
            var math = this.id;        //取出算術符號值

            if(outPut=="" && resultPut !==""){    //假設屏幕值為空，且紀錄值不為空
                resultPut = resultPut.substr(0,resultPut.length-1);   //減去紀錄符號：避免重覆加運算符號
            }
            //檢查屏幕字尾有無小數點，有則自動減去
            else if(outPut.charAt([outPut.length]-1)== "."){
                outPut = outPut.substr(0,outPut.length-1);   //減去屏幕小數點
                resultPut += outPut;
            }
            //檢查屏幕字元是否無法讀取，有則無動作
            else if(outPut ==="NaN" || outPut ==="∞"){   //假設屏幕值為無限符號或NaN：按鈕無回應
                return false
            }
            else if(outPut !=="" || resultPut !==""){    //假設紀錄值不為空或紀錄不為空
                outPut = reverseFormatNum(outPut);  
                resultPut += outPut;   
            }

            resultPut += math;
            resultnum(resultPut);
            outPut ='';
            calcnum(outPut);
        }
        else{  //等號鍵事件

            //先指定變數，之後待運算
            var resultN = result();  
            //當紀錄尾數為運算符號之變數宣告
            var resultCheck = result().charAt([result().length]-1);  //取得字符
            var resultCheckG = resultCheck === "+" || resultCheck === "-" ||  resultCheck === "/" || resultCheck === "*";
            
            //執行檢查
            //1. 若字串尾有運算符號，且calc()為空值，去掉字串尾
            //2. 若字串為無限或NaN符號，則無反應
            //3. 其他狀態則紀錄字串與屏幕字串相加
            if(resultCheckG && calc()==''){   
                outPut = resultN.substr(0,[result().length]-1);  //紀錄字元減一
            } 
            else if(calc()==="∞" || calc()==="NaN" ){    //檢查calc()是否為無限及NaN字樣，是則返回false(無作用)
                return false;
            } else {
                var outPut = resultN + reverseFormatNum(calc());   //令紀錄與螢幕顯示字串相加
            }   
            //執行相加動作
            var resultEval = eval(outPut);    //相加後執行eval()函式
            //寫入資料
            document.getElementById('calc').innerText = resultEval.toLocaleString("en");
            //清空紀錄
            resultnum('');                      
        }
    })
}

//數字鍵按鈕
const clickNumber = document.getElementsByClassName('calc-num');  //取得clickNumber常數
for(var i=0;i<clickNumber.length;i++){
	clickNumber[i].addEventListener('click',function(){   //為每個clickNumber增加監聽事件
        var outPut = reverseFormatNum(calc());    
        if(outPut !==NaN){   //設使outPut是數字
            outPut += this.innerText;  //outPut累加數字
            calcnum(outPut);  //印出outPut
        }
    })
}

//為按鈕增加點按事件(按住背景色變黑)
const operatorBtn = document.querySelectorAll('.row div');
for(var i=0;i<operatorBtn.length;i++){
    operatorBtn[i].addEventListener('mousedown',function(){
        this.style.backgroundColor = "black";
    })

    operatorBtn[i].addEventListener('mouseup',function(){
        this.style.backgroundColor = "#930000";
    })

}


