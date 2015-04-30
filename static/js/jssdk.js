;(function () {

    var
        /**
         * 空函数
         */
            emptyFun = function () {
        },

        /**
         * 回调函数字典
         */
            requestCallbackMap = {},

        /**
         * 客户端注入的java对象
         */
            OP_BROWSER = "OupengBrowser",

        /**
         * 全局唯一数
         */
            reqId = 0,

        /**
         * 浏览器调用的全局函数名
         */
            dispatchMethodName = null;

    /**
     * 产生唯一数
     */
    function generateReqId() {
        return ++reqId;
    }

    /**
     *    生成命名空间
     */
    function ns(namespace, owner) {
        owner = owner || window;
        var names = namespace.split("."),
            len = names.length,
            i = 0;
        for (; i < len; i++) {
            var pack = names[i];
            owner[pack] = (owner[pack] || {});
            owner = owner[pack];
        }
        return owner;
    }

    /**
     * 绑定func到指定命名上
     */
    function bindFunc(cmd, func) {
        var parts = cmd.split("."),
            last = parts.pop(),
            nsStr = parts.join("."),
            namespace = ns(nsStr);
        namespace[last] = (function (_cmd) {
            return function () {
                var args = [_cmd];
                for (var i = 0, l = arguments.length; i < l; i++) {
                    args.push(arguments[i]);
                }
                return func.apply(this, args);
            }
        })(cmd);
    }

    var escapeMap = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\'
    };

    /**
     * 字符串序列化
     * @private
     */
    function encodeString(source) {
        if (/["\\\x00-\x1f]/.test(source)) {
            source = source.replace(/["\\\x00-\x1f]/g, function (match) {
                var c = escapeMap[match];
                if (c) {
                    return c;
                }
                c = match.charCodeAt();
                return "\\u00" +
                    Math.floor(c / 16).toString(16) +
                    (c % 16).toString(16);
            });
        }
        return ['"', source, '"'].join("");
    }


    /**
     * 数组序列化
     * @private
     */
    function encodeArray(source) {
        var result = ["["], l = source.length, preComma, i, item;
        for (i = 0; i < l; i++) {
            item = source[i];
            switch (typeof item) {
                case "undefined":
                case "function":
                case "unknown":
                    break;
                default:
                    if (preComma) {
                        result.push(',');
                    }
                    result.push(jsonEncode(item));
                    preComma = 1;
            }
        }
        result.push("]");
        return result.join("");
    }

    /**
     * 日期序列化
     * @private
     */
    function encodeDate(source) {
        return ['"', +source, '"'].join("");
    }

    /**
     * json编码，客户端需要全部处理成字符串
     * @param {Object} value
     */
    function jsonEncode(value) {
        switch (typeof value) {
            case 'undefined':
                return '""';
            case 'number':
                return ['"', value, '"'].join("");
            case 'string':
                return encodeString(value);
            case 'boolean':
                return ['"', value, '"'].join("");
            default:
                if (value === null) {
                    return '""';
                }
                else if (value instanceof Array) {
                    return encodeArray(value);
                }
                else if (value instanceof Date) {
                    return encodeDate(value);
                }
                else {
                    var result = ['{'], preComma, item;
                    for (var key in value) {
                        if (value.hasOwnProperty(key)) {
                            item = value[key];
                            switch (typeof item) {
                                case 'undefined':
                                case 'unknown':
                                case 'function':
                                    break;
                                default:
                                    if (preComma) {
                                        result.push(',');
                                    }
                                    preComma = 1;
                                    result.push(jsonEncode(key) + ':' + jsonEncode(item));
                            }
                        }
                    }
                    result.push('}');
                    return result.join('');
                }
        }
    }

    /**
     * 初始化全局函数
     */
    function initDispatcher() {
        if (!dispatchMethodName) {
            dispatchMethodName = "__OP__dispatch";
        }
        window[dispatchMethodName] = {
            syncFunc: dispatch
        };
    }

    /**
     * @desc派发函数，负责派发通过异步请求浏览器调用的函数
     * @param id {Int} 客户端分发过来的id
     * @param result {JSON} 客户端派发过来的结果
     */
    function dispatch(id, result) {
        var handler,
            _result;
        id = id;
        try {
            _result = eval("(" + result + ")");
        } catch (ex) {
            _result = {};
            console.error(ex.message);
        }
        handler = requestCallbackMap[id];
        if (handler && typeof(handler) == "function") {
            handler(_result);
        }
    }

    /**
     * @desc 注册函数字典
     * @param cmd {String} 命令名
     * @param func {Function} 回调函数
     * @param details {Object} 参数
     * @param type {String} 用来区分API的类型 type为1是事件监听类型的被动触发API type为2的情况为不传参数的同步客户端API type为3的情况是异步的客户端API
     */
    function doRequest(cmd, func, details, type) {
        switch (type) {
            case 2:
                return doNormalRequest(cmd);
            case 3:
                requestCallbackMap[cmd] = func;
                break;
            default:
                doEventRequest(cmd, func, details);
                break;
        }
    }

    /**
     * @desc 针对被客户端调用的函数
     * @param cmd {String} 命令名
     * @param func {Function} 回调函数
     * @param details {Object} 参数 如果details._type存在，则这一次函数绑定调用只会存在一次
     */
    function doEventRequest(cmd, func, details) {
        var type = details._type || null,
            _cmd = cmd.split(".").pop(),
            temp = window[dispatchMethodName];
        if (!type) {
            temp[_cmd] = func;
        } else {
            var old = temp[_cmd] || emptyFun;
            temp[_cmd] = function () {
                temp[_cmd] = old;
                var args = Array.prototype.slice.call(arguments);
                return func.apply(temp, args);
            }
        }
    }

    /**
     * @desc 主动发起向浏览器的同步API
     */
    function doNormalRequest(cmd) {
        var namespace = replaceHead(cmd);
        try {
            return eval(namespace + "()");
        } catch (e) {
            console.error(e.message);
        }
        return false;
    }

    /**
     * @desc 将前端函数变为客户端API
     */
    function replaceHead(cmd) {
        var names = cmd.split("."),
            first = OP_BROWSER,
            last = names.pop();
        return first + "." + last;
    }

    /**
     * 初始化接口池
     */
    function initInterface() {
        for (var k in cmdPool) {
            bindFunc(k, cmdPool[k]);
        }
    }

    var
        /**
         * 事件监听(浏览器主动调用)类的API绑定函数
         */
            eventFun = function (cmd, details, func) {
            var ar = arguments,
                len = ar.length,
                _func,
                _details;
            if (len == 2) {
                _func = ar[1];
                _details = {};
            } else {
                _func = func || emptyFun;
                _details = details || {};
            }
            doRequest(cmd, _func, _details, 1);
        },

        /**
         * 同步无参数请求的API绑定函数
         */
            getAyncNoDetailsFun = function (cmd) {
            return doRequest(cmd, emptyFun, {}, 2);
        },

        /**
         * 异步请求的API绑定函数
         */
            getSyncFun = function (cmd, details, func) {
            var ar = arguments,
                len = ar.length,
                _func,
                _details;
            if (len == 2) {
                _func = details;
                _details = {};
            } else {
                _func = func || emptyFun;
                _details = details || {};
            }
            var id = generateReqId(),
                namespace = replaceHead(cmd);

            doRequest(String(id), _func, {}, 3);
            _details = jsonEncode(_details);
            eval(namespace + "(id, _details)");
        };

    /**
     * 接口池
     * 添加接口说明：
     * 所有的项目需要添加接口时请参照接口池中的规则添加，规则如下：
     * 1、被客户端调用的监听类函数，向接口池中添加接口项 { "op.xxx.xxxx": eventFun }
     * 即可以在自己的代码中直接使用op.xxx.xxxx(callback, arg)的方式添加监听
     * 其中arg是参数对象，如果里面有隐藏关键字_type，如arg = { _type: true }，则这次监听会且只会执行一次
     *
     * 2、在前端主动调用客户端的同步接口分为两种（由于之前定的接口都完全没有规范，参数个数不定，现在也不好再去推动客户端修改）。
     * 如果是不带参数的同步请求，向接口池中添加接口项 { "op.xxx.xxxx": getAyncNoDetailsFun }
     * 即可以在自己的代码中直接使用op.xxx.xxxx发出一个同步请求
     * 如果是带参数的同步请求，请参照 op.sync.showMessage 的方式写就可以了
     *
     * 3、在前端主动调用客户端的异步请求，可以直接向接口池添加接口项 { "op.xxx.xxxx": getSyncFun }
     * 即可在自己的代码里使用op.xxx.xxxx了，需要指出的是 今后在制定异步请求的时候，请严格按照规范制定参数为单参数json结构的异步请求
     * 这样就可以避免目前同步请求遇到的接口使用的噁心情况
     *
     * 每位工程师在使用本js的时候，如果有代码洁癖，直接将自己不使用的接口池里的接口移除即可。
     * 如果添加了接口，请主动提交上git库，独乐乐不如众乐乐
     *
     * 由于本js已经完成了对象映射、函数绑定，请不要修改除了接口池外的任何地方。
     */
    var cmdPool = {

        /**
         * 监听浏览器夜间模式的切换
         */
        "op.global.onToggleNightMode": eventFun,

        /**
         * 检测当前网络是否打开 (OupengSync项目)
         */
        "op.global.isOnline": getAyncNoDetailsFun,

        /**
         * 检测是否开启夜间模式
         */
        "op.global.isNightModeOn": getAyncNoDetailsFun,


        /**
         * 用户登录后获取用户信息
         * @return String json字符串 '{"username":"testUser"}'
         */
        "op.global.getUserInfo": getAyncNoDetailsFun,

        /**
         * 页面显示错误提示信息方法，类似于Toast功能 (OupengSync项目 || 公共登录)
         */
        "op.global.showToastMessage": function (cmd, message) {
            var namespace = replaceHead(cmd);
            return eval(namespace + "(message)");
        },


        /**
         *
         * @param {Integer} status 1 || 0  close(1) 正常关闭页面,close(0) 用户为正确执行页面逻辑，异常关闭页面
         * @returns {Object}
         */
        "op.global.close": function(cmd,status){
            var namespace = replaceHead(cmd);
            return eval(namespace + "(status)");
        },

        /**
         * 调用系统的分享接口 (video项目)
         */
        "op.global.socialShare": function (cmd, title, text, imageUrl, linkUrl) {
            var namespace = replaceHead(cmd);
            return eval(namespace + "(title, text, imageUrl, linkUrl)");
        },

        /**
         *  相关参数，参考wiki 客户端 passportRequest 接口参数部分
         */
        "op.login.passportRequest": getSyncFun,
        /**
         *  相关参数，参考wiki 客户端 requestHeadPortrait 接口参数部分
         */
        "op.login.requestHeadPortrait": function (cmd, camera, func) {
            var  _func = func || emptyFun;
            var id = generateReqId(),
                namespace = replaceHead(cmd);
            doRequest(String(id), _func, {}, 3);
            eval(namespace + "("+id+","+camera+")");
        },
        /**
         * operaLink 账号登录同步相关
         */
        "op.sync.operaLinkImport":getSyncFun,

        /**
         * operaLink 多次重复导入数据
         */
        "op.sync.syncOnce":getSyncFun,

        /**
         * 监听手机返回键的点击（公共登录部分）
         */
        "op.global.onBackKeyClick": eventFun,

        /**
         * 检查更新 (SpeedDialFarm项目)
         */
        "op.sdf.speedDialOnCacheUpdated": getAyncNoDetailsFun,

        /**
         * 判断是否已经添加(SpeedDialFarm项目)
         */
        "op.sdf.speedDialIsExist": function (cmd, url) {
            var namespace = replaceHead(cmd);
            return eval(namespace + "(url)");
        },

        /**
         * 添加(SpeedDialFarm项目)
         */
        "op.sdf.speedDialAdd": function (cmd, title, url) {
            var namespace = replaceHead(cmd);
            return eval(namespace + "(title, url)");
        },

        /**
         * 删除(SpeedDialFarm项目)
         */
        "op.sdf.speedDialremove": function (cmd, title, url) {
            var namespace = replaceHead(cmd);
            return eval(namespace + "(title, url)");
        },

        /**
         * 获取扫码数据(扫码页面)
         */
        "op.barcode.barcodeGetProductData": getAyncNoDetailsFun,

        /**
         * 再扫一次(扫码页面)
         */
        "op.barcode.barcodeRescan": getAyncNoDetailsFun

    }

    initDispatcher();
    initInterface();
})();
