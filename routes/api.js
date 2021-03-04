const express = require("express");
const Algorithm = require("../models/algorithm");
const router = express.Router();

router.get("/", function(req,res){

  Algorithm.find().populate("comments").exec(function(err,foundAlgos){
  if(err) 
    {console.log(err);}
  else
    { return res.status(200).json({ algorithms:foundAlgos});
     }
   });
});

module.exports = router;
