const fill = document.querySelector('.fill');
const empties = document.querySelectorAll('.empty');



//拼圖容器監聽

for(const empty of empties){
    empty.addEventListener('dragover',function(obj){

        obj.preventDefault(); //讓drop可以利用

    });

    empty.addEventListener('dragenter',function(obj){

        obj.preventDefault(); //讓drop可以利用
        this.className +=' hoverd';  //增加hover樣式
    });

    empty.addEventListener('dragleave',function(){
        this.className = 'empty';  //移除被hoverd的樣式
    });

    empty.addEventListener('drop',function(){
        //this.className = 'empty'; //
        this.append(fill);  //填入照片
    });

}


//fill 事件監聽(拼圖物件)
fill.addEventListener('dragstart', function(obj){
    //this.className += ' hold';  //被抓取時效果

    setTimeout(
        () => this.className = 'invisible',0
    ); //被拖時立即不見

    let x = obj.offsetX;
    let y = obj.offsetY;

    obj.dataTransfer.setData('X', x);
    obj.dataTransfer.setData('Y', y);

});

fill.addEventListener('dragend',function(){
    this.className = 'fill';  //拖後置放點
});