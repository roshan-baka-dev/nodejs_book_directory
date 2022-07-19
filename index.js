const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
// const { connect } = require("http2");

const app = express();

// middleware function

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',express.static("./public"));
// routes

//to view the list
app.get('/user/list',(req,res)=>{
    try{
        const users=getUserData();
        res.send(users);
    }catch(err){
        console.log("invalid json",err)
        res.send({});
    }
})

//to add new user
app.post('/user/add',(req,res)=>{


    //reading file from account.json file  ...returns a string
    const users=getUserData();

    //converting string to json
    const jsonUser=JSON.parse(users);

    const userData=req.body;

    console.log(userData);

    //checking for missing data
    // if (userData.fullname == null || userData.age == null || userData.username == null || userData.password == null) {
    //     return res.status(401).send({error: true, msg: 'User data missing'})
    // }
    

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
    saveUserData(strData);

    //sending success message
    res.send({success:true,msg:"user data added successfully"});

})

//deleting user data
app.delete('/user/delete/:username',(req,res)=>{
    const username=req.params.username;
    console.log(username);
     //reading file from account.json file  ...returns a string
     const users=getUserData();

     //converting string to json
     const jsonUser=JSON.parse(users);
     
     const newJsonUser=jsonUser.filter((user)=> user.username!==username);

     //converting json to string
    const strData=JSON.stringify(newJsonUser);

    console.log(strData);
    //writing the string to account.json
    saveUserData();

    res.send({sucess:true,msg:`user ${username} deleted`});
})



const saveUserData=(data)=>{
    // const stringifyData=JSON.stringify(data);
    fs.writeFileSync(__dirname+'/details/account.json',data);
}

const getUserData=()=>{
    const jsonData=fs.readFileSync(__dirname+'/details/account.json','utf8');
    return jsonData;
}

app.listen(3000, () => {
  console.log("listening at port 3000.......");
});
