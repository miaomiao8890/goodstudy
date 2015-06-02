/**
 * Created with jing.zhao
 * Date: 13-5-3
 * Time: 上午11:37
 *                                          为了兼容ie6
 * 参数：
 *    {
 *      isBack:true,      //（可选）是否回顶部功能，默认为true
 *      goBack:false,     //（可选）是否返回上一页，默认为false。goback与isback同时为true时优先实现回顶部
 *      scrollTop:0,      //（可选）滚动条高度多少开始出现
 *      position:"auto",  //（可选）position为位置信息，内容的左边或者右边
 *      width:1000,       //（可选）距离网页内容模块的宽度
 *      offset:5,         //（可选）距离网页内容模块间距
 *      bottom:"auto"     //（可选）距离底部距离
 *    }
 */
(function($){$.fn.extend({"backBtn":function(options){
    var ops=$.extend({
        isBack:true,
        goBack:false,
        scrollTop:0,
        position:"auto",
        width:1000,
        offset:5,
        bottom:"auto",
        speed:100,
        ifshow:true
    }, options);
    var $dom=$(this),$doc=$(document),$win = $(window);
    if(!$dom.get(0)) return;
    var opr={
        getTop:function(){
            var t = $dom.offset().top;
            if(ops.bottom!="auto"){
                t = $win.height()-$dom.height()-ops.bottom;
            }
            return t;
        },
        getLeft:function(){
            var l = $dom.offset().left;
            var w = $dom.outerWidth();
            var ww = $win.width();
            var minw = ops.width+(ops.offset+w)*2;
            if(ops.position=="left"){
                if(ww>minw){
                    l = (ww-ops.width)/2-w-ops.offset;
                }else{
                    l=0;
                }
            }else if(ops.position=="right"){
                if(ww>minw){
                    l = (ww-ops.width)/2+ops.width+ops.offset;
                }else{
                    l=ww-w;
                }
            }
            return l;
        },
        ifShow:function(){
            if($win.scrollTop()>ops.scrollTop){
                $dom.show();
            }else{
                $dom.hide();
            }
        },
        setTop:function(){
            var t = this.getTop();
            var l = this.getLeft();
            if($.browser.msie&&$.browser.version==="6.0"){
                t = $doc.scrollTop()+t;
                if(t>$doc.height()){
                    t=$doc.height()-ops.bottom-$dom.outerWidth();
                }
                $dom.css({position:"absolute",top:t,left:l});
            }else{
                $dom.css("position","fixed");
                if($dom.css("left")!=l+"px"){
                    $dom.css("left",l);
                }
                if($dom.css("top")!=t+"px"){
                    $dom.css("top",t);
                }
            }
        },
        handler:function(){
            if(ops.isBack){
                $dom.click(function(){
                    $("body,html").animate({scrollTop:0},ops.speed);
                    if(ops.scrollTop>0){
                        $dom.hide();
                    }
                });
            }else if(ops.goBack){
                $dom.click(function(){
                    history.go(-1);
                });
            }
            var self = this;
            self.setTop();
            if(!ops.ifshow){
                self.ifShow();
            }
            $win.scroll(function(){
                if($.browser.msie&&$.browser.version==="6.0"){
                    self.setTop();
                }
                if(!ops.ifshow){
                    self.ifShow();
                }
            });
            $win.resize(function(){
                self.setTop();
                if(!ops.ifshow){
                    self.ifShow();
                }
            });
        }
    };
    opr.handler();
    return $dom;
}})})(jQuery);