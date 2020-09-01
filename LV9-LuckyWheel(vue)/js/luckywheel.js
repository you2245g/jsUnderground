new Vue({
  el:'#wrapper',
  data: {
      prizes: [],
      wheel2018Url:'./luckywheel2018.json',
      wheel2017Url:'./luckywheel2017.json',
      url:'',
    },
  mounted() {
    this.url = this.wheel2017Url,
    this.initPrize(this.url)
  },
  computed:{


  },
  methods: {
    //引入Json資料
    initPrize(url) {
      var vm = this  //重要!!!
      axios.get(url)
        .then(function (response) {
          vm.prizes = JSON.parse(response.request.responseText)
          let deg = vm.prizes.length
          vm.fanInner(deg)
          vm.fanData(deg, vm.prizes)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //扇型處理(6面與12面)
    fanInner(num) {
      const wheelInner = document.querySelector('.wheelInner')
      let str = ''
      let deg = 360 / num
      let tilt = deg / 2
      for(let i = 0;i<num;i++){
        str +=
              `
              <div style="transform: rotate(${tilt-(deg*i)}deg) skewY(${deg - 90}deg);"></div>
              `
      }
      wheelInner.innerHTML = str;
    },
    //扇型內資料處理(分析2017與2018資料)
    fanData(num, data){
      const prizeSet = document.querySelector('.prizeSet')
      let str = ''
      let deg = 360 / num
      if(this.url === './luckywheel2017.json'){  //假設使用2017json時
        data.forEach(function(item,index){
            str +=
            `
            <div style="transform: rotate(${(deg*index)}deg);">
              <i class="material-icons">${item.icon}</i>
              <p>${item.name}</p>
              <div>${item.amount}</div>
            </div>
            `
        });
      }else if(this.url === './luckywheel2018.json'){  //假設使用2018json時
        data.forEach(function(item,index){
          str +=
          `
          <div style="transform: rotate(${(deg*index)}deg);">
            <span>${item.name}</span>
            <div>${item.amount}</div>
          </div>
          `
        });
      }
      prizeSet.innerHTML = str;
    },
  },

});

