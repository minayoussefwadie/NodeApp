const express=require("express");
const { MongoClient,ObjectId }=require('mongodb');
const dbName = 'NodeProjectDB';
const AdminRoutes=express.Router();
const products=[
    {name:"Apple iPhone 11",price:"$1800",desc:"Apple iPhone 11, 64GB, Purple - Fully Unlocked",img:"https://m.media-amazon.com/images/I/51U8WCTTmCL._AC_SX522_.jpg"},
    {name:"Apple iPhone 13 Pro Max",price:"$1700",desc:"Apple iPhone 13 Pro Max, 256GB, Graphite - Unlocked",img:"https://m.media-amazon.com/images/I/61iVuXR3dhL._AC_SX522_.jpg"},
    {name:"Apple iPhone 12 Pro Max",price:"$1600",desc:"Apple iPhone 12 Pro Max, 256GB, Pacific Blue - Fully Unlocked",img:"https://m.media-amazon.com/images/I/71OO+WDhyFL._AC_SX522_.jpg"},
    {name:"SAMSUNG Galaxy S22 Ultra",price:"$1500",desc:"SAMSUNG Galaxy S22 Ultra Cell Phone, Factory Unlocked Android Smartphone, 512GB, 8K Camera & Video, Brightest Display Screen, S Pen, Long Battery Life, Fast 4nm Processor, US Version, Phantom Black",img:"https://m.media-amazon.com/images/I/61U6oC65TTL._AC_SX522_.jpg"},
    {name:"SAMSUNG Galaxy S21 FE 5G",price:"$1400",desc:"SAMSUNG Galaxy S21 FE 5G Cell Phone, Factory Unlocked Android Smartphone, 128GB, 120Hz Display Screen, Pro Grade Camera, All Day Intelligent Battery, US Version, White",img:"Hhttps://m.media-amazon.com/images/I/61kLsk8RslL._AC_SX522_.jpg"},
    {name:"Oppo Find X5 Pro 5G",price:"$1200",desc:"Oppo Find X5 Pro 5G Dual 256GB 12GB RAM Factory Unlocked (GSM Only | No CDMA - not Compatible with Verizon/Sprint) China Version | No Google Play Installed - White",img:"https://m.media-amazon.com/images/I/71QmFJCJ-ML._AC_SX522_.jpg"},
    {name:"Oppo A74 5G",price:"180",desc:"Oppo A74 5G Dual CPH2197 128GB 6GB RAM Factory Unlocked (GSM Only | No CDMA - not Compatible with Verizon/Sprint) International Version - Space Sliver",img:"https://m.media-amazon.com/images/I/81tzh9q3psS._AC_SX522_.jpg"},
    {name:"Android-iPhone, SKG V7",price:"$1100",desc:"Smart Watch, 14 Fitness Tracker Smartwatch-5ATM Swimming Waterproof, Health Monitor for Heart Rate, Blood Oxygen, Sleep & Stress, 1.7inch Touchscreen Bluetooth Watch for Android-iPhone, SKG V7",img:"https://m.media-amazon.com/images/I/71JU-bUt-sL._AC_UY218_.jpg 1x, https://m.media-amazon.com/images/I/71JU-bUt-sL._AC_UY327_FMwebp_QL65_.jpg 1.5x, https://m.media-amazon.com/images/I/71JU-bUt-sL._AC_UY436_FMwebp_QL65_.jpg 2x, https://m.media-amazon.com/images/I/71JU-bUt-sL._AC_UY545_FMwebp_QL65_.jpg 2.5x, https://m.media-amazon.com/images/I/71JU-bUt-sL._AC_UY654_FMwebp_QL65_.jpg 3x"},
    {name:"Amazfit GTR 3 Smart Watch",price:"$1500",desc:"Amazfit GTR 3 Smart Watch for Android Phone iPhone with Alexa, GPS Fitness Tracker with 150 Sports Modes, 21-Day Battery Life, 1.39” AMOLED Display, Blood Oxygen Heart Rate Tracking, Waterproof, Black",img:"https://m.media-amazon.com/images/I/61zZBX11QEL._AC_SX522_.jpg"},
    {name:"Dirrelo Smart Watch",price:"$2500",desc:"Dirrelo Smart Watch for Android Phones for iPhone Compatible, Smart Watches for Men Women, 5ATM Waterproof Fitness Smartwatch with Heart Rate Monitor & Sleep Tracker & Blood Oxygen Monitor, Black",img:"https://m.media-amazon.com/images/I/61N46Zd97gL._AC_SX522_.jpg"},
    {name:"HAFURY Women Smart Watch",price:"$2500",desc:"HAFURY Women Smart Watch, Activity Fitness Tracker for Women Men, Smartwatch for Android & iOS Phones, Heart Rate Monitor, IP68 Waterproof Fitness Watch, Sleep, Calories, Step Tracker, Pink",img:"https://m.media-amazon.com/images/I/61z2kDt8auS._AC_UL320_.jpg"},
    ]
    const user=[
        {name:"Admin",email:"admin@gmail.com",password:"pass123",status:"admin"},
        {name:"user",email:"user@gmail.com",password:"123",status:""}
    ]
