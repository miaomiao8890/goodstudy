function onePageScroll(a, b) {
    var c = {sectionContainer: "section", easing: "ease", animationTime: 1e3, pagination: !0, updateURL: !1, keyboard: !0, beforeMove: null, afterMove: null, loop: !1, responsiveFallback: !1}, d = Object.extend({}, c, b), e = document.querySelector(a), f = document.querySelectorAll(d.sectionContainer), g = f.length, h = 0, i = 0, j = 500, k = "", l = document.querySelector("body");
    this.init = function () {
        _addClass(e, "onepage-wrapper"), e.style.position = "relative";
        for (var a = 0; a < f.length; a++)_addClass(f[a], "ops-section"), f[a].dataset.index = a + 1, h += 100, 1 == d.pagination && (k += "<li><a data-index='" + (a + 1) + "' href='#" + (a + 1) + "'></a></li>");
        if (_swipeEvents(e), document.addEventListener("swipeDown", function (a) {
            _hasClass(l, "disabled-onepage-scroll") || a.preventDefault(), moveUp(e)
        }), document.addEventListener("swipeUp", function (a) {
            _hasClass(l, "disabled-onepage-scroll") || a.preventDefault(), moveDown(e)
        }), 1 == d.pagination) {
            var b = document.createElement("ul");
            b.setAttribute("class", "onepage-pagination"), l.appendChild(b), b.innerHTML = k;
            var c = document.querySelector(".onepage-pagination").offsetHeight / 2 * -1;
            document.querySelector(".onepage-pagination").style.marginTop = c
        }
        if ("" != window.location.hash && "#1" != window.location.hash) {
            var g = window.location.hash.replace("#", ""), i = document.querySelector(d.sectionContainer + "[data-index='" + g + "']"), j = i.dataset.index;
            if (_addClass(document.querySelector(d.sectionContainer + "[data-index='" + g + "']"), "active"), _addClass(l, "viewing-page-" + g), 1 == d.pagination && _addClass(document.querySelector(".onepage-pagination li a[data-index='" + g + "']"), "active"), i && (_addClass(i, "active"), 1 == d.pagination && _addClass(document.querySelector(".onepage-pagination li a[data-index='" + g + "']"), "active"), l.className = l.className.replace(/\bviewing-page-\d.*?\b/g, ""), _addClass(l, "viewing-page-" + j), history.replaceState && 1 == d.updateURL)) {
                var m = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + g;
                history.pushState({}, document.title, m)
            }
            var n = 100 * (g - 1) * -1;
            _transformPage(e, d, n, g)
        } else _addClass(document.querySelector(d.sectionContainer + "[data-index='1']"), "active"), _addClass(l, "viewing-page-1"), 1 == d.pagination && _addClass(document.querySelector(".onepage-pagination li a[data-index='1']"), "active");
        if (_paginationHandler = function () {
            var a = this.dataset.index;
            moveTo(e, a)
        }, 1 == d.pagination)for (var o = document.querySelectorAll(".onepage-pagination li a"), a = 0; a < o.length; a++)o[a].addEventListener("click", _paginationHandler);
        return _mouseWheelHandler = function (a) {
            a.preventDefault();
            var b = a.wheelDelta || -a.detail;
            _hasClass(l, "disabled-onepage-scroll") || _init_scroll(a, b)
        }, document.addEventListener("mousewheel", _mouseWheelHandler), document.addEventListener("DOMMouseScroll", _mouseWheelHandler), 0 != d.responsiveFallback && (window.onresize = function () {
            _responsive()
        }, _responsive()), _keydownHandler = function (a) {
            var b = a.target.tagName.toLowerCase();
            if (!_hasClass(l, "disabled-onepage-scroll"))switch (a.which) {
                case 38:
                    "input" != b && "textarea" != b && moveUp(e);
                    break;
                case 40:
                    "input" != b && "textarea" != b && moveDown(e);
                    break;
                default:
                    return
            }
            return!1
        }, 1 == d.keyboard && (document.onkeydown = _keydownHandler), !1
    }, _swipeEvents = function () {
        function a(a) {
            var e = a.touches;
            e && e.length && (c = e[0].pageX, d = e[0].pageY, document.addEventListener("touchmove", b))
        }

        function b(a) {
            var e = a.touches;
            if (e && e.length) {
                a.preventDefault();
                var f = c - e[0].pageX, g = d - e[0].pageY;
                if (f >= 50) {
                    var a = new Event("swipeLeft");
                    document.dispatchEvent(a)
                }
                if (-50 >= f) {
                    var a = new Event("swipeRight");
                    document.dispatchEvent(a)
                }
                if (g >= 50) {
                    var a = new Event("swipeUp");
                    document.dispatchEvent(a)
                }
                if (-50 >= g) {
                    var a = new Event("swipeDown");
                    document.dispatchEvent(a)
                }
                (Math.abs(f) >= 50 || Math.abs(g) >= 50) && document.removeEventListener("touchmove", b)
            }
        }

        var c, d;
        document.addEventListener("touchstart", a)
    }, _trim = function (a) {
        return a.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    }, _hasClass = function (a, b) {
        return a.className ? a.className.match(new RegExp("(\\s|^)" + b + "(\\s|$)")) : a.className = b
    }, _addClass = function (a, b) {
        _hasClass(a, b) || (a.className += " " + b), a.className = _trim(a.className)
    }, _removeClass = function (a, b) {
        if (_hasClass(a, b)) {
            var c = new RegExp("(\\s|^)" + b + "(\\s|$)");
            a.className = a.className.replace(c, " ")
        }
        a.className = _trim(a.className)
    }, _whichTransitionEvent = function () {
        var a, b = document.createElement("fakeelement"), c = {transition: "transitionend", OTransition: "oTransitionEnd", MozTransition: "transitionend", WebkitTransition: "webkitTransitionEnd"};
        for (a in c)if (void 0 !== b.style[a])return c[a]
    }, _scrollTo = function (a, b, c) {
        if (!(0 > c)) {
            var d = b - a.scrollTop, e = d / c * 10;
            setTimeout(function () {
                a.scrollTop = a.scrollTop + e, a.scrollTop != b && _scrollTo(a, b, c - 10)
            }, 10)
        }
    }, _transformPage = function (a, b, c, d, e) {
        function f() {
            "function" == typeof b.afterMove && b.afterMove(d, e), a.removeEventListener(h, f)
        }

        "function" == typeof b.beforeMove && b.beforeMove(d, e);
        var g = "-webkit-transform: translate3d(0, " + c + "%, 0); -webkit-transition: -webkit-transform " + b.animationTime + "ms " + b.easing + "; -moz-transform: translate3d(0, " + c + "%, 0); -moz-transition: -moz-transform " + b.animationTime + "ms " + b.easing + "; -ms-transform: translate3d(0, " + c + "%, 0); -ms-transition: -ms-transform " + b.animationTime + "ms " + b.easing + "; transform: translate3d(0, " + c + "%, 0); transition: transform " + b.animationTime + "ms " + b.easing + ";";
        a.style.cssText = g;
        var h = _whichTransitionEvent();
        a.addEventListener(h, f, !1)
    }, _responsive = function () {
        document.body.clientWidth < d.responsiveFallback ? (_addClass(l, "disabled-onepage-scroll"), document.removeEventListener("mousewheel", _mouseWheelHandler), document.removeEventListener("DOMMouseScroll", _mouseWheelHandler), _swipeEvents(e), document.removeEventListener("swipeDown"), document.removeEventListener("swipeUp")) : (_hasClass(l, "disabled-onepage-scroll") && (_removeClass(l, "disabled-onepage-scroll"), _scrollTo(document.documentElement, 0, 2e3)), _swipeEvents(e), document.addEventListener("swipeDown", function (a) {
            _hasClass(l, "disabled-onepage-scroll") || a.preventDefault(), moveUp(e)
        }), document.addEventListener("swipeUp", function (a) {
            _hasClass(l, "disabled-onepage-scroll") || a.preventDefault(), moveDown(e)
        }), document.addEventListener("mousewheel", _mouseWheelHandler), document.addEventListener("DOMMouseScroll", _mouseWheelHandler))
    }, _init_scroll = function (a, b) {
        var c = b, f = (new Date).getTime();
        return f - i < j + d.animationTime ? void a.preventDefault() : (0 > c ? moveDown(e) : moveUp(e), void(i = f))
    }, this.moveDown = function (a) {
        "string" == typeof a && (a = document.querySelector(a));
        var b = document.querySelector(d.sectionContainer + ".active").dataset.index, c = document.querySelector(d.sectionContainer + "[data-index='" + b + "']"), e = document.querySelector(d.sectionContainer + "[data-index='" + (parseInt(b) + 1) + "']");
        if (e)pos = 100 * b * -1; else {
            if (1 != d.loop)return;
            pos = 0, e = document.querySelector(d.sectionContainer + "[data-index='1']")
        }
        var f = e.dataset.index;
        if (_removeClass(c, "active"), _addClass(e, "active"), 1 == d.pagination && (_removeClass(document.querySelector(".onepage-pagination li a[data-index='" + b + "']"), "active"), _addClass(document.querySelector(".onepage-pagination li a[data-index='" + f + "']"), "active")), l.className = l.className.replace(/\bviewing-page-\d.*?\b/g, ""), _addClass(l, "viewing-page-" + f), history.replaceState && 1 == d.updateURL) {
            var g = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + (parseInt(b) + 1);
            history.pushState({}, document.title, g)
        }
        _transformPage(a, d, pos, f, e)
    }, this.moveUp = function (a) {
        "string" == typeof a && (a = document.querySelector(a));
        var b = document.querySelector(d.sectionContainer + ".active").dataset.index, c = document.querySelector(d.sectionContainer + "[data-index='" + b + "']"), e = document.querySelector(d.sectionContainer + "[data-index='" + (parseInt(b) - 1) + "']");
        if (e)pos = 100 * (e.dataset.index - 1) * -1; else {
            if (1 != d.loop)return;
            pos = 100 * (g - 1) * -1, e = document.querySelector(d.sectionContainer + "[data-index='" + g + "']")
        }
        var f = e.dataset.index;
        if (_removeClass(c, "active"), _addClass(e, "active"), 1 == d.pagination && (_removeClass(document.querySelector(".onepage-pagination li a[data-index='" + b + "']"), "active"), _addClass(document.querySelector(".onepage-pagination li a[data-index='" + f + "']"), "active")), l.className = l.className.replace(/\bviewing-page-\d.*?\b/g, ""), _addClass(l, "viewing-page-" + f), history.replaceState && 1 == d.updateURL) {
            var h = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + (parseInt(b) - 1);
            history.pushState({}, document.title, h)
        }
        _transformPage(a, d, pos, f, e)
    }, this.moveTo = function (a, b) {
        "string" == typeof a && (a = document.querySelector(a));
        var c = document.querySelector(d.sectionContainer + ".active"), e = document.querySelector(d.sectionContainer + "[data-index='" + b + "']");
        if (e) {
            var f = e.dataset.index;
            if (_removeClass(c, "active"), _addClass(e, "active"), _removeClass(document.querySelector(".onepage-pagination li a.active"), "active"), _addClass(document.querySelector(".onepage-pagination li a[data-index='" + b + "']"), "active"), l.className = l.className.replace(/\bviewing-page-\d.*?\b/g, ""), _addClass(l, "viewing-page-" + f), pos = 100 * (b - 1) * -1, history.replaceState && 1 == d.updateURL) {
                var g = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + (parseInt(b) - 1);
                history.pushState({}, document.title, g)
            }
            _transformPage(a, d, pos, b, e)
        }
    }, this.init()
}
Object.extend = function (a) {
    if (null == a)return a;
    for (var b = 1; b < arguments.length; b++) {
        var c = arguments[b];
        if (null != c)for (var d in c) {
            var e = c.__lookupGetter__(d), f = c.__lookupSetter__(d);
            e || f ? (e && a.__defineGetter__(d, e), f && a.__defineSetter__(d, f)) : a[d] = c[d]
        }
    }
    return a
};