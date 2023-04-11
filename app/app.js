require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const expressLayouots = require("express-ejs-layouts");
const db = require("../config/mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("../config/passport").passportLocal
const MongoStore=require('connect-mongo')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static("../assets"));

app.use(expressLayouots);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(
  session({
    name: "SMA",
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
    store:new MongoStore({
      mongoUrl:"mongodb+srv://"+process.env.mongoURI,
      autoRemove:'disabled'
    },
    function(err){
      console.log(err|| 'connect mongo db ok')
    }
    )
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser)

app.use("/", require("../routes"));

app.set("view engine", "ejs");
app.set("views", "../views");

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