const url ="mongodb+srv://NodeProjectAdmin:NodeProjectAdmin123@cluster0.4umvt.mongodb.net/all-data?retryWrites=true&w=majority"
AdminRoutes.route('/').get((req,res)=>{
    res.redirect("/Admin/view");
})
AdminRoutes.route('/view').all((req,res,next)=>{
    if(req.user){
    next();
    }else{
    res.redirect("/user/login");
    }
    }).get((req,res)=>{
    const client = new MongoClient(url);
(async function mongo(){
    try{
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = await db.collection('product')
        const products=await collection.find().toArray();
        res.render('ProductView',{products});
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
        if((obj[item] == null || obj[item] === '') && item !="_id"){
            if(item ==="desc"){
                errorlist.push({message:`The Description is required`});
            }else if(item ==="img"){
                errorlist.push({message:`The Image is required`})
            }else{
                errorlist.push({message:`The ${item} is required`})
            }
        }
    }
    return errorlist;
  }

AdminRoutes.route('/addNew')
.all((req,res,next)=>{
if(req.user){
next();
}else{
res.redirect("/user/login");
}
})
.get((req,res)=>{
    const product={
        _id:'',
        name: '',
        price: '',
        desc: '',
        img: ''
      }
      const errorlist=[];
    res.render("ProductForm",{product,action:"/Admin/addNew",errorlist});
})
.post((req,res)=>{
    const client = new MongoClient(url);
    let errorlist=isEmpty(req.body);
    const product={
        name:req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        img: req.body.img
      }
    if(Object.keys(errorlist).length !== 0){
        res.render("ProductForm",{product,action:"/Admin/addNew",errorlist});
    }
    (async function mongo(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const collection = await db.collection('product')
           await collection.insertOne(product);
           res.redirect("/Admin/view");
        }
        catch(e){
            console.log(e);
        }
        client.close();
    }())
})
AdminRoutes.route('/edit/:id').all((req,res,next)=>{
    if(req.user){
    next();
    }else{
    res.redirect("/user/login");
    }
    })
    .get((req,res)=>{
    const errorlist=[];
    const client = new MongoClient(url);
    const {id}=req.params;
    (async function mongo(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const collection = await db.collection('product')
            const product=await collection.findOne({_id:new ObjectId(id)});
            res.render("ProductForm",{product,action:"/Admin/edit",errorlist})
        }
        catch(e){
            console.log(e);
        }
        client.close();
    }())
})
AdminRoutes.route('/edit').all((req,res,next)=>{
    if(req.user){
    next();
    }else{
    res.redirect("/user/login");
    }
    }).post((req,res)=>{
    let errorlist=isEmpty(req.body);
    const product={
        name:req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        img: req.body.img
      }
    if(Object.keys(errorlist).length !== 0){
        res.render("ProductForm",{product,action:"/Admin/edit",errorlist});
    }
    const client = new MongoClient(url);
    (async function mongo(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const collection = await db.collection('product');
            const products=await collection.findOne({_id:new ObjectId(req.body._id)});
            await collection.updateOne(
                {_id:ObjectId(products._id)},
                { $set: {name:req.body.name,desc:req.body.desc,price:req.body.price,img:req.body.img}},
                { upsert: true });
            res.redirect("/admin/view")
        }
        catch(e){
            console.log(e);
        }
        client.close();
    }())
})
AdminRoutes.route('/delete/:id').all((req,res,next)=>{
    if(req.user){
    next();
    }else{
    res.redirect("/user/login");
    }
    }).get((req,res)=>{
    const client = new MongoClient(url);
    const {id}=req.params;
    (async function mongo(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const collection = await db.collection('product')
            const product=await collection.findOne({_id:new ObjectId(id)});
            await collection.deleteOne({_id:ObjectId(product._id)});
            res.redirect("/Admin/view");
        }
        catch(e){
            console.log(e);
        }
        client.close();
    }())
})
module.exports=AdminRoutes;
