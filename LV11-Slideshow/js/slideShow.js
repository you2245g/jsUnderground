//wrapper響應式
const wrapper = document.getElementById('wrapper').style;

wrapperResponsive();

$( window ).resize(function() {
    wrapperResponsive();
});

function wrapperResponsive(){

    let windowWidth = window.innerWidth;
    if(windowWidth >= 1920){
        wrapper.width = '1524px';
    } else if(windowWidth <= 1919 && windowWidth >= 1200 ){
        wrapper.width = '1160px';
    } else if(windowWidth <= 1199 && windowWidth >= 890){
        wrapper.width = '850px';
    } else if(windowWidth <= 889 && windowWidth >= 600){
        wrapper.width = '580px';
    } else if(windowWidth <= 599){
        wrapper.width = '375px';
    }
}

//點擊detailClose隱藏showDetail
const showDetail = document.querySelector('.showDetail');
$('.detailClose').click(function(){
    showDetail.classList.add('unUse');
});

//填入照片(json)

const url = 'https://api.unsplash.com/search/photos?query=fox&client_id=q0QEycOVluTKpslrq4QTbEcfC6ZLQltwCl3NFO-rcf4&per_page=21';
let photoStock = []; //json資料put in
let dataNum = 0;     //照片序列

axios.get(url).then(function (response) {

    //引入相片api
    photoStock = JSON.parse(response.request.responseText);

    //為每個圖填入照片
    let str = '';
    for(let i =0;i<photoStock.results.length;i++){
        str +=
            `
            <div class="displayPhoto" data-num=${i}>
                <img src="${photoStock.results[i].urls.regular}">
                <div>
                    <p>點我放大</p>
                </div>
            </div>
            `
    }  
    $('.pictureBlock').html(str);

    //點擊照片欄位顯示照片及資訊
    const displayPhoto = document.querySelectorAll('.displayPhoto');

    for(let i = 0;i<displayPhoto.length;i++){
        displayPhoto[i].addEventListener('click',function(obj){

            showDetail.classList.remove('unUse'); //顯示showDetail
            dataNum = obj.currentTarget.dataset.num; //取得data-set數值
            insertImg(dataNum);  //置入資料
        });
    }

    //nav導覽按鈕功能
    //左邊
    $('.fa-chevron-left').click(function(){
        dataNum--;
        if(dataNum < 0){
            dataNum = photoStock.results.length - 1;
        }
        insertImg(dataNum);
    });
    //右邊
    $('.fa-chevron-right').click(function(){
        dataNum++;
        if(dataNum > photoStock.results.length-1){
            dataNum = 0;
        }
        insertImg(dataNum);
    });

    //點擊後置入資料function
    function insertImg(dataNum){
        $('.picIndex').html(Number(dataNum)+1);
        $('.picTotal').html(displayPhoto.length);
        $('.picTitle').html(photoStock.results[dataNum].alt_description);
        $('.picAuthor').html('- '+ photoStock.results[dataNum].user.name + ' -');
        $('.picShow').attr("src", photoStock.results[dataNum].urls.regular);

        //燈箱照片響應式
        let img = new Image();
        img.src = photoStock.results[dataNum].urls.regular;
        //img.width(圖片寬度)/img.height(圖片高度)
        if(img.width > img.height){  //當寬度大於高度時(寬型照片)
            $('.picShow').css({"max-height":"rem(330px)","max-width":"100%"});
        } else if(img.width < img.height){ //當寬度小於高度時(長型照片)
            $('.picShow').css({"max-height":"rem(330px)","max-width":"330px"});
        }

    }



})
.catch(function (error) {
    console.log(error);
});