/**
 * Created with jing.zhao2013
 * Date: 13-4-19
 * Time: 下午4:05
 */
(function($){$.fn.extend({"selfTabs":function(opt){
    var options= $.extend({event:"mouseover"},opt);
    var event = options.event;
    var $dom = $(this);
    if(!$dom.get(0)) return;
    var selfTabs={
        init:function(){
            var $li=$dom.find(".tabs-title").find("li");
            $li.bind(event,function(){
                var $ul=$(this).parent();
                var _class = $(this).attr("name");
                if(!_class) return;
                $ul.find("li").removeClass("on");
                var _dom = $ul.parent();
                _dom.find(".tabs-content").children().hide();
                $(this).addClass("on");
                _dom.find(_class).show();
            })
        }
    };
    selfTabs.init();
    return $dom;
}})})(jQuery);