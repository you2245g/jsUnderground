let nn = new Vue({

    el:"#wrapper",
    data:{
        status:false,    　//日夜間模式狀態
        addStatus:true,  　//前後頁狀態
        isDataEdit:true, 　//編輯狀態
        displayRubbish:'', //展示幹話用
        addRubbish:'',     //添加幹話用(input)
        pictureTotal:5,    //相片總張數    
        //for Data
        rubbishData: JSON.parse(localStorage.getItem('Rubbish')) || [], //讀取localStorageItem
    },
    mounted(){
        this.randomDisplay();  //開啟隨機展示幹話
    },
    methods:{
        //Page關
        frontPageNone(){
            let vm = this;
            $('.mainPage').css('transform','translateX(-30vw)');
            $('.addPage').css('transform','translateX(0vw)');
            vm.addStatus = false;
        },
        //Page開
        frontPageShow(){
            let vm = this;
            $('.mainPage').css('transform','translateX(0vw)');
            $('.addPage').css('transform','translateX(30vw)');
            vm.addStatus = true;
        },
        //資料上傳鈕(使用nextTick())
        upDate(){
            let vm = this;
            if(vm.addRubbish === ""){return}
            vm.rubbishData.push(vm.addRubbish);
            vm.updateData();
            this.$nextTick(() => {
                vm.addRubbish = '';
                $('.inputBox').attr('placeholder','輸入已上傳');
            })
        },
        //資料刪除鈕
        deleteData(event){
            let key = event.target.dataset.num;
            let vm = this;
            vm.rubbishData.splice(key,1);
            if(vm.rubbishData == ""){
                localStorage.removeItem('Rubbish');
            }else{
                vm.updateData();
            }
        },
        //資料列編輯
        dataEdit(event){
            let vm = this;
            let key = event.target.dataset.num;
            vm.isDataEdit = !vm.isDataEdit;
            $('.updateBlock')[key].focus();
            if(vm.isDataEdit == true){
                vm.updateData();
            }
        },
        //隨機展示幹話
        randomDisplay(){
            let vm = this;
            if(vm.rubbishData == ""){return};
            let key = Math.floor(Math.random()* vm.rubbishData.length);  //產出隨機號碼
            vm.displayRubbish = vm.rubbishData[key].replace(/，/g,'，<br>');  //將隨機幹話顯示螢幕
        },
        //input框focus
        inputFocus(){
            $('.inputBox').attr('placeholder','請輸入詞語');
        },
        //資料上傳至localStroage
        updateData(){
            let vm = this;
            localStorage.setItem('Rubbish', JSON.stringify(vm.rubbishData) ); //上傳資料格式:"["XXXX","XXXXX"]"
        },
    },
    computed:{
        //隨機產生圖片(pictureTotal)
        randomBackground(){
            let vm = this;
            let random = Math.floor(Math.random()* vm.pictureTotal);
            return `background-image: url(img/pic${random + 1}.jpg)`
        },
    },
})