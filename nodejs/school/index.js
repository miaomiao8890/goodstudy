var klass = require('./klass')

exports.add = function(klasses){
	klasses.forEach(function(item, index){
		var _klass = item;
		var teccherName = item.teacherName;
		var students = item.students.
		
		klass.add(teccherName, students);
	})
}