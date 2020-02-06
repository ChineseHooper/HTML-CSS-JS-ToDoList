let drawer = document.getElementsByClassName('drawer');
//Mistake: getElementsByClass return a collection;


// Navgation Logic ------------------------------------------------//

let drawerToday = document.getElementById('drawer-today');
let drawerPlan = document.getElementById('drawer-plan');
let drawerAll = document.getElementById('drawer-all');
let currentPosition = "today";

// linked items;
let listTitle = document.getElementsByClassName('list-title')[0];
let listUpdate = document.getElementById("task-list"); //用来控制刷新时表格区域的样式；
let listArea = document.getElementById("task-area"); //用来更新列表；

// data set & form
let loadData; //save the data from server;

let openPanel = document.getElementsByClassName('popup-addtask')[0];
let panelTrigger = document.getElementById('add-task-icon');
let btnSubmit = document.getElementById('btn-submit');
let btnClose = document.getElementById('btn-close');
let inputTxt = document.getElementsByClassName('input-text');

//Drawer selection-------------------------------------------------//
//公用功能，各项点击时清除列表;
let categories = [ drawerToday , drawerPlan , drawerAll];
categories.forEach((category) => {
    category.addEventListener('click',delCurrentList);
})

//helper function delete the current task list;
function delCurrentList(){
    while(listArea.firstChild){
        listArea.removeChild(listArea.firstChild);
    }
}

drawerToday.onclick = function(){
    if(drawerToday.getAttribute('class') !== 'drawer-today-focus'){
        drawerToday.setAttribute('class','drawer-today-focus');
        listTitle.innerHTML =  "今天";
        listTitle.style.color = "rgb(55, 108, 255)";
        
        // reset other drawers and folders
        drawerPlan.setAttribute('class','drawer-default')
        drawerAll.setAttribute('class','drawer-default')

        //write the data to page;
        if(loadData !== undefined){
            writeToPage(loadData.today);
        }

        //set current page
        currentPosition = 'today';
    }
}

drawerPlan.onclick = function(){
    if(drawerPlan.getAttribute('class') !== 'drawer-plan-focus'){
        drawerPlan.setAttribute('class','drawer-plan-focus');
        listTitle.innerHTML =  "计划";
        listTitle.style.color = "rgb(253, 98, 37)";

        // reset other drawers and folders
        drawerToday.setAttribute('class','drawer-default');
        drawerAll.setAttribute('class','drawer-default');

        //write the data to page;
        if(loadData !== undefined){
            writeToPage(loadData.plan);
        }

        //set current page
        currentPosition = 'plan';
    }
}
drawerAll.onclick = function(){
    if(drawerAll.getAttribute('class') !== 'drawer-all-focus'){
        drawerAll.setAttribute('class','drawer-all-focus');
        listTitle.innerHTML =  "全部";
        listTitle.style.color = "rgb(104, 108, 119)";

        // reset other drawers and folders
        drawerToday.setAttribute('class','drawer-default');
        drawerPlan.setAttribute('class','drawer-default');

        if(loadData !== undefined){
            writeToPage(loadData.all);
        }
        //set current page
        currentPosition = 'all';
    }
}

//Get all when program start ------------------------------------------//

function getAll(){
    fetch("/getAll")
    .then((res) => res.json())
    .then((data) => setUpData(data))
}

function setUpData(data){
    loadData = data;

    console.log(loadData);
    //载入今天的提醒事项作为默认
    let todayTask = loadData.today;

    writeToPage(todayTask);
}

// write data to page

