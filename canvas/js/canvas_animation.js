/**
 * Created by chi.sun
 *    {
 *      canvasBox: null,        //canvas元素
 *      isAutoPlay: null,       //是否自动播放
 *    }
 */

function CanvasAnimation(options){
	this.options = {
		canvasBox: "",
		isAutoPlay: true,
	}
	for ( var i in options ) {
        this.options[i] = options[i];
    }
	this.canvas = $(this.options.canvasBox);
	this.context = this.canvas.get(0).getContext("2d");

	this.canvasWidth = this.canvas.width();
	this.canvasHeight = this.canvas.height();

	this.playAnimation = this.options.isAutoPlay;
	//正在执行的动画
	this.curAnimation = null;

	this.init();
}

CanvasAnimation.prototype = {
	//按钮初始化
	init: function(){
		var _this = this;

		var startBtn = $("#startAnimation");
		var stopBtn = $("#stopAnimation");

		startBtn.hide();

		startBtn.click(function(){
			$(this).hide();
			stopBtn.show();
			_this.playAnimation = true;
			_this.curAnimation();
		});

		stopBtn.click(function(){
			$(this).hide();
			startBtn.show();

			_this.playAnimation = false;
		});
	},
	//圆周动画
	circleAnimate: function(){
		var _this = this;
		_this.context.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);

		//图形构造函数
		var Shape = function(x, y , width, height){
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;

			//半径
			this.radius = Math.random() * 30;
			//移动角度
			this.angle = 0;
		}

		var shapes = new Array();

		//构造随机大小图形
		for ( var i = 0; i < 10; i++ ){
			var x = Math.random() * 250;
			var y = Math.random() * 250;
			var width = height = Math.random() * 30;
			shapes.push(new Shape(x, y, width, height));
		}

		function animate(){
			_this.context.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);

			var shapesLength = shapes.length;
			for(var i = 0; i < shapesLength; i++){
				var tmpShape = shapes[i];

				//圆周运动公式
				var x = tmpShape.x + (tmpShape.radius*Math.cos(tmpShape.angle*(Math.PI/180)));
				var y = tmpShape.y + (tmpShape.radius*Math.sin(tmpShape.angle*(Math.PI/180)));
				tmpShape.angle += 5;
				if(tmpShape.angle > 360){
					tmpShape.angle = 0;
				}
				_this.context.fillRect(x, y, tmpShape.width, tmpShape.height);
			}
			if(_this.playAnimation){
				setTimeout(animate, 33);
			}
		}

		if(_this.playAnimation){
			animate();
			_this.curAnimation = animate;
		}
	}
}