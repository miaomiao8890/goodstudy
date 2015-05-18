var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var _ = require("underscore");
var Movie = require("./models/movie")
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect("mongodb://localhost/imooc");

app.set("views", "./views/pages");
app.set("view engine", "jade");

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, "bower_components")));
app.listen(port);

console.log("imooc started on prot " + port);

//index page
app.get("/", function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}

		res.render("index", {
			title: "sunchi 首页",
			movies: movies
		});
	});
});

//detail page
app.get("/movie/:id", function(req, res){
	var id = req.params.id;
	Movie.findById(id, function(err, movie){
		res.render("detail", {
			title: "sunchi " + movie.title,
			movie: movie
		});
	});
});

//admin page
app.get("/admin/movie", function(req, res){
	res.render("admin", {
		title: "sunchi 后台录入页",
		movie: {
			title: "",
			doctor: "",
			country: "",
			year: "",
			poster: "",
			flash: "",
			summary: "",
			language: ""
		}
	})
});

//admin update movie
app.get("/admin/update/:id", function(req, res){
	var id = req.params.id;

	if(id){
		Moive.findById(id, function(err, movie){
			res.render("admin", {
				title: "imooc 后台更新页",
				movie: movie
			})
		});
	}
});

//admin post moive
app.post("/admin/movie/new", function(req, res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(id !== "undefined"){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}

			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err);
				}

				res.redirect("/movie/" + movie._id);
			});
		});
	}else{
		_movie =new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			doctor: movieObj.doctor,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});

		_movie.save(function(err, movie){
			if(err){
				console.log(err);
			}

			res.redirect("/movie/" + movie._id);
		});
	}
});

//list page
app.get("/admin/list", function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}

		res.render("list", {
			title: "sunchi 列表页",
			movies: movies
		});
	});
});