$(function(){
	var canvas = $("#myCanvas");
	var context = canvas.get(0).getContext("2d");

	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();

	$(window).resize(resizeCanvas);

	function resizeCanvas(){
		canvas.attr("width",$(window).get(0).innerWidth);
		canvas.attr("height",$(window).get(0).innerHeight);
		canvasWidth = canvas.width();
		canvasHeight = canvas.height();
	}

	resizeCanvas();

	var playAnimation = true;
	var startBtn = $("#startAnimation");
	var stopBtn = $("#stopAnimation");

	startBtn.hide();
	startBtn.click(function(){
		$(this).hide();
		stopBtn.show();
		playAnimation = true;
		animate();
	});

	stopBtn.click(function(){
		$(this).hide();
		startBtn.show();
		playAnimation = false;
	});

	var Asteroid = function(x, y, radius, vX, vY, aX, aY){
		this.x = x;
		this.y = y;
		this.radius = radius;

		this.vX = vX;
		this.vY = vY;
		this.aX = aX;
		this.aY = aY;
	}

	var asteroids = new Array();

	//构造不同大小的小行星
	for (var i = 0; i < 10; i++){
		var x = 20 + (Math.random() * (canvasWidth - 40));
		var y = 20 + (Math.random() * (canvasHeight - 40));
		var radius = 5 + Math.random() * 10;
		//速度
		var vX = Math.random()*4-2;
		var vY = Math.random()*4-2;

		//加速度
		var aX = Math.random()*0.2-0.1;
		var aY = Math.random()*0.2-0.1;

		asteroids.push(new Asteroid(x, y, radius, vX, vY, aX, aY));
	}

	function animate(){
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.fillStyle = "rgb(255, 255, 255)";

		var asteroidsLength = asteroids.length;
		for (var i = 0; i < asteroidsLength; i++) {
			var tmpAsteroid = asteroids[i];

			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY;

			//摩擦力
			// if(Math.abs(tmpAsteroid.vX) > 0.1){
			// 	tmpAsteroid.vX *= 0.9;
			// }else{
			// 	tmpAsteroid.vX = 0;
			// }
			// if(Math.abs(tmpAsteroid.vY) > 0.1){
			// 	tmpAsteroid.vY *= 0.9;
			// }else{
			// 	tmpAsteroid.vY = 0;
			// }

			//最大速度
			// if(Math.abs(tmpAsteroid.vX) < 10){
			// 	tmpAsteroid.vX += tmpAsteroid.aX;
			// }
			// if(Math.abs(tmpAsteroid.vY) < 10){
			// 	tmpAsteroid.vY += tmpAsteroid.aY;
			// }

			//边界判断
			if(tmpAsteroid.x-tmpAsteroid.radius < 0){
				tmpAsteroid.x = tmpAsteroid.radius;
				tmpAsteroid.vX *= -1;
				tmpAsteroid.aX *= -1;
			}else if(tmpAsteroid.x+tmpAsteroid.radius > canvasWidth){
				tmpAsteroid.x = canvasWidth-tmpAsteroid.radius;
				tmpAsteroid.vX *= -1
				tmpAsteroid.aX *= -1
			}
			if(tmpAsteroid.y-tmpAsteroid.radius < 0){
				tmpAsteroid.y = tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1;
			}else if(tmpAsteroid.y+tmpAsteroid.radius > canvasHeight){
				tmpAsteroid.y = canvasHeight-tmpAsteroid.radius;
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1
			}

			context.beginPath();
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI*2, false);
			context.closePath();
			context.fill();
		}

		if(playAnimation){
			setTimeout(animate,33);
		}
	}

	animate();
});