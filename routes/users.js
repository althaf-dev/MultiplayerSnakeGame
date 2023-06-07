var express = require('express');
var router  = express.Router();
var name,psword,result,access,hscore;


router.post('/', function (req, res, next) {

 
  name   = req.body.name;
  psword = req.body.password;
  access = req.body.access;
  

  client.db('sample').collection("users").find({ "name": name,"password":psword }).toArray().then((data) => {
   
    if (data.length > 0) {

      if(access == "login"){
        result = "You Are Now Logined In As "+ data[0].name;
      }

      else{
        result = "Player alreday Exist";
      }
      
    }

    else {

      if(access == "login"){
        result = "username or password incorrect";
      }

      else{
        client.db("sample").collection("users").insertOne({ "name": name, "password": psword });
        result = "Player created Succesfuly";
      }
      
    }

  }).then(() => { res.json({ "result": result }); })

});


//------------------------------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------------------------------------

router.post('/dem', function (req, res, next) {
  
  console.log("gameover");
  console.log(name);
  client.connect().then(() => console.log("connceted2"));
  client.db("sample").collection("player").find({ "name": name }).toArray().then((data) => {
    // console.log("finding");
    Player1 = data;
    console.log(Player1);
  }).then(() => {

    if (Player1.length > 0) {
      if (Player1[0].score < req.body.data) {
        client.db("sample").collection("player").updateOne({ "name": name }, { $set: { "score": req.body.data } });
        console.log("updated");
        hscore = req.body.data;
        
      }

      else{
        console.log(Player1[0].score)
        hscore = Player1[0].score;
      }

    }
    else {
      client.db("sample").collection("player").insertOne({ "name": name, score: req.body.data });
      hscore = req.body.data;
    }

  }).then(()=>{res.json({ "hscore": hscore })})


})
//--------------------------------------------------------------------------------------------------------------------------------------


router.post('/score',function (req,res,next){

  console.log("called api-score");
  //res.json({status:"done"});
 // res.json({status:"done"});
 client.db("sample").collection("player").find({}).toArray().then((values)=>{
  //console.log(values);
  res.json({values});
 })
})


//---------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;
