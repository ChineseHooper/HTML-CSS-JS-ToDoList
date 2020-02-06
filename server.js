const fs = require('fs');
const express = require('express');
const app = express();


let server = app.listen(3000, ()=>{
    console.log('App listening...');
})

app.use(express.static('client'));
//server need to understand JSON when get the request!
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json());

// get current database;
let database = fs.readFileSync('database/tdl.json');
let dataInJSON = JSON.parse(database);

// update task to Client
app.get('/getAll', getTask);

function getTask(req,res){
    res.send(dataInJSON);
}

// post task
app.post('/postTask',function(request,response){
    let newTask = request.body;

    if(newTask.time == "Today"){
        dataInJSON.today.push(newTask);
    }else{
        dataInJSON.plan.push(newTask);
        dataInJSON.all.push(newTask);
    }

    let readyToWrite = JSON.stringify(dataInJSON,null,2);
    console.log(readyToWrite);

    fs.writeFile('database/tdl.json',readyToWrite,()=>{
        console.log('Write Success');
    }) 

    response.send(dataInJSON);
})




