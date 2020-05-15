const express=require('express');
const app=express();
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const postblogs = require('./routes/post_routes');
const getblogs = require('./routes/get_routes');
const deleteblogs = require('./routes/delete_routes');
app.use(bodyParser.json());

mongoose.connect( "mongodb+srv://onewater:onewater123@cluster0-hmjdu.mongodb.net/onewater")
        .then(()=>
        {console.log("Connection to MongoDB is Successfull !");
    })
        .catch((err)=> {
            console.log("Connection to Database Failed !",err);
        });
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization,Null"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS",
    );
    next();
  });

  app.get('/',(req,res)=>{
      res.json({
          "Message":"Connected TO OneWater Blog"
      })
  })

  app.use('',postblogs);
  app.use('',getblogs);
  app.use('',deleteblogs);
  module.exports = app;
