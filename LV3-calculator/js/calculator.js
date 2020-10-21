var nn = new Vue({

    el:'#wrapper',
    data:{
        calc:$('#calc').text(),
        result:$('#result').text(),
    },
    watch:{
        calc:function(calc){
            //假如字串中含逗點，且不含e
            if(calc.includes('.') && !calc.includes('e') ){ 
                let array = [];
                array = calc.split('.');
                array[0] = array[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                calc = array[0] + '.' + array[1];
            }
            //假如字串中不含逗點，且不含e
            else if(!calc.includes('.') && !calc.includes('e') ){
                calc = calc.replace(/\B(?=(\d{3})+(?!\d))/g, ",");  //加上千分位符
            }
            
            //由字數判斷文字大小
            console.log(calc.length);
            if(calc.length <= 14){
                $('#calc').css("font-size","40px");
            } else if(calc.length <=18){
                $('#calc').css("font-size","30px");
            } else if(calc.length <=29){
                $('#calc').css("font-size","20px");
            } else if(calc.length <=58){
                $('#calc').css("font-size","10px");
            }

            $('#calc').text(calc);

        },
        result:function(result){
            $('#result').text(result);
        }



    },
    methods:{
        //數字鍵
        calcNum(obj){
            if( isNaN( parseInt(this.calc) ) && this.calc !=='' ){return}; //當數字欄不是數值，且不為空值時:return
            if(this.calc === '0'){
                this.calc = '';
            }
            this.calc += obj.target.innerText;
        },
        //操作鍵
        calcOperator(obj){
            let check = obj.target.innerText;
            //AC鍵(清空屏幕及記錄欄)
            if(check === 'AC'){
                this.calc = '0';
                this.result = '';
            }
            //CE鍵(屏幕字串字尾減去一)
            else if(check === 'CE'){
                if( isNaN( parseInt(this.calc) ) && this.calc !=='' ){return}; //當數字欄不是數值，且不為空值時:return
                if(this.calc.length > 1){
                    this.calc = this.calc.substr(0,[this.calc.length]-1); //刪去一個字元
                }else{
                    this.calc = '0';
                }
            }
            //00鍵
            else if(check === '00'){
                if( isNaN( parseInt(this.calc) ) && this.calc !=='' ){return}; //當數字欄不是數值，且不為空值時:return
                if(this.calc !== '0' && this.calc !==''){
                    this.calc += obj.target.innerText;
                }else{
                    this.calc ='0';
                }
            }
            //小數點鍵(檢查字串不包含小數點，若為空值時，則自動+0)
            else if(check === '.'){
                if( isNaN( parseInt(this.calc) ) && this.calc !=='' ){return}; //當數字欄不是數值，且不為空值時:return
                if(this.calc == ''){
                    this.calc += '0.';
                }
                else if(!this.calc.includes('.')){
                    this.calc += '.';
                }
            }
            //算術鍵(屏幕欄跳上記錄鍵)
            else{
                if( isNaN( parseInt(this.calc) ) && this.calc !=='' ){return}; //當數字欄不是數值，且不為空值時:return
                if(this.calc === ''){ //判斷屏幕欄鍵是否為空值，若為空值則替換算術符
                    this.result = this.result.substr(0,this.result.length-1);
                    this.result += check;
                    return
                }
                this.result += Number(this.calc) + check;
                this.calc = '';
            }
        },
        //相等鍵
        equal(){
            if(this.calc ==='0' && this.result ===''){return} //若畫面為初始值時，按等於無效
            //取代乘除字元為運算符
            this.result = this.result.replace(/×/g, "*").replace(/÷/g, "/");
            //假設屏幕欄為空值，則要從記錄欄尾部減去一字元
            if(this.calc ===''){
                this.result = this.result.substr(0,this.result.length-1); 
            }
            //假設屏幕欄不為空，則記錄欄與屏幕欄字串相加
            else if(this.calc !==''){
                this.result +=this.calc;
            }
            //執行math函式庫記算，記算結束後令記錄值為空
            this.calc = math.format( math.evaluate(this.result) , 14 ); //計算+使計算質精確
            this.calc = this.calc.toString();   //回歸回字串
            this.result = '';
        },
    },
});


//為按鈕增加點按事件(按住背景色變黑)
const operatorBtn = document.querySelectorAll('.row div');
for(var i=0;i<operatorBtn.length;i++){
    operatorBtn[i].addEventListener('mousedown',function(){
        this.style.backgroundColor = "black";
    })

    operatorBtn[i].addEventListener('mouseup',function(){
        this.style.backgroundColor = "";
    })

}
