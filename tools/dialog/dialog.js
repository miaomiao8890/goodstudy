/**
 * Created with jing.zhao2013
 * Date: 13-11-28
 * Time: 上午10:40
 *    {
 *      cls: "",           //自定义的class样式
 *      closeCls:"",       //关闭按钮的鼠标滑class样式
 *      open:true,         //是否为打开状态
 *      isModal:false,     //是否模态窗口
 *      isDrag:false      //是否可拖动
 *    }
 */
(function($){$.fn.extend({"dialog":function(options){
    var ops = $.extend({
        cls: "",
        closeCls:"",
        open:true,
        isModal:false,
        isDrag:false,
        btn:[]
    },options);
    var $dom = $(this),
        $shadow = $("<div style='-moz-opacity:0.25;opacity:0.25;filter:alpha(opacity=25);position:absolute;border:none;background:#000;top:0;left:0;z-index:9999;display:none;'></div>"),
        $win = $(window);
    if(!$dom.get(0)) return;
    var dialog = {
        render:function(){
            $dom.addClass(ops.cls);
            $dom.css("z-index","10000");
            if(ops.isModal){
                this.showShadow();
            }
            if(!ops.open){
                $dom.hide();
                if(ops.isModal){$shadow.hide();}
            }
            var $close = $dom.find(".dialog-close-button");
            if($close.get(0)){
                $close.bind({
                    'click':function(e){if(ops.isModal){$shadow.hide();}$dom.hide();e.stopPropagation();},
                    'mouseover':function(e){$(this).addClass(ops.closeCls);e.stopPropagation();},
                    'mouseout':function(){ $(this).removeClass(ops.closeCls);},
                    'mousedown':function(e){e.stopPropagation();}
                });
            }
            if(ops.isDrag){
                this.dragndrop();
            }
        },
        showShadow:function(){
            var h = Math.max($win.innerHeight(),$("body").innerHeight());
            var w = Math.max($win.innerWidth(),$("body").innerWidth());
            $shadow.css({height:h,width:w});
            $("body").append($shadow);
        },
        dragndrop:function(){
            var $title = $dom.find(".dialog-top");
            var startX,startY,startLeft,startTop,dragging = false;
            var maxLeft = $win.innerWidth()-$dom.outerWidth();
            var maxTop = $win.innerHeight()-$dom.outerHeight();
            var fn={
                down:function(e){
                    dragging = true;
                    $title.css('cursor','move');
                    startX = e.pageX;
                    startY = e.pageY;
                    startLeft=$dom.offset().left;
                    startTop=$dom.offset().top;
                    e.stopPropagation();
                },
                drag:function(e){
                    if(!dragging) return;
                    var l = Math.min(startLeft + e.pageX - startX,maxLeft);
                    var t = Math.min(startTop + e.pageY - startY,maxTop);
                    $dom.css({left:Math.max(0,l),top:Math.max(0,t)});
                },
                drop:function(){
                    dragging = false;
                    $title.css('cursor','default');
                }
            };
            $title.bind({
                'mousedown':fn.down,
                'mouseover':fn.drag,
                'mouseup':fn.drop
            });
            $(document).bind({
                'mousemove':fn.drag,
                'mouseup':fn.drop
            });
        },
        btnEvent:function(){
            var btn = ops.btn;
            var l = btn.length;
            for(var i=0;i<l;i++){
                if(btn[i].ele&&btn[i].fn){
                    btn[i].ele.click(btn[i].fn);
                }
            }
        },
        init:function(){
            var self = this;
            this.render();
            if(ops.isDrag){
                $win.resize(function(){
                    self.dragndrop();
                });
            }
            if(ops.isModal){
                $win.resize(function(){
                    self.showShadow();
                });
            }
            if(ops.btn.length){
                self.btnEvent();
            }
        }
    };
    var handler={
        close:function(){
            if(ops.isModal){
                $shadow.hide();
            }
            $dom.hide();
        },
        open:function(str){
            if(ops.isModal){
                $shadow.show();
            }
            if(str){
                $dom.find(".dialog-body").html(str)
            }
            $dom.show();
        },
        setPosition:function(style){
            $dom.css(style);
        }
    };
    dialog.init();
    return handler;
}})})(jQuery);