var express = require("express");
var path = require("path");
var mongoose = require("mongoose");

var port = process.env.PORT || 3000;
var app = express();
var dbUrl = "mongodb://localhost/imooc";
mongoose.connect(dbUrl);

app.set("views", "./app/views/pages");
app.set("view engine", "jade");

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json());

var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
app.use(session({
  secret: "imooc",
  store: new mongoStore({
  	url: dbUrl,
  	collection: "sessions"
  })
}));

var cookieParser = require('cookie-parser');
app.use(cookieParser())

//app.use(express.multipart());
var multer  = require('multer');
app.use(multer());

app.use(express.static(path.join(__dirname, "public")));
app.locals.moment = require("moment");
app.listen(port);

console.log("imooc started on prot " + port);

var morgan = require("morgan");
if("development" === app.get("env")) {
	app.set("showStackError", true);
	app.use(morgan(":method :url :status"));
	app.locals.pretty = true;
	mongoose.set("debug", true);
} 

require("./config/routes")(app);
