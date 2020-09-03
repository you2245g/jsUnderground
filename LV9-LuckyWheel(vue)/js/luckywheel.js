var nn = new Vue({
  el:'#wrapper',
  data: {
      //for外觀
      url:'./luckywheel2017.json', //設置初始url值
      award:'',        //印出得獎獎品 
      prizes:[],       //json資料放置
      deg:0,           //for角度計算
      innerObject:0,   //內容物件（分6面及20面）
      //for內部運算
      prizeNumber:[],  //獎號陣列
      prizeDegree:[],  //中獎角度陣列      
      chanceRemain:0,  //轉動次數

      startDegree:0,   //指針起始角度(預設為0)
      clicked:true,   //禁止再點按觸動
      isShow:false,    //顯示中獎畫面控制(加入css、取消及顯現prize面版)
    },
  mounted(){
    this.initPrize(this.url)  //初始資料建立
  },
  methods: {
    //引入JSON資料
    initPrize(url) {
      var vm = this  //重要!!!
      axios.get(url)
        .then(function (response) {
          //for外觀
          vm.prizes = JSON.parse(response.request.responseText) 
          vm.innerObject = vm.prizes.length     //動態產生內容物件數量(6 or 20)
          vm.fan(vm.innerObject)                //資料化外觀
          //for內部運算
          vm.prizeArray()                       //產生獎號陣列  
          vm.drawChance(vm.prizes)              //產生抽獎次數(20次及120次)
          vm.generatePrizeDegree()              //產生中獎角度陣列
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 
    //點擊更換資料
    clickYear(url){
      this.initPrize(url)
      this.url = url
    },
    //處理扇型
    fan(num){
      const wheelInner = document.querySelector('.wheelInner')
      let vm = this
      let str = ''
      vm.deg = 360 / num
      let tilt = vm.deg / 2
      //處理扇型(6面及20面)
      for(let i = 0;i<num;i++){
        str +=
              `
              <div class="wheelInnerSet" style="transform: rotate(${(vm.deg*i)-tilt}deg) skewY(${vm.deg - 90}deg);"></div>
              `
      }
      wheelInner.innerHTML = str;
    },
    //資料處理角度問題
    setDegree(key){
      let obj = `transform: rotate(${this.deg*key}deg)`
      return obj
    },

    //動態產生獎號陣列(prizeNumber//[0,1,2,3,4,5,6,....])
    prizeArray(){
      this.prizeNumber = []
      for(let i = 0 ;i <this.innerObject;i++){
        this.prizeNumber.push(i)
      } 
    },
    //處理中獎角度陣列([0,60,120,....])
    generatePrizeDegree(){
      this.prizeDegree = []
      for(var i = 0;i<this.innerObject;i++){
        let eachDeg = this.deg * i
        this.prizeDegree.push(eachDeg)
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

    //for旋轉功能
    //點擊旋轉
    rotatePrize(){
      let vm = this
      if(!vm.clicked){return}  //避免重覆點按
      //抽獎次數減一
      vm.chanceRemain --
      //確認執行
      vm.clicked = !vm.clicked
      //點擊關閉中獎畫面(含css添加後移除)
      vm.isShow = false
      const wheelInnerSet = document.querySelectorAll('.wheelInnerSet')
      const prizeSetInner = document.querySelectorAll('.prizeSetInner')
      for(i = 0; i <vm.innerObject;i++){
        wheelInnerSet[i].className = 'wheelInnerSet'
        prizeSetInner[i].className = 'prizeSetInner'
      }
      //執行旋轉功能
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
      //三秒後，獲獎顯示設定(css外觀變更，獎別顯示變更，獎品顯示品項減一)
      const wheelInnerSet = document.querySelectorAll('.wheelInnerSet')
      const prizeSetInner = document.querySelectorAll('.prizeSetInner')
      setTimeout(function(){
        wheelInnerSet[random].classList.add('active')
        prizeSetInner[random].classList.add('active2')
        vm.award = vm.prizes[random].name
        vm.prizes[random].amount --
        vm.isShow = true
        vm.clicked = true
      },3000)
      



    },


  },
});

