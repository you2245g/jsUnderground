var data = [];
var url = "http://opendata2.epa.gov.tw/AQI.json";

//處理json資料
axios.get(url).then(function(response){
    data = response.data;
    
    //將縣市資料input至Select中，執行forEach迴圈
    var countyArray = [];   //將縣市資料取出，暫存陣列
    var publishArray = [];  //將更新資料取出，暫存陣列
    allData = [...data]; //複製陣列

    //利用新陣列取得 countyArray(縣市)/publishArray(更新時間)
    allData.forEach(function(item){
        countyArray.push(item.County);
        publishArray.push(item.PublishTime);
    });

    //使用filter函式篩選縣市，得出countyTrue執行立即迴圈，並寫入countySelect裡
    const countySelect = document.querySelector('.countySelect');
    (function(){
        let countyTrue = countyArray.filter((item, key, array) => {
            return array.indexOf(item) === key;   //過濾取出22個縣市陣列
        });
        var str = '';
        str +='<option value="">請選擇縣市</option>';
        countyTrue.forEach(function(item){
            str +=
            `
            <option value="${item}">${item}</option>
            `
            ;
        });
        countySelect.innerHTML = str;
    })();

    //判斷顏色函式
    function getColor(num) {
        if(num <= 50){
            return 'airLV1';
         }else if(num >= 51 && num <= 100){
            return 'airLV2';
         }else if(num >= 101 && num <= 150){
            return 'airLV3';
         }else if(num >= 151 && num <= 200){
            return 'airLV4';
         }else if(num >= 201 && num <= 300){
            return 'airLV5';
         }else if(num >= 301){
            return 'airLV6';
         }else{
             return 'noAQIData';
         }
    }

    //製作縣市區域、更新時間區塊、選擇區域區塊
    const thisCounty = document.querySelector('.thisCounty');         //選擇區域
    const upDateTime = document.querySelector('.upDateTime');         //更新時間display
    const displayData = document.querySelector('.displayData');       //區域版
    const districtSelect = document.querySelector('.districtSelect'); //區域選單用  

    function dataList(county){

        //將所有資料跑forEach迴圈
        var str ='';        //顯示板用
        var strSelect = ''; //選單用
        strSelect +=`<option>請選擇區域</option>`;
        allData.forEach(function(item,index){
             if(item.County === county){
                showData(index);
                //寫入資料
                 thisCounty.innerText = county;
                 upDateTime.innerText = publishArray[index] + '更新';   
                 //增加選單資料
                 strSelect +=`<option value="${index}">${item.SiteName}</option>`;

                 //判斷AQI是否為空值
                 if(item.AQI !==''){  //假使AQI不為空字串的話
                    str +=  
                    `
                    <div> 
                        <p class="siteHover" data-num="${index}" >${item.SiteName}</p> 
                        <p class="${getColor(item.AQI)}">${item.AQI}</p>
                    </div>
                    `
                    ;//增加字串  data-num=""可以指定數字
                 } else{   //不能正常顯示AQI時
                    str +=  
                    `
                    <div> 
                        <p class="siteHover">${item.SiteName}</p>
                        <p style="color:red">無數值</p>
                    </div>
                    `
                    ;//增加字串
                 }
             }
             displayData.innerHTML = str; //寫入資料
             districtSelect.innerHTML = strSelect;
        });
    } //dataList函式結束


    //已選擇區域
    const thisDistrict = document.querySelector('.thisDistrict');     //己選擇縣市
    const thisAQI = document.querySelector('.thisAQI');               //己選擇AQI

    //顯示左側欄
    function showData(num){
        var aqiData = allData[num];
        if(aqiData.AQI ==''){aqiData.AQI = '無數值';}
        thisDistrict.innerText = aqiData.SiteName;   //寫入城市名
        thisAQI.innerText = aqiData.AQI;             //寫入AQI數值
        thisAQI.classList = 'thisAQI ' + getColor(aqiData.AQI) ;    //加入顏色判別(注意thisAQI後面要空格)
        //寫入AQI詳細內容
        const allAQI = document.querySelectorAll('.allAQI');        //全選allAQI
        const cardBorad = ['O3','PM10','PM2.5','CO','SO2','NO2'];   //製作陣列
        //迴圈撰寫
        for(var i = 0;i<cardBorad.length;i++){
            if(aqiData[cardBorad[i]] ==''){aqiData[cardBorad[i]] = '-'}
            allAQI[i].innerText = aqiData[cardBorad[i]];
        };
    }

    dataList('基隆市');  //呼叫渲染，起始為基隆

    //為countySelect增加change的監聽事件
    countySelect.addEventListener('change',function(obj){   
        
        if(obj.target.value ===''){
            return
        }
        //假使optionValue為請選擇縣市則return
        dataList(obj.target.value);  //觸發dataList()渲染畫面

    },false);

    //為顯示板增加click監聽事件
    displayData.addEventListener('click',function(obj){
        showData(obj.target.dataset.num);
    });

    //為子選單增加change監聽事件
    districtSelect.addEventListener('change',function(obj){
        showData(obj.target.value);  
    });

});
