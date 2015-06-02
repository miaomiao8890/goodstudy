/**
 * Created by chi.sun
 * Date: 15-5-21
 *    {
 *      screenWidth: null,        //屏幕宽度
 *      sliderOuter: null,        //最外层容器
 *      sliderInner: null,        //内层容器
 *      sliderInnerChild: null,   //切换内容容器
 *      btnClick: true,           //是否可点击tab
 *      sliderOuter: null,        //tab按钮父容器
 *      btnClickClass : ''        //tab按钮class
 *    }
 */

function slider(options){
    this.options = {
        screenWidth : null ,
        sliderOuter : null,
        sliderInner : null ,
        sliderInnerChild : null ,
        btnClick :true ,
        btnClickDom : null ,
        btnClickClass : ''                             
    };
    for ( var i in options ) {
        this.options[i] = options[i];
    };
    this.sliderInnerLen = this.options.sliderOuter.find(this.options.sliderInnerChild).length;
    this._init();
};

slider.prototype={
    _init: function(){
        var _this = this ;
        var InnerW = _this.options.screenWidth * _this.sliderInnerLen;
        _this.options.sliderOuter.find(this.options.sliderInnerChild).each(function () {
            $(this).css({'left': $(this).index() * _this.options.screenWidth,'width': _this.options.screenWidth});
        });
        _this.options.sliderInner.width(InnerW);
        _this.options.sliderOuter.width(_this.options.screenWidth);
        _this.options.sliderOuter.find(_this.options.sliderInnerChild).eq(0).addClass('slideon');
        if(_this.options.btnClick){// 是否点击切换窗口
            _this._btnClick();
        };
        _this._slider();
    },
    _btnClick: function(){//点击header里按钮切换；
        var _this = this ;
        if (_this.options.btnClickDom) {
            _this.options.btnClickDom.on('click', function (e) {
                var btnIndex = $(this).index();
                if($(this).hasClass(_this.options.btnClickClass)) return;
                $(this).siblings().removeClass(_this.options.btnClickClass);
                $(this).addClass(_this.options.btnClickClass);
                _this.options.sliderOuter.find(_this.options.sliderInner).css('-webkit-transform','translate3d('+(-_this.options.screenWidth *btnIndex)+'px,0,0) ');
                _this.options.sliderInnerChild.eq(btnIndex).addClass('slideon').siblings().removeClass('slideon');
                e.preventDefault();
            })
        }
    },
    _slider: function(){
        var _this = this;
        _this.options.sliderOuter.on('touchstart', _start);
        var startPos=null, endPos=null;
        function _start(e) {
            e = event || window.event;
            var touch = e.touches[0]; // 取第一个touch的坐标值
            startPos = {
                x: touch.pageX,
                y: touch.pageY,
                time: +new Date()
            };
            endPos = {x:0,y:0};
            _this.options.sliderOuter.on('touchmove', _move);
            _this.options.sliderOuter.on('touchend', _end);

            e.preventDefault();
        };
        function _move(e){
            if (event.touches.length > 1 || event.scale && event.scale !== 1) return;
            var touch = event.touches[0];

            endPos = {
                x: touch.pageX - startPos.x,
                y: touch.pageY - startPos.y

            };
            e.preventDefault();
        };
        function _end(e){
            var curindex =  _this.options.sliderOuter.find('.slideon').index() ;
            var duration = +new Date() - startPos.time;// 滑动的持续时间
            var ml;
            if (Number(duration) > 130 && endPos.y < 35 &&endPos.y > -35) {
                if (endPos.x > 25) {
                    if (curindex == 0) {
                        e.stopPropagation();
                    } else {
                        ml = _this.options.screenWidth * (curindex - 1);
                        _this.options.sliderOuter.find(_this.options.sliderInner).css('-webkit-transform','translate3d('+(-ml)+'px,0,0) ');
                        _this.options.sliderInnerChild.eq(curindex).removeClass('slideon');
                        _this.options.sliderInnerChild.eq(curindex-1).addClass('slideon');
                        if (_this.options.btnClick) {
                            _this.options.btnClickDom.removeClass(_this.options.btnClickClass);
                            _this.options.btnClickDom.eq(curindex - 1).addClass(_this.options.btnClickClass);
                        }
                    }
                } else if (endPos.x < -25) {
                    if (curindex == _this.sliderInnerLen - 1) {
                        e.stopPropagation();
                    } else {
                        ml = _this.options.screenWidth * (curindex + 1);
                        _this.options.sliderOuter.find(_this.options.sliderInner).css('-webkit-transform','translate3d('+(-ml)+'px,0,0) ');
                        _this.options.sliderInnerChild.eq(curindex).removeClass('slideon');
                        _this.options.sliderInnerChild.eq(curindex+1).addClass('slideon');
                        if (_this.options.btnClick) {
                            _this.options.btnClickDom.removeClass(_this.options.btnClickClass);
                            _this.options.btnClickDom.eq(curindex + 1).addClass(_this.options.btnClickClass);
                        }
                    }
                }
            } else if (Number(duration) > 130 && endPos.x < 35 &&endPos.x > -35) {
                if (endPos.y > 10) {
                    _this.options.sliderInnerChild.eq(curindex).css('-webkit-transform','translate3d(0px,'+(-endPos.y)+',0) ');
                }
            }
            _this.options.sliderOuter.off('touchmove', _move);
            _this.options.sliderOuter.off('touchend', _end);
            e.preventDefault();
        }
    }
    
};

