var Category = require("../models/category");

//admin new page
exports.new = function(req, res){
	res.render("category_admin", {
		title: "sunchi 后台分类录入页",
		category: {}
	})
}

//admin post moive
exports.save = function(req, res){
	var _category = req.body.category;
	
	var category = new Category(_category);

	category.save(function(err, movie){
		if(err){
			console.log(err);
		}

		res.redirect("/admin/category/list");
	});
}

//catetorylist page
exports.list = function(req, res){
	Category.fetch(function(err, categories){
		if(err){
			console.log(err);
		}

		res.render("categorylist", {
			title: "sunchi 分类列表页",
			categories: categories
		});
	});
}
