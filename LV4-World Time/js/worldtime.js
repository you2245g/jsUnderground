(function(){ //使用IIFE包函數

    let url = './worldTime.json';
    let data = [];  //json容器置入


    axios.get(url)
        .then(function (response) {
            data = JSON.parse(response.request.responseText)  //引入資料


            render();   //渲染資料
            runTime();  //印出時間
            //先執行一次，之後每秒執行一次
            setInterval(runTime,1000);

            //渲染資料
            function render(){

                data.forEach(function(item){

                    const table = document.getElementById('table');
                    var addDiv = document.createElement('div');
                    addDiv.className = 'showblock';
            
                    //於id="table"內動態產生html
                    addDiv.innerHTML = 
                    `
                    <div>
                        <h3>${item.showblock}</h3>
                        <h4></h4>
                    </div>
                    <div></div>
                    `
                    ;
                    table.appendChild(addDiv);    
                          
                });
            }
            //執行內部時間
            function runTime(){

                //宣告時間物件
                const date = new Date(); 
                //宣告options(給toLocaleString用)
                const options = { year: 'numeric',    //年份顯示數字
                                  month: 'short',     //月份使用簡寫
                                  day: 'numeric',     //日期使用數字
                                  hour: 'numeric',    //時間使用數字
                                  minute: 'numeric',  //分鐘使用數字
                                  second: 'numeric',  //秒鐘使用數字
                                  hour12: false       //使用24小時制顯示
                                }    
                
                
                //利用迴圈跑出各地時間
                data.forEach(function(item,index){
                    
                    // 產出各地格式時間 Aug 4, 2020, 10:57:11  
                    //date.toLocaleString('en-US', timeZone:'Europe/London', ...options)
                                       //('時間格式', 時區 , 選項)
                    const localTime = date.toLocaleString('en-US', { timeZone: item.Zone, ...options });
                    
                    //取出需要的字符
                    let str = localTime.replace(/,/g, '').split(' '); 
                    //由以上結果得出陣列["Aug", "4", "2020", "11:12:28"]
                    let year = str[2];                           //取出年份字[2]
                    let mon = str[0];                            //取出月份[0]
                    let day = str[1];                            //取出日期[1]
                    let time = str[3].substr(0,5);    //由0開始取出11:12字串
                    let hour = time.substr(0,2)   //由0開始取出11
    
                    //印出日期
                    const showDate = document.getElementsByTagName('h4');
                    showDate[index].innerText = day+' '+ mon +'. ' +year  ;
    
                    //印出時間
                    const showTime = document.querySelectorAll('#table div div:last-child');
                    showTime[index].innerHTML = time;
    
                    //判斷日夜(18:00-06:00間為黑色/06:00-18:00為白色)
                    const tablePan = document.querySelectorAll('.showblock');
                    
                    if(hour >= 6 && hour < 18){
                        tablePan[index].classList.add("bright");
                    } else {
                        tablePan[index].classList.add("dark");
                    }
                    
                });
            }
            
        })
        .catch(function (error) {
            console.log(error);
        });

})()

