//wrapper響應式
const wrapper = document.getElementById('wrapper').style;

wrapperResponsive();
window.addEventListener('resize',function(){
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
const detailClose = document.querySelector('.detailClose');
const showDetail = document.querySelector('.showDetail');
detailClose.addEventListener('click',function(){
    showDetail.classList.add('unUse');
})

//填入照片(json)
const url = 'https://api.unsplash.com/search/photos?query=fox&client_id=q0QEycOVluTKpslrq4QTbEcfC6ZLQltwCl3NFO-rcf4&per_page=20';
let photoStock = [];

axios.get(url).then(function (response) {
    //引入相片api
    photoStock = JSON.parse(response.request.responseText);

    //為每個圖填入照片
    let str = '';
    const pictureBlock = document.querySelector('.pictureBlock');
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
    pictureBlock.innerHTML = str;

    //點擊照片欄位顯示照片及資訊
    const displayPhoto = document.querySelectorAll('.displayPhoto');
    const picIndex = document.querySelector('.picIndex');
    const picTotal = document.querySelector('.picTotal');
    const picTitle = document.querySelector('.picTitle');
    const picAuthor = document.querySelector('.picAuthor');
    const picShow = document.querySelector('.picShow');

    for(let i = 0;i<displayPhoto.length;i++){
        displayPhoto[i].addEventListener('click',function(obj){

            showDetail.classList.remove('unUse'); //顯示showDetail
            var dataNum = obj.currentTarget.dataset.num; //取得data-set數值

            //點擊後置入資料
            picIndex.innerHTML = Number(dataNum)+1 ;
            picTotal.innerHTML = displayPhoto.length;
            picTitle.innerHTML = photoStock.results[dataNum].alt_description;
            picAuthor.innerHTML = '- '+ photoStock.results[dataNum].user.name + ' -';
            picShow.setAttribute("src", photoStock.results[dataNum].urls.regular)
        });
    }


    //nav導覽按鈕功能
    const navLeft = document.querySelector('.fa-chevron-left') ;
    const navRight = document.querySelector('.fa-chevron-right') ;

    navLeft.addEventListener('click',function(){
        alert("ddd");
    });


    navRight.addEventListener('click',function(){
        alert("aaa");
    });

})
.catch(function (error) {
    console.log(error);
});

