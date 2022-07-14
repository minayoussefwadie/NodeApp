const express=require("express");
const ProductRoutes=express.Router();
const { MongoClient,ObjectId }=require('mongodb');
const dbName = 'NodeProjectDB';
const url ="mongodb+srv://NodeProjectAdmin:NodeProjectAdmin123@cluster0.4umvt.mongodb.net/all-data?retryWrites=true&w=majority"
ProductRoutes.route('/').get((req,res)=>{
    const client = new MongoClient(url);
    (async function mongo(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const collection = await db.collection('product')
            const products=await collection.find().toArray();
            res.render('index',{products});
        }
        catch(e){
            console.log(e);
        }
        client.close();
    }())
})
ProductRoutes.route('/details/:id').get((req,res)=>{
    const client = new MongoClient(url);
    const {id}=req.params;
    (async function mongo(){
        try{
            await client.connect();
            const db = client.db(dbName);
            const collection = await db.collection('product')
            const products=await collection.findOne({_id:new ObjectId(id)});
            res.render('productDetails',{products});
        }
        catch(e){
            console.log(e);
        }
        client.close();
    }())

})
module.exports=ProductRoutes;
