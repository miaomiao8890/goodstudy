/**
 * Created with jing.zhao2013
 * Date: 13-12-11
 * Time: 下午2:23
 */
(function($){$.fn.extend({"scrolling":function(){
    var $dom = $(this);
    if(!$dom.get(0)) return;
    var t= 0,stop=false;
    var interval=setInterval(function(){
        if(stop) return;
        var $li = $dom.find("li");
        var $first=$li.first();
        var $last=$li.last();
        var h = $last.height();
        $first.animate({"margin-top":t++},0,function(){
            if(!$(this).is(":animated")){
                if(t>h){
                    $(this).css({"margin-top":0});
                    $last.css({"margin-top":0,"display":"none"}).prependTo($dom).fadeIn(1000);
                    t=0;
                }
            }
        });
    },50);
    $dom.mouseover(function(){
        stop=true;
    }).mouseout(function(){
        stop=false;
        interval;
    });
    return $dom;
}})})(jQuery);