var express = require('express');
var router = express.Router();
var name;
var psword;
var user1;

router.post('/', function (req, res, next) {


    name = req.body.pname;
    psword = req.body.ps_word;
    console.log(name, psword);
    dbupdate();
    res.status(200).status("dfj");
  
  })
  function dbupdate() {

    client.db("sample").collection("users").find({ "name": name }).toArray().then((data) => {
  
      user1 = data;
    }).then(() => {
  
      if (user1.length > 0) {
  
        console.log("user alerady exist");
  
      }
  
      else {
  
        client.db("sample").collection("users").insertOne({ "name": name, "password": psword });
  
      }
    })
  
  
  }
  

module.exports = router;