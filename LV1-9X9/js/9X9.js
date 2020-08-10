
const table = document.getElementById('table');
//第一層迴圈：製作div及h2(共九個)
for(var i =9;i>=2;i--){
    const createDiv = document.createElement('div');
    var str = `<h2>${i}</h2>`;

    //第二層迴圈：加P段及內容數字 
    for(var j=1;j<10;j++){
        str += `<p>${i} X ${j} = ${i*j}</p>`;
        createDiv.innerHTML = str;
    }
    table.after(createDiv);
}
