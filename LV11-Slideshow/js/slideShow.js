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