const express=require("express");
const UserRoutes=express.Router();
const passport =require("passport");

const { MongoClient,ObjectId }=require('mongodb');
const dbName = 'NodeProjectDB';
const url ="mongodb+srv://NodeProjectAdmin:NodeProjectAdmin123@cluster0.4umvt.mongodb.net/all-data?retryWrites=true&w=majority"
UserRoutes.route('/signup')
.get((req,res)=>{
    if(req.user){
        res.redirect("/product");
    }
    const errorlist=[];
    res.render("UserSignup",{errorlist});
})
.post((req,res)=>{
    let errorlist=isEmpty(req.body);
    const client = new MongoClient(url);

    if(Object.keys(errorlist).length === 0 && errorlist.constructor === Object){
        res.render("UserSignup",{errorlist});
    }
    (async function mongo(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const collection = await db.collection('user');
            const user=await collection.findOne({email:req.body.email});
            const obj=user || {};
            if(Object.keys(obj).length === 0 && obj.constructor == Object){
                errorlist.push({message:`This email is already existed`})
                res.render("UserSignup",{errorlist});
            }else{
                const newuser=await collection.insertOne({name:req.body.username,password:req.body.password,email:req.body.email,status:"user"});
                req.login(newuser.ops[0],()=>{
                    res.redirect('/product');
                });
            }
        }
        catch(e){
            console.log(e);
        }
        client.close();
    }())
})
function isEmpty(obj ){
    const errorlist=[];
    for (const item in obj) {
        if(obj[item] == null || obj[item] === ''){
            console.log("there is an error in errorlist"+item +" no "+obj[item]);
            errorlist.push({message:`The ${item} is required`});
        }
      }
    return errorlist;
  }

UserRoutes.route('/login').get((req,res)=>{
    if(req.user){
        res.redirect("/product");
    }
    const errorlist=[];
    res.render("UserLogin",{errorlist});
})
.post((req,res)=>{
    let errorlist=isEmpty(req.body);
    const client = new MongoClient(url);
    if(Object.keys(errorlist).length === 0 && errorlist.constructor === Object){
        res.render("UserLogin",{errorlist});
    }
    (async function mongo(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const collection = await db.collection('user');
            const user=await collection.findOne({email:req.body.email,password:req.body.password});
            const obj=user || {};
            if(Object.keys(obj).length === 0 && obj.constructor == Object){
                errorlist.push({message:`This email or password does not exist.`})
                res.render("UserLogin",{errorlist});
            }else{
                req.login(user,()=>{
                    res.redirect('/product');
                });
            }
        }
        catch(e){
            console.log(e);
        }
        client.close();
    }())
})
module.exports=UserRoutes;