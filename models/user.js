const mongoose = require("mongoose")
const Schema = mongoose.Schema

/*
passport-local-mongoose- elps in building username and password login
From docs:

First you need to plugin Passport-Local Mongoose into your User schema
You're free to define your User how you like. Passport-Local Mongoose 
will add a username, hash and salt field to store the username, 
the hashed password and the salt value.

Additionally Passport-Local Mongoose adds some methods to your Schema.

*/
const passportLocalMongoose = require("passport-local-mongoose")

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
})

const User = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  authStrategy: {
    type: String,
    default: "local",
  },
  points: {
    type: Number,
    default: 50,
  },
  refreshToken: {
    type: [Session],
  },
})

//Remove refreshToken from the response
User.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.refreshToken
    return ret
  },
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", User)
