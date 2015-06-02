/**
 * Created with jing.zhao2013
 * Date: 14-3-13
 * Time: 下午4:50
 */
function CountDown(opt){
    if(!opt) opt={};
    this.dom = opt["dom"]?opt["dom"]:null;
    this.totalSecond=opt["totalSecond"]?opt["totalSecond"]:10000;//总时间 s
	this.fn=opt["fn"]?opt["fn"]:null;
    this.auto=opt["auto"]?opt["auto"]:false;//默认:不自动倒计时
    this.zeroFn=opt["zeroFn"]?opt["zeroFn"]:null;
    this.timer=null;
    this.flag=false;
    if(!this.dom||this.totalSecond<0) {
        alert("请设置正确的参数");
        return false;
    }
    var self=this;
    var format=function(t){
        var m=60;
        var min=parseInt(t/m);
        var sec=t-min*m;
        var minute=(min<10)?"0"+min:min;
        var second=(sec<10)?"0"+sec:sec;
        return minute+":"+second;
    };
    self.dom.innerHTML=format(self.totalSecond);
    this.fun=function(){
        if(self.flag) return;
        self.totalSecond--;
        self.dom.innerHTML=format(self.totalSecond);
        if(self.fn){
            self.fn();
        }
        if(self.totalSecond<=0){
            self.flag=true;
            clearInterval(self.timer);
            if(self.zeroFn){
                self.zeroFn();
            }
        }
    };
    if(self.auto){
        this.timer=setInterval(self.fun,1000);
    }
}
CountDown.prototype.stop=function(){
    var self = this;
    self.flag=true;
    clearInterval(self.timer);
};
CountDown.prototype.start=function(){
    var self = this;
    if(self.totalSecond<=0){
        return false;
    }
    if(self.flag){
        self.flag=false;
        this.timer=setInterval(self.fun,1000);
    }

};