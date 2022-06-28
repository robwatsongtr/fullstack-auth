const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const url = process.env.MONGO_DB_CONNECTION_STRING
const app = express()

if (process.env.NODE_ENV !== "production") {
  // Load environment variables from .env file in non prod environments
  require("dotenv").config()
}

app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",") : []

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))

app.get("/", function (req, res) {
  res.send({ status: "success" })
})

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
connect
  .then(db => {
    console.log("connected to db")
  })
  .catch(err => {
    console.log(err)
  })
const server = app.listen(process.env.PORT || 8081, function () {
  const port = server.address().port
  console.log("App started at port:", port)
})