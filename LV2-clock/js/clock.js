$(document).ready(function(){
    
    //時鐘UI介面
    let degree = 180; //刻度的旋轉角度
    let hours =0 //小時刻面字
    let timeDegree = 180;  //從180度開始(讓12刻面倒轉)

    for (let i = 0; i<72; i++) {   //增加0~71迴圈
        const unitPart = document.createElement('div'); // 創造刻度指令，用unitPart變數接
        unitPart.style.transform = `rotate(${degree}deg) translateY(145px)`;  //增加刻度，並給予旋轉css     
        
        if(i%6 === 0) {  //在時針上置入Span，刻面文字，及角度轉正
            unitPart.innerHTML =
            `<span style="transform:rotate(${ timeDegree }deg)">
            ${ i === 0 ? 12 : hours/6 }  
            </span>`;  
            timeDegree -= 30; //刻面數字角度，每次減30
        }
        
        hours++;  //累加小時
        degree += 5;  //累加五
        
        $('.scale').append(unitPart);  //累增加至.scale
    }

});

(function(){ //立即函式設置setInterval

    setInterval(function(){

        //建立時間函數
        const time = new Date();
        const sec = time.getSeconds();
        const min = time.getMinutes();
        const hour = time.getHours();

        //求得時間角度
        const secDegree = sec*6-180;               //每秒角度為6度，再減上180回到初始點
        const minDegree = min*6 + sec*6/60 - 180;  //每分角度為6度，受秒針影響所以要除60，減180回起始點
        const hourDegree = (hour*30 +min*30/60) - 180; //每小時角度為6度，受分針影響所以要除60，減180回起始點
        
        //時、分、秒針加入時間角度
        $('.secHand').attr('style','transform:rotate('+ secDegree + 'deg);');
        $('.minHand').attr('style','transform:rotate('+ minDegree + 'deg);');
        $('.hourHand').attr('style','transform:rotate('+ hourDegree + 'deg);');

    } , 100);  //自動設定時間為一秒

})();



