const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
// const { connect } = require("http2");

const app = express();

// middleware function

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes

//to view the list
app.get('/user/list',(req,res)=>{
    try{
        const users=fs.readFileSync(__dirname+'/details/account.json','utf8');
        const data=JSON.parse(users);
        res.send(users);
    }catch(err){
        console.log("invalid json",err)
        res.send({});
    }
})

//to add new user
app.post('/user/add',(req,res)=>{


    //reading file from account.json file  ...returns a string
    const users=fs.readFileSync(__dirname+'/details/account.json','utf8');

    //converting string to json
    const jsonUser=JSON.parse(users);

    const userData=req.body;

    //checking for missing data
    if (userData.fullname == null || userData.age == null || userData.username == null || userData.password == null) {
        return res.status(401).send({error: true, msg: 'User data missing'})
    }
    

    //checking for a duplicate username
    const findExit=jsonUser.find((user)=>user.username===userData.username)
    
    if(findExit){
        return res.status(401).send({error:true,msg:"username already exist"});
    }


    //adding new user to array 
    jsonUser.push(userData);

    //converting json to string
    const strData=JSON.stringify(jsonUser);

    //writing the string to account.json
    fs.writeFileSync(__dirname+'/details/account.json',strData);

    //sending success message
    res.send({success:true,msg:"user data added successfully"});

})

//deleting user data
app.delete('/user/delete/:username',(req,res)=>{
    const username=req.params.username;
    console.log(username);
     //reading file from account.json file  ...returns a string
     const users=fs.readFileSync(__dirname+'/details/account.json','utf8');

     //converting string to json
     const jsonUser=JSON.parse(users);
     
     const newJsonUser=jsonUser.filter((user)=> user.username!==username);

     //converting json to string
    const strData=JSON.stringify(newJsonUser);

    console.log(strData);
    //writing the string to account.json
    fs.writeFileSync(__dirname+'/details/account.json',strData);

    res.send({sucess:true,msg:`user ${username} deleted`});
})

app.listen(3000, () => {
  console.log("listening at port 3000.......");
});
