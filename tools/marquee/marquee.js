/**
 * Created with jing.zhao2013
 * Date: 14-3-12
 * Time: 下午1:35
 */
(function($){$.fn.extend({
    "marquee":function(options){
        var ops = $.extend({
            width:200,
            speed:1
        },options);
        var $dom=this;
        var $ul=$dom.find("ul");
        var timer=null, sw = ops.width*$ul.find("li").length,w=$dom.innerWidth();
        $ul.width(sw);
        var opr = {
            scroll:function(){
                var l = $dom.scrollLeft();
                $dom.scrollLeft(l+1);
                if($dom.scrollLeft()>=sw){
                    $dom.scrollLeft(0);
                }
            },
            init:function(){
                if(sw<=w) return false;
                $ul.append($ul.children().clone()).css('width',sw*2);
                var self = this;
                timer=setInterval(self.scroll,ops.speed*10);
                $dom.hover(
                    function () {
                        clearInterval(timer);
                    },
                    function () {
                        timer=setInterval(self.scroll,ops.speed*10);
                    }
                );
            }
        };
        opr.init();
    }
})})(jQuery);