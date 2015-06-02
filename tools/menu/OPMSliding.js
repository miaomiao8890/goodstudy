/**
 * Created by zhaojing on 2014/10/20.
 * 依赖zepto.js
 * {
 *     element:dom          //外层dom id
 *     ,distance:300        //每次移动距离
 *     ,containerWidth:300  //容器宽度
 *     ,totalWidth:300          //总宽度
 *     ,speed:250           //移动的时间
 * }
 */
function OPMSliding(opt){
    return (this instanceof OPMSliding)?this.init(opt):new OPMSliding(opt);
}
OPMSliding.prototype.init=function(opt){
	if(opt.totalWidth<opt.containerWidth) return;
    var self=this,$dom,$con,isSupportTouch="ontouchend" in document?true:false,events={};
    events=isSupportTouch?{start:'touchstart',move:'touchmove',end:'touchend'}:{start:'mousedown',move:'mousemove',end:'mouseup'};
    if(!$(opt.element).get(0)){console.log("not found "+opt.element);return false;}
    $dom=$(opt.element);
    $con=$dom.find("ul");
    if(!$con.get(0)){return false;}
    $con.width(opt.totalWidth);
    $con.find("li").show();
    var element=$con[0];
    self.ops = {
        element:element,
        distance:opt.distance?opt.distance:300,
        totalWidth:opt.totalWidth?opt.totalWidth:300,
        containerWidth:opt.containerWidth?opt.containerWidth:300,
        speed:opt.speed?opt.speed:1000,
        events:events
    };
    self.nowX=0;self.tempX=0;self.startX=0;self.startY=0;
    element.addEventListener(events.start,self,false);
};
OPMSliding.prototype._doPlay=function(){
    var self=this;
    var ops=self.ops;
    var totalWidth=ops.totalWidth,
        containerWidth=ops.containerWidth,
        nowX=self.nowX,
        speed=ops.speed;
    if (nowX>0){
        self.nowX=0;
    }else if(nowX<(-totalWidth+containerWidth)){
        self.nowX=-totalWidth+containerWidth;
    }
    self._translate(self.nowX,speed);
};

OPMSliding.prototype._start=function(e){
    var self=this;
    if(self.scrolling) return;
    var tagName = e.target.tagName;
    if (e.type==="mousedown" && tagName !== 'SELECT' && tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'BUTTON') {
        e.preventDefault();
    }
    self.scrolling=true;self.moveReady=false;
    var point=self._getPage(e),events=self.ops.events,element=self.ops.element;
    self.tempX=0;self.tempY=0;self.startX=point.pageX;self.startY=point.pageY;
    //添加move,end事件监听
    element.addEventListener(events.move,self,false);
    document.addEventListener(events.end,self,false);
};
OPMSliding.prototype._move=function(e){
    var self=this;
    if(!self.scrolling)return;
    if(self.ops.isSupportTouch){if(e.touches.length > 1||e.scale&&e.scale !== 1)return;} //多点或缩放
    var point=self._getPage(e),ops=self.ops;
    var pageX = point.pageX,pageY = point.pageY;
    if(self.moveReady){
        e.preventDefault();
        var disX;self.tempX=pageX-self.startX;
        disX=self.tempX+self.nowX;
        if(disX>0){
            disX=0;
        }else if(disX<(-self.ops.totalWidth+self.ops.containerWidth)){
            disX=-self.ops.totalWidth+self.ops.containerWidth;
        }
        self._translate(disX,0);
    }else{
        var x=Math.abs(self.startX-pageX),y=Math.abs(self.startY-pageY);
        var z=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        var a=180/(Math.PI/Math.acos(y/z));
        if (z > 5) {
            if (a > 55) {
                e.preventDefault();
                self.moveReady = true;
                ops.element.addEventListener('click',self,false);
            }else {
                self.scrolling = false;
            }
        }
    }
};
OPMSliding.prototype._end=function(e){
    e.stopPropagation();
    var self=this;
    var ops=self.ops;
    if (!self.scrolling)  return;
    self.nowX+=self.tempX;
    self.scrolling = false;
    self.moveReady = false;
    setTimeout(function() {
        ops.element.removeEventListener('click', self, false);
    }, 200);
    self._doPlay();
    ops.element.removeEventListener(ops.events.move,self,false);
    document.removeEventListener(ops.events.end,self,false);
};
OPMSliding.prototype._click=function(e){
    e.preventDefault();
    e.stopPropagation();
};
OPMSliding.prototype._getPage=function(e){
    return e.changedTouches?e.changedTouches[0]:e;
};
OPMSliding.prototype._translate=function(dist,speed){
    var style=this.ops.element.style;
    style.webkitTransitionDuration=style.MozTransitionDuration=style.msTransitionDuration=style.OTransitionDuration=style.transitionDuration = speed+'ms';
    style.webkitTransform=style.MozTransform='translate('+dist+'px,0)'+'translateZ(0)';
};
OPMSliding.prototype.handleEvent=function(event){
    var self = this;
    var events=self.ops.events;
    switch (event.type) {
        case events.start:self._start(event); break;
        case events.move:self._move(event); break;
        case events.end:self._end(event); break;
        case 'click': self._click(event); break;
    }
};
OPMSliding.prototype.toNext=function(){
    var self=this;
    self.nowX-=self.ops.distance;
    self._doPlay();
};
OPMSliding.prototype.toPre=function(){
    var self=this;
    self.nowX+=self.ops.distance;
    self._doPlay();
};