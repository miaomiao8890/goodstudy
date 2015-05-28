function leran(something){
	console.log(something);
}

function we(callback, something){
	something += " is cool";
	callback(something);
}

we(leran, "nodejs");