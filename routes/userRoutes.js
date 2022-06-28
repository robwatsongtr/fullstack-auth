const express = require("express")
const router = express.Router()
const User = require("../models/user")

const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../authenticate")

// Here we are defining the route /signum for registration. It calls the 'register' 
// function from 'passport-local-mongoose' plugin, with the username, pw, and a callback,
// which will be called once the user is registered. 

// When the user is successfully registered we generate a JWT auth token, 
// and the refresh token. We save the first and last name to the db, 
// along with the refresh token.

// On successfully saving the details to the db, 'refreshToken' cookie is created
// and the JWT auth token is sent to the response body.
router.post("/signup", (req, res, next) => {
  // Verify that first name is not empty
  if (!req.body.firstName) {
    res.statusCode = 500
    res.send({
      name: "FirstNameError",
      message: "The first name is required",
    })
  } else {
    User.register(

      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {

          res.statusCode = 500
          res.send(err)

        } else {

          user.firstName = req.body.firstName
          user.lastName = req.body.lastName || ""
          const token = getToken({ _id: user._id })
          const refreshToken = getRefreshToken({ _id: user._id })
          user.refreshToken.push({ refreshToken })
          user.save((err, user) => {

            if (err) {

              res.statusCode = 500
              res.send(err)

            } else {

              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
              res.send({ success: true, token })

            }

          })
        }
      }
      
    )
  }
})

module.exports = router