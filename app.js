//jshint esversion:6
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");


const app=express();
mongoose.connect('mongodb://localhost:27017/userDB');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});
const secret="Thisisourlittlesecret";
userSchema.plugin(encrypt, { secret:secret,encryptedFields: ['password'] });

const User=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});


app.post("/register",function(req,res){
  const userNew=new User({
    email:req.body.username,
    password:req.body.password
  });
  userNew.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  })
});

app.post("/login",function(req,res){
  const user=req.body.username;
  const password=req.body.password;
  User.findOne({email:user},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password===password){
          
          res.render("secrets");
        }
      }

    }
  })
})


app.listen(3000,function(){
  console.log("Server has started on port 3000!");
})
