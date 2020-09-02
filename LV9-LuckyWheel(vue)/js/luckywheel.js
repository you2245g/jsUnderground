new Vue({
  el:'#wrapper',
  data: {
      url:'', 
      prizes: [],      //json置放容器
      prizeNumber:[],  //獎號陣列
      prizeDegree:[],  //中獎角度陣列      
      innerObject:0,   //內容物件（分6面及20面）
      chanceRemain:0,  //轉動次數
      startDegree:0,   //指針起使角度(預設為0)
      clicked:false,   //禁止再點按觸動
      isShow:false,
    },
  mounted(){
    this.url = './luckywheel2017.json',
    this.initPrize(this.url)
  },
  methods: {
    //引入Json資料
    initPrize(url) {
      var vm = this  //重要!!!
      axios.get(url)
        .then(function (response) {
          vm.prizes = JSON.parse(response.request.responseText) //產生資料陣列
          vm.innerObject = vm.prizes.length                     //動態產生內容物件數量(6 or 20)
          vm.fanData(vm.innerObject, vm.prizes)                 //資料化外觀 & 產生獎項角度陣列
          vm.prizeArray()                                       //動態產生獎號陣列
          vm.drawChance(vm.prizes)                              //定義轉動次數(20次及120次)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //處理扇型資料
    fanData(num, data){
      const prizeSet = document.querySelector('.prizeSet')
      const wheelInner = document.querySelector('.wheelInner')
      let vm = this
      let str = ''
      let strFan = ''
      let deg = 360 / num
      let tilt = deg / 2
      //處理扇型(6面及20面)
      for(let i = 0;i<num;i++){
        strFan +=
              `
              <div class="wheelInnerSet" style="transform: rotate(${(deg*i)-tilt}deg) skewY(${deg - 90}deg);"></div>
              `
            
      }
      wheelInner.innerHTML = strFan;
      //扇型內資料處理(分析2017與2018資料)
      if(num === 6){  //假設使用2017json時
        data.forEach(function(item,index){
            str +=
            `
            <div class="prizeSetInner" style="transform: rotate(${(deg*index)}deg);">
              <i class="material-icons">${item.icon}</i>
              <p>${item.name}</p>
              <div>${item.amount}</div>
            </div>
            `
        });
      }else if(num === 20){  //假設使用2018json時
        data.forEach(function(item,index){
          str +=
          `
          <div class="prizeSetInner" style="transform: rotate(${(deg*index)}deg);">
            <span>${item.name}</span>
            <div>${item.amount}</div>
          </div>
          `
        });
      }
      prizeSet.innerHTML = str;
      vm.generatePrizeDegree(deg, num) //產生角度陣列
    },
    //動態產生獎號陣列(prizeNumber//[0,1,2,3,4,5,6,....])
    prizeArray(){
      for(let i = 0 ;i <this.innerObject;i++){
        this.prizeNumber.push(i)
      } 
    },
    //動態產生抽獎次數(20次及120次)
    drawChance(data){
      let array =[]
      //產生陣列
      data.forEach(function(item){
        array.push(item.amount)
      })
      //陣列相加
      this.chanceRemain = array.reduce((a,b)=>a+b) 
    },
    //處理中獎角度陣列([0,60,120,....])
    generatePrizeDegree(deg, num){
      if(this.prizeDegree !==[]){
        this.prizeDegree = []
      }
      for(var i = 0;i<num;i++){
        let eachDeg = deg * i
        this.prizeDegree.push(eachDeg)
      }
    },
    //點擊旋轉
    rotatePrize(){
      let vm = this 
      //確認執行
      //vm.clicked = !vm.clicked
      //抽獎次數減一
      //vm.chanceRemain --
      vm.checkPrize()



    },
    //確認獎項及印出
    checkPrize(){
      let vm = this
      if(vm.clicked){return} //禁止抽獎是被再次點按
      //旋轉控制(產生隨機數+指定角度)
      //產生由零開始的隨機數字 
      let random = Math.floor(Math.random()* vm.innerObject)
      //由起始角度旋轉四圈+中獎度數+指針本身偏移-起始角度除360得餘數
      let degree = vm.startDegree + 1440 + vm.prizeDegree[random]+ 190 - vm.startDegree % 360
      //下次旋轉由該角度開始
      vm.startDegree = degree
      //加上旋轉角度
      const pointer = document.querySelector('.pointer')
      pointer.style.transform = `rotate(${degree}deg) `



      //旋轉到的部份，加上active css
      const wheelInnerSet = document.querySelectorAll('.wheelInnerSet')
      const prizeSetInner = document.querySelectorAll('.prizeSetInner')
      setTimeout(function(){
        wheelInnerSet[random].classList.add('active')
        prizeSetInner[random].classList.add('active2')
        vm.isShow = true
      },3000)

      //產生獎別



    },


  },
});