function writeToPage(data){
    let item = 1;

    data.forEach((task) => {
        let itemId = `item-${item}`

        //定义一个任务单元所包含的HTML标签
        let taskItem = document.createElement('div');
        let taskInnerContainer = document.createElement('div');

        let checkBox = document.createElement('input');
        let labelButton = document.createElement('label');
        let labelText = document.createElement('label');

        //设置每个任务单元的整体样式类；
        taskItem.setAttribute('class','task-item');

        let checkBoxAttr = {
            "type":"checkbox",
            "id":itemId,
            "name":itemId
        }

        let labelButtonAttr = {
            "for":itemId,
            "class":"button"
        }

        let labelTextAttr = {
            "for":itemId,
            "class":"text"
        }

        setAttributes(checkBox,checkBoxAttr);
        setAttributes(labelButton,labelButtonAttr);
        setAttributes(labelText,labelTextAttr);

        //准备写入数据的内容部分
        labelText.innerHTML = `
            <h3 class="brief">${task.brief}</h3>
            <p class="detail">${task.detail}</p>
            <p class="time">${task.time}</p>
        `
        //组合成任务单元
        taskInnerContainer.appendChild(checkBox);
        taskInnerContainer.appendChild(labelButton);
        taskInnerContainer.appendChild(labelText);

        taskItem.appendChild(taskInnerContainer);
        listArea.appendChild(taskItem);

        item += 1;
    })
}
//helper function for compose page
function setAttributes(element,attributes){
    for(let key in attributes){
        element.setAttribute(key,attributes[key]);
    }
};

getAll() //Call the function when program start

//add personal folder ------------------------------------------//
let addListTrigger = document.getElementById("add-folder-icon");
let addLst = document.getElementById("add-list");

addListTrigger.onmousedown = function(){
    addLst.setAttribute("src","icon/add-over.png");
    this.style.color = "black";
}
addListTrigger.onmouseup = function(){
    addLst.setAttribute("src","icon/add-default.png");
    this.style.color = "rgb(104, 108, 119)";
}

//add task------------------------------------------------------//
//pop up the panel
let addTsk = document.getElementById("add-tsk"); //get the button
panelTrigger.onclick = function(){
    //set the state when the button get click
    addTsk.setAttribute("src","icon/add-over.png");
    this.style.color = "black";
    //show the panel
    openPanel.classList.add('popup-translate');
}
//control button : close panel & submit;
btnClose.addEventListener("mouseover",()=>{
    btnClose.style.backgroundImage = "url(icon/close-over.svg)"
});
btnClose.addEventListener("mouseleave",()=>{
    btnClose.style.backgroundImage = "url(icon/close-default.png)"
});
btnClose.addEventListener("click",()=>{
    addTsk.setAttribute("src","icon/add-default.png");
    panelTrigger.style.color = "rgb(104, 108, 119)"
    openPanel.classList.remove('popup-translate');
})

btnSubmit.addEventListener("mouseover",()=>{
    btnSubmit.style.backgroundImage = "url(icon/post.svg)"   
});
btnSubmit.addEventListener("mouseleave",()=>{
    btnSubmit.style.backgroundImage = "url(icon/post-default.png)"
});

//form interaction style

inputTxt[0].addEventListener('focusin',()=>{
    event.target.classList.add('brief-transform');
})
inputTxt[0].addEventListener('focusout',()=>{
    event.target.classList.remove('brief-transform');
})

inputTxt[1].addEventListener('focusin',()=>{
    event.target.classList.add('detail-transform');
})
inputTxt[1].addEventListener('focusout',()=>{
    event.target.classList.remove('detail-transform');
})


//submit form
btnSubmit.addEventListener('click',addTask); 
function addTask(e){
    e.preventDefault();

    let brief = document.getElementById('brief').value;
    let detail = document.getElementById('detail').value;
    let time = document.getElementById('time').value;
    let taskString = {
        brief,
        detail,
        time
    };

    console.log(taskString);
    //fetch内部的数据头部必须严格按照文档；
    fetch("/postTask",{
        method : "POST",
        headers : {
            'Accept':'application/json, text/plain, */*',
            'Content-Type':'application/json'
        },
        body : JSON.stringify(taskString)
    })
    .then((res) => res.json())
    .then((data) => {
        loadData = data;
        delCurrentList();
        writeToPage(loadData[currentPosition])
    })
}