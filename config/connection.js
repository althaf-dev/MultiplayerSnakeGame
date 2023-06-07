var MongoClient = require('mongodb').MongoClient
module.exports.connect=function(){
    const uri="mongodb://127.0.0.1:27017";
    const dbname="sample";
    client=new MongoClient(uri);
    client.connect().then(()=>console.log("conncetedorg"));
}