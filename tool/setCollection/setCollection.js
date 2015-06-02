/**
 * Created with jing.zhao2013
 * Date: 13-4-27
 * Time: 下午4:05
 */
(function($){
    $.extend({
        addCollection:function(id){
            var fn=function(){
                var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd': 'CTRL';
                try{
                    if(document.all){
                        window.external.addFavorite(location.href, document.title);
                    }else if(window.sidebar){
                        window.sidebar.addPanel(document.title,location.href,"");
                    }else{
                        alert("加入收藏夹失败，请使用"+ctrl+"+D进行添加");
                    }
                }catch(e){
                    alert("加入收藏夹失败，请使用"+ctrl+"+D进行添加");
                }
            }
            $(id).click(function(){
                fn();
            });
        },
        setFrontPage:function(id){
            var fn=function($dom){
                var url = location.href;
                var browser_name = navigator.userAgent;
                if(browser_name.indexOf('Chrome')!=-1){alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“chrome://settings/browser”，进行主页设置。")};
                try {
                    $dom.style.behavior = "url(#default#homepage)";
                    $dom.setHomePage(url);
                } catch (e) {
                    if (window.netscape) {
                        try {
                            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                        } catch (e) {
                            alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
                            return false;
                        }
                        var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
                        prefs.setCharPref('browser.startup.homepage',url);
                    }
                }
                return false;
            }
            $(id).click(function(){
                fn(this);
            });
        }
    });
})(jQuery);