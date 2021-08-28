const express = require("express");
const connect = require("connect");
const session = require("express-session");
const path = require("path");
const Country = require("./models/country.model");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var config = require("./config.js");


// Routes
const dataRoute = require("./routes/data.route");

// App
const app = express()
const port = process.env.PORT || 3000;

app.listen(port);

// Configuration
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(express.json());
app.use(compression());

app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, x-access-token, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");

  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dataRoute(app); //register the route

app.all("*", (req, res) => {
  console.log(`Invalid Uri Resource ${req.baseUrl}`)
  res.send({
    success: false,
    status: 404,
    message: "Invalid Uri Resource",
  });
});

module.exports = app;
