/**
 * Created by zhaojing.
 * Date: 13-2-22
 *  参数：
 *    {
 *      width:500,            //（可选）宽度，默认500
 *      height:300,           //（可选）高度，默认300
 *      page:true,            //（可选）是否有下标，默认true
 *      pageContent:[],       //（可选）下标内容
 *      circle:false,         //（可选）默认为false，是否自动轮换
 *      speed:1               //（可选）自动轮换速度
 *    }
 */

(function($){$.fn.extend({"slideBox":function(options){
    var ops=$.extend({
        width:500,
        height:300,
        page:true,
        pageContent:[],
        circle:false,
        speed:1
    }, options);
    var $dom = $(this);
    if(!$dom.get(0)) return;
    var $content=$dom.find(".slideBox-content");
    if(!$content.get(0)) return;
    var $page=$dom.find(".slideBox-page");
    var index= 0,stop=true;
    var opr = {
        render:function(){
            $dom.css({'width':ops.width,'height':ops.height});
            $dom.addClass("pv-slideBox");
            $content.find("li").css({'width':ops.width,'height':ops.height});
            $content.find("img").width(ops.width);
        },
        showPage:function(){
            var page=["<ul class='pv-slideBox-page'>"];
            var $li=$content.find("li");
            var len = $li.length;
            if($page.get(0)){
                var $pImg = $page.find("li");
                for(var i=0;i<len;i++){
                    if($pImg[i]){
                        page.push('<li>' +$($pImg[i]).html()+'</li>');
                    }else{
                        page.push('<li><span class="pv-i">' +(i+1)+'</span></li>');
                    }
                }
            }else{
                var pageContent=ops.pageContent;
                for(var i=0;i<len;i++){
                    if(pageContent&&pageContent[i]){
                        page.push('<li><span>'+pageContent[i]+'</span></li>');
                    }else{
                        page.push('<li><span>'+(i+1)+'</span></li>');
                    }
                }
            }
            page.push("</ul>");
            $dom.append(page.join(""));
            var $myPage = $dom.find(".pv-slideBox-page");
            var $myPageLi = $myPage.find("li");
            $myPageLi.eq(index).addClass("pv-slideBox-current-page").stop(true,true).fadeTo(400,1).siblings().removeClass("pv-slideBox-current-page").fadeTo(400,0.5);
            $myPage.on("mouseover","li",function(){
                stop=false;
                index=$myPageLi.index($(this));
                $li.eq(index).stop(true,true).fadeIn().siblings().fadeOut();
                $(this).addClass("pv-slideBox-current-page").stop(true,true).fadeTo(400,1).siblings()
                    .removeClass("pv-slideBox-current-page").fadeTo(400,0.5);
            });
            $myPage.on("mouseout","li",function(){
                stop=true;
            });
        },
        autoCircle:function(){
            var $li=$content.find("li");
            var len = $li.length;
            var $myPage = $dom.find(".pv-slideBox-page");
            setInterval(function(){
                if(!stop) return;
                index++;
                if(index>=len){
                    index=0;
                }
                $li.eq(index).stop(true,true).fadeIn().siblings().fadeOut();
                if(ops.page){
                    $myPage.find("li").eq(index).addClass("pv-slideBox-current-page").stop(true,true).fadeTo(400,1).siblings()
                        .removeClass("pv-slideBox-current-page").fadeTo(400,0.5);
                }
            },ops.speed*1000);
        },
        init:function(){
            this.render();
            if(ops.page){
                this.showPage();
            }
            if(ops.circle){
                this.autoCircle();
            }
        }
    };
    opr.init();
    return $dom;
}})})(jQuery);
