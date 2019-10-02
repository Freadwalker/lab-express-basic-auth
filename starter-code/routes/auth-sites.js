const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage:
        "Omg you did not even enter anything, my dissapointment is immeasurable and my day is ruined"
    });
    return;
  }
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({username: username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "This username already exist oh no :("
        });
        return;
      } else {
        User.create({ username: username, password: hashPass });
        res.redirect("/");
      }
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => { 

  if (req.body.username === "" || req.body.password === "") {
    res.render("auth/login", { errorMessage: "You havent entered anything" });
    return;
  }

  User.findOne({username:req.body.username})
    .then(user => {
      if (user !== null) {
        // bcrypt.compare(req.body.password, user.password, (err,solution)=>{
        //   if(solution){
        //     res.redirect("/");
        //   }else{
        //     res.render("auth/login",{errorMessage:"This password is incorrect"})
        //   }
        // });
        console.log(bcrypt.compareSync(req.body.password,user.password))
        if(bcrypt.compareSync(req.body.password,user.password)) {
          req.session.currentUser=user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "The password you entered is incorrect"
          });
        }
      } else {
        res.render("auth/login", {
          errorMessage: "this user does not exist my brahh"
        });
      }
    })
    .catch(err => {
      res.send(err)
    });
});

module.exports = router;
