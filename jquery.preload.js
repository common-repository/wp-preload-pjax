/**
 * 
 * jquery-preload
 * 
 * @name jquery-preload
 * @version 0.8.1
 * ---
 * @author falsandtru https://github.com/falsandtru/jquery-preload
 * @copyright 2014, falsandtru
 * @license MIT
 * 
 */

new (function(window, document, undefined, $) {
"use strict";
/// <reference path=".d/jquery.d.ts"/>
var MODULE;
(function (MODULE) {
    MODULE.NAME = 'preload';
    MODULE.NAMESPACE = jQuery;
    // enum
    (function (State) {
        State[State["wait"] = -1] = "wait";
        State[State["ready"] = 0] = "ready";
        State[State["lock"] = 1] = "lock";
        State[State["seal"] = 2] = "seal";
    })(MODULE.State || (MODULE.State = {}));
    var State = MODULE.State;
    MODULE.GEN_UUID = function () {
        // version 4
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16).toUpperCase();
        });
    };
})(MODULE || (MODULE = {}));
/// <reference path="../define.ts"/>
/* CONTROLLER */
var MODULE;
(function (MODULE) {
    var CONTROLLER;
    (function (CONTROLLER) {
        var M;
        var C;
        var ControllerFunction = (function () {
            function ControllerFunction(controller, model) {
                M = model;
                C = controller;
            }
            ControllerFunction.prototype.enable = function () {
                M.state_ = 0 /* ready */;
                return this;
            };
            ControllerFunction.prototype.disable = function () {
                M.state_ = 1 /* lock */;
                return this;
            };
            return ControllerFunction;
        })();
        CONTROLLER.ControllerFunction = ControllerFunction;
    })(CONTROLLER = MODULE.CONTROLLER || (MODULE.CONTROLLER = {}));
})(MODULE || (MODULE = {}));
/// <reference path="../define.ts"/>
/// <reference path="function.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* CONTROLLER */
var MODULE;
(function (MODULE) {
    var CONTROLLER;
    (function (CONTROLLER) {
        var M;
        var C;
        var ControllerMethod = (function (_super) {
            __extends(ControllerMethod, _super);
            function ControllerMethod() {
                _super.apply(this, arguments);
            }
            return ControllerMethod;
        })(CONTROLLER.ControllerFunction);
        CONTROLLER.ControllerMethod = ControllerMethod;
    })(CONTROLLER = MODULE.CONTROLLER || (MODULE.CONTROLLER = {}));
})(MODULE || (MODULE = {}));
/// <reference path="../define.ts"/>
/// <reference path="function.ts"/>
/// <reference path="method.ts"/>
/* CONTROLLER */
var MODULE;
(function (MODULE) {
    var CONTROLLER;
    (function (CONTROLLER) {
        /**
         * @class Controller
         */
        var M;
        var C;
        var Template = (function () {
            function Template(model) {
                /**
                 * Controllerの遷移状態を持つ
                 *
                 * @property state_
                 * @type {State}
                 */
                this.state_ = -1 /* wait */;
                /**
                 * Controllerが待ち受けるイベントに設定されるイベントハンドラのリスト
                 *
                 * @property HANDLERS
                 * @type {Object}
                 */
                this.HANDLERS = {};
                M = model;
                C = this;
                this.UUID = MODULE.GEN_UUID();
                // プラグインに関数を設定してネームスペースに登録
                // $.mvc.func, $().mvc.funcとして実行できるようにするための処理
                if (MODULE.NAMESPACE && MODULE.NAMESPACE == MODULE.NAMESPACE.window) {
                    MODULE.NAMESPACE[MODULE.NAME] = this.EXEC;
                }
                else {
                    MODULE.NAMESPACE[MODULE.NAME] = MODULE.NAMESPACE.prototype[MODULE.NAME] = this.EXEC;
                }
                var f = new CONTROLLER.ControllerFunction(C, M);
                // コンテクストに関数を設定
                this.REGISTER_FUNCTIONS(MODULE.NAMESPACE[MODULE.NAME], f);
                // コンテクストのプロパティを更新
                this.UPDATE_PROPERTIES(MODULE.NAMESPACE[MODULE.NAME], f);
                this.OBSERVE();
                this.state_ = 0;
            }
            /**
             * 与えられたコンテクストに拡張機能を設定する。
             *
             * @method EXTEND
             * @param {JQuery|Object|Function} context コンテクスト
             * @chainable
             */
            Template.prototype.EXTEND = function (context) {
                if (context === MODULE.NAMESPACE || MODULE.NAMESPACE && MODULE.NAMESPACE == MODULE.NAMESPACE.window) {
                    var m = new CONTROLLER.ControllerFunction(C, M);
                    // コンテクストをプラグインに変更
                    context = MODULE.NAMESPACE[MODULE.NAME];
                }
                else
                    var m = new CONTROLLER.ControllerMethod(C, M);
                // $().mvc()として実行された場合の処理
                if (context instanceof MODULE.NAMESPACE) {
                    if (context instanceof jQuery) {
                        // コンテクストへの変更をend()で戻せるようadd()
                        context = context.add();
                    }
                    // コンテクストに関数とメソッドを設定
                    this.REGISTER_FUNCTIONS(context, m);
                }
                // コンテクストのプロパティを更新
                this.UPDATE_PROPERTIES(context, m);
                return context;
            };
            /**
             * 拡張モジュール本体のインターフェイス。
             *
             * @method EXEC
             * @param {Any} [params]* パラメータ
             */
            Template.prototype.EXEC = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var context = C.EXTEND(this);
                args = [context].concat(args);
                args = C.exec_.apply(C, args);
                args = args instanceof Array ? args : [args];
                return M.MAIN.apply(M, args);
            };
            /**
             * 拡張モジュール本体を実行したときに呼び出される。実装ごとに書き換える。戻り値の配列が`MAIN`および`main_`へ渡す引数のリストとなる。
             *
             * @method exec_
             * @param {Object} context
             * @param {Any} [params]* args
             */
            Template.prototype.exec_ = function (context) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return [context].concat(args);
            };
            /**
             * 拡張の関数を更新する
             *
             * @method REGISTER_FUNCTIONS
             * @param {JQuery|Object|Function} context コンテクスト
             * @return {JQuery|Object|Function} context コンテクスト
             */
            Template.prototype.REGISTER_FUNCTIONS = function (context, funcs) {
                var props = CONTROLLER.Template.PROPERTIES;
                var i;
                for (i in funcs) {
                    context[i] = funcs[i];
                }
                return context;
            };
            /**
             * 拡張のプロパティを更新する
             *
             * @method UPDATE_PROPERTIES
             * @param {JQuery|Object|Function} context コンテクスト
             * @param {Object} funcs プロパティのリスト
             * @return {JQuery|Object|Function} context コンテクスト
             */
            Template.prototype.UPDATE_PROPERTIES = function (context, funcs) {
                var props = CONTROLLER.Template.PROPERTIES;
                var i, len, prop;
                for (i = 0, len = props.length; i < len; i++) {
                    prop = props[i];
                    if (funcs[prop]) {
                        context[prop] = funcs[prop].call(context);
                    }
                }
                return context;
            };
            /**
             * 内部イベントを監視する。
             *
             * @method OBSERVE
             */
            Template.prototype.OBSERVE = function () {
            };
            /**
             * 内部イベントの監視を終了する。
             *
             * @method RELEASE
             */
            Template.prototype.RELEASE = function () {
            };
            /**
             * Controllerが監視する内部イベント名のリスト
             *
             * @property EVENTS
             * @type {Object}
             * @static
             */
            Template.EVENTS = {};
            /**
             * 拡張機能として組み込む関数のリスト
             *
             * @property FUNCTIONS
             * @type {Object}
             * @static
             */
            Template.FUNCTIONS = {};
            /**
             * 拡張機能として組み込むメソッドのリスト
             *
             * @property METHODS
             * @type {Object}
             * @static
             */
            Template.METHODS = {};
            /**
             * 拡張機能として組み込むプロパティのリスト
             *
             * @property PROPERTIES
             * @type {Object}
             * @static
             */
            Template.PROPERTIES = [];
            /**
             * Controllerが発生させる外部イベント名のリスト
             *
             * @property TRIGGERS
             * @type {Object}
             * @static
             */
            Template.TRIGGERS = {};
            return Template;
        })();
        CONTROLLER.Template = Template;
    })(CONTROLLER = MODULE.CONTROLLER || (MODULE.CONTROLLER = {}));
})(MODULE || (MODULE = {}));
/// <reference path="../define.ts"/>
/// <reference path="_template.ts"/>
/* CONTROLLER */
var MODULE;
(function (MODULE) {
    var CONTROLLER;
    (function (CONTROLLER) {
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main(model_) {
                _super.call(this, model_);
                this.model_ = model_;
                // CONTROLLERの待ち受けるイベントに登録されるハンドラ
                this.HANDLERS = {};
            }
            Main.prototype.PRELOAD = function (event) {
                this.model_.PRELOAD(event);
            };
            Main.prototype.CLICK = function (event) {
                this.model_.CLICK(event);
            };
            Main.prototype.MOUSEMOVE = function (event) {
                this.model_.MOUSEMOVE(event);
            };
            Main.prototype.MOUSEOVER = function (event) {
                this.model_.MOUSEOVER(event);
            };
            Main.prototype.MOUSEOUT = function (event) {
                this.model_.MOUSEOUT(event);
            };
            // CONTROLLERが監視する内部イベントを登録
            Main.prototype.OBSERVE = function () {
            };
            //内部イベント
            Main.EVENTS = {};
            // プラグインに登録されるプロパティ
            Main.PROPERTIES = [];
            // プラグインが実行するイベント名
            Main.TRIGGERS = {};
            return Main;
        })(CONTROLLER.Template);
        CONTROLLER.Main = Main;
    })(CONTROLLER = MODULE.CONTROLLER || (MODULE.CONTROLLER = {}));
})(MODULE || (MODULE = {}));
/// <reference path="../define.ts"/>
/* MODEL */
var MODULE;
(function (MODULE) {
    var MODEL;
    (function (MODEL) {
        /**
         * Model of MVC
         *
         * @class Model
         */
        var Template = (function () {
            function Template() {
                /**
                 * 拡張モジュール名。ネームスペースにこの名前のプロパティでモジュールが追加される。
                 *
                 * @property NAME
                 * @type String
                 */
                this.NAME = MODULE.NAME;
                /**
                 * ネームスペース。ここにモジュールが追加される。
                 *
                 * @property NAMESPACE
                 * @type Window|JQuery
                 */
                this.NAMESPACE = MODULE.NAMESPACE;
                /**
                 * Modelの遷移状態を持つ
                 *
                 * @property state_
                 * @type {State}
                 */
                this.state_ = -1 /* wait */;
                /**
                 * `new`をつけて実行した場合、MVCインスタンスごとの個別データ保存用のデータオブジェクトの操作となる。
                 * メソッドとして実行した場合、MVCインスタンスをまたぐ共有データ保存用の操作となる。
                 *
                 * 個別データ操作
                 * + add: new stock()
                 *   インスタンス別のデータオブジェクトを返す。`uuid`プロパティにuuidが設定される。
                 * + add: new stock(Data: object/function/array, ...)
                 *   データオブジェクトに可変数の引数のオブジェクトのプロパティを追加して返す。`uuid`プロパティは上書きされない。
                 * + get: stock(uuid: string)
                 *   データオブジェクトを取得する。
                 * + del: new stock(uuid: string)
                 *   データオブジェクトを削除する。
                 *
                 * 共有データ操作
                 * + set: stock(key: string, value: any)
                 *   key-valueで共有データを保存する。
                 * + set: stock(key: string, value: any, true)
                 *   共有データをマージ保存する。
                 * + set: stock(data: object)
                 *   オブジェクトのプロパティをkey-valueのセットとして共有データを保存する。
                 * + get: stock(key: string)
                 *   共有データを取得する。
                 * + del: stock(key: string, undefined)
                 *   共有データを空データの保存により削除する。
                 *
                 * @method stock
                 * @param {String} key
                 * @param {Any} value
                 * @param {Boolean} merge
                 */
                this.stock = function stock(key, value, merge) {
                    if (this instanceof stock || this.constructor.toString() === stock.toString()) {
                        switch (typeof key) {
                            case 'object':
                            case 'function':
                                this.uuid = MODULE.GEN_UUID();
                                stock[this.uuid] = this;
                                return jQuery.extend.apply(jQuery, [true, this].concat([].slice.call(arguments)).concat({ uuid: this.uuid }));
                            case 'string':
                                return delete stock[key];
                        }
                    }
                    else if ('object' === typeof key) {
                        // 共有データ操作
                        var keys = key, iKeys;
                        for (iKeys in keys) {
                            Template.store(iKeys, keys[iKeys]);
                        }
                    }
                    else {
                        switch (arguments.length) {
                            case 0:
                                // `new stock()`にリダイレクト
                                return new this.stock();
                            case 1:
                                // インスタンス別のデータオブジェクトまたは共有データを取得
                                return stock[key] || Template.store(key);
                            case 2:
                                // 共有データを保存
                                return Template.store(key, value);
                            case 3:
                                return Template.store(key, value, merge);
                        }
                    }
                };
                this.UUID = MODULE.GEN_UUID();
            }
            /**
             * 拡張モジュール本体を実行したときに呼び出される。実装ごとに書き変えない。
             *
             * @method MAIN
             */
            Template.prototype.MAIN = function (context) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return this.main_.apply(this, [context].concat(args));
            };
            /**
             * 拡張モジュール本体を実行したときに呼び出される。実装ごとに書き換える。
             *
             * @method main_
             * @param {Object} context
             * @param {Any} [params]* args
             */
            Template.prototype.main_ = function (context) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this.state_ = 0 /* ready */;
                return context;
            };
            /**
            /**
             * 他のインスタンスとの共有データ保存用オブジェクト。
             *
             * @property store
             * @type Object
             * @static
             */
            Template.store = function store(key, value, merge) {
                switch (arguments.length) {
                    case 0:
                        break;
                    case 1:
                        // 共有データを取得
                        return Template.store[key];
                    case 2:
                        // 共有データを設定
                        return Template.store[key] = value;
                    case 3:
                        return Template.store[key] = jQuery.extend(true, Template.store[key], value);
                }
            };
            return Template;
        })();
        MODEL.Template = Template;
    })(MODEL = MODULE.MODEL || (MODULE.MODEL = {}));
})(MODULE || (MODULE = {}));
/* MODEL */
var MODULE;
(function (MODULE) {
    var LIBRARY;
    (function (LIBRARY) {
        var Utility = (function () {
            function Utility() {
            }
            /* string */
            Utility.trim = function (text) {
                text = 'string' === typeof text ? text : String(0 === text && text.toString() || '');
                if (text.trim) {
                    text = text.trim();
                }
                else if (text = text.replace(/^[\s\uFEFF\xA0]+/, '')) {
                    var regSpace = /[\s\uFEFF\xA0]/;
                    var i = text.length, r = i % 8;
                    DUFF: {
                        while (r--) {
                            if (!regSpace.test(text.charAt(--i))) {
                                break DUFF;
                            }
                        }
                        while (i) {
                            if (!regSpace.test(text.charAt(--i))) {
                                break DUFF;
                            }
                            if (!regSpace.test(text.charAt(--i))) {
                                break DUFF;
                            }
                            if (!regSpace.test(text.charAt(--i))) {
                                break DUFF;
                            }
                            if (!regSpace.test(text.charAt(--i))) {
                                break DUFF;
                            }
                            if (!regSpace.test(text.charAt(--i))) {
                                break DUFF;
                            }
                            if (!regSpace.test(text.charAt(--i))) {
                                break DUFF;
                            }
                            if (!regSpace.test(text.charAt(--i))) {
                                break DUFF;
                            }
                            if (!regSpace.test(text.charAt(--i))) {
                                break DUFF;
                            }
                        }
                    }
                    text = text.substring(0, i + 1);
                }
                return text;
            };
            Utility.repeat = function (arg, size) {
                switch (arg instanceof Array && 'array' || typeof arg) {
                    case 'string':
                        var text = arg;
                        return Array(size + 1).join(text);
                    case 'array':
                        var len = arg.length;
                        if (size < 300) {
                            var arr = Array(size);
                            this.duff(-size, function (i) { return arr[i] = arg[i % len]; });
                        }
                        else {
                            var arr = arg.slice();
                            while (arr.length * 2 <= size) {
                                arr = arr.concat(arr);
                            }
                            arr = arr.concat(arr.slice(0, size - arr.length));
                        }
                        return arr;
                }
            };
            Utility.fire = function (fn, context, args, async) {
                if (context === void 0) { context = window; }
                if (args === void 0) { args = []; }
                if ('function' === typeof fn) {
                    return async ? setTimeout(function () {
                        fn.apply(context || window, args);
                    }, 0) : fn.apply(context || window, args);
                }
                else {
                    return fn;
                }
            };
            Utility.duff = function (loop, proc) {
                if (loop < 0) {
                    var i = -loop, r = i % 8;
                    while (r--) {
                        proc(--i);
                    }
                    while (i) {
                        proc(--i);
                        proc(--i);
                        proc(--i);
                        proc(--i);
                        proc(--i);
                        proc(--i);
                        proc(--i);
                        proc(--i);
                    }
                }
                else {
                    var l = loop, i = 0, r = l % 8, q = l / 8 ^ 0;
                    while (r--) {
                        proc(i++);
                    }
                    while (q--) {
                        proc(i++);
                        proc(i++);
                        proc(i++);
                        proc(i++);
                        proc(i++);
                        proc(i++);
                        proc(i++);
                        proc(i++);
                    }
                }
            };
            Utility.duffEx = function (loop, proc) {
                if (loop < 0) {
                    var i = -loop, r = i % 8;
                    DUFF: {
                        while (r--) {
                            if (false === proc(--i)) {
                                break DUFF;
                            }
                        }
                        while (i) {
                            if (false === proc(--i)) {
                                break DUFF;
                            }
                            if (false === proc(--i)) {
                                break DUFF;
                            }
                            if (false === proc(--i)) {
                                break DUFF;
                            }
                            if (false === proc(--i)) {
                                break DUFF;
                            }
                            if (false === proc(--i)) {
                                break DUFF;
                            }
                            if (false === proc(--i)) {
                                break DUFF;
                            }
                            if (false === proc(--i)) {
                                break DUFF;
                            }
                            if (false === proc(--i)) {
                                break DUFF;
                            }
                        }
                    }
                }
                else {
                    var l = loop, i = 0, r = l % 8, q = l / 8 ^ 0;
                    DUFF: {
                        while (r--) {
                            if (false === proc(i++)) {
                                break DUFF;
                            }
                        }
                        while (q--) {
                            if (false === proc(i++)) {
                                break DUFF;
                            }
                            if (false === proc(i++)) {
                                break DUFF;
                            }
                            if (false === proc(i++)) {
                                break DUFF;
                            }
                            if (false === proc(i++)) {
                                break DUFF;
                            }
                            if (false === proc(i++)) {
                                break DUFF;
                            }
                            if (false === proc(i++)) {
                                break DUFF;
                            }
                            if (false === proc(i++)) {
                                break DUFF;
                            }
                            if (false === proc(i++)) {
                                break DUFF;
                            }
                        }
                    }
                }
            };
            /* other */
            Utility.normalizeUrl = function (url, transparent) {
                if (transparent === void 0) { transparent = true; }
                var ret;
                // Trim
                ret = this.trim(url);
                // Convert to absolute path
                ret = /^([^:/?#]+):\/\/[^/?#.]+\.[^/?#]+/i.test(ret) ? ret : (function (url, a) {
                    a.href = url;
                    return a.href;
                })(ret, document.createElement('a'));
                // Convert to UTF-8 encoded string
                ret = encodeURI(decodeURI(ret));
                // Remove string of starting with an invalid character
                ret = ret.replace(/["`^|\\<>{}\[\]\s].*/, '');
                // Fix case of percent encoding
                ret = transparent ? this.justifyPercentEncodingUrlCase_(url, ret) : ret;
                return ret;
            };
            Utility.canonicalizeUrl = function (url) {
                var ret = this.normalizeUrl(url, false);
                // Fix case of percent encoding
                ret = ret.replace(/(?:%\w{2})+/g, replaceLowerToUpper);
                function replaceLowerToUpper(str) {
                    return str.toUpperCase();
                }
                return ret;
            };
            Utility.compareUrl = function (first, second, canonicalize) {
                if (canonicalize) {
                    first = this.canonicalizeUrl(first);
                    second = this.canonicalizeUrl(second);
                }
                // URLのパーセントエンコーディングの大文字小文字がAndroidのアドレスバーとリンクで異なるためそろえる
                return first === this.justifyPercentEncodingUrlCase_(first, second);
            };
            Utility.justifyPercentEncodingUrlCase_ = function (base, target) {
                return base === target ? target : target.replace(/(?:%\w{2})+/g, replace);
                function replace(str) {
                    var i = ~base.indexOf(str.toUpperCase()) || ~base.indexOf(str.toLowerCase());
                    return i ? base.substr(~i, str.length) : str;
                }
            };
            return Utility;
        })();
        LIBRARY.Utility = Utility;
    })(LIBRARY = MODULE.LIBRARY || (MODULE.LIBRARY = {}));
})(MODULE || (MODULE = {}));
/// <reference path="../define.ts"/>
/* VIEW */
var MODULE;
(function (MODULE) {
    var VIEW;
    (function (VIEW) {
        /**
         * View of MVC
         *
         * @class View
         * @constructor
         * @param {JQuery|HTMLElement} [context] 監視するDOM要素を設定する。
         */
        var C;
        var Template = (function () {
            function Template(model_, controller_, context) {
                var args = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    args[_i - 3] = arguments[_i];
                }
                this.model_ = model_;
                this.controller_ = controller_;
                /**
                 * Viewの遷移状態を持つ
                 *
                 * @property state_
                 * @type {State}
                 */
                this.state_ = -1 /* wait */;
                this.queue_ = []; // $.deferred()
                /**
                 * Viewが待ち受けるイベントに設定されるイベントハンドラのリスト
                 *
                 * @property HANDLERS
                 * @type {Object}
                 */
                this.HANDLERS = {};
                C = controller_;
                this.UUID = MODULE.GEN_UUID();
                this.CONTEXT = context;
                this.OBSERVE.apply(this, args || []);
                this.state_ = 0;
            }
            /**
             * 内部イベントを監視する。
             *
             * @method OBSERVE
             */
            Template.prototype.OBSERVE = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
            };
            /**
             * 内部イベントの監視を終了する。
             *
             * @method RELEASE
             */
            Template.prototype.RELEASE = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
            };
            /**
             * 外部イベントを監視する。
             *
             * @method BIND
             * @param {String} selector jQueryセレクタ
             * @chainable
             */
            Template.prototype.BIND = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this.UNBIND();
                return this;
            };
            /**
             * 外部イベントの監視を解除する。
             *
             * @method UNBIND
             * @param {String} selector jQueryセレクタ
             * @chainable
             */
            Template.prototype.UNBIND = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this;
            };
            /**
             * Viewが監視する内部イベント名のリスト
             *
             * @property EVENTS
             * @type {Object}
             * @static
             */
            Template.EVENTS = {};
            /**
             * Viewが発生させる外部イベント名のリスト
             *
             * @property TRIGGERS
             * @type {Object}
             * @static
             */
            Template.TRIGGERS = {};
            return Template;
        })();
        VIEW.Template = Template;
    })(VIEW = MODULE.VIEW || (MODULE.VIEW = {}));
})(MODULE || (MODULE = {}));
/// <reference path="../define.ts"/>
/// <reference path="../model/main.ts"/>
/// <reference path="_template.ts"/>
/* VIEW */
var MODULE;
(function (MODULE) {
    var VIEW;
    (function (VIEW) {
        var C;
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main(model_, controller_, context, uuid) {
                _super.call(this, model_, controller_, context, uuid);
                this.model_ = model_;
                this.controller_ = controller_;
                C = controller_;
            }
            Main.prototype.OBSERVE = function (uuid) {
                var setting = this.model_.stock(uuid);
                this.CONTEXT.bind(setting.nss.event, uuid, this.PRELOAD);
                return this;
            };
            Main.prototype.RELEASE = function (uuid) {
                var setting = this.model_.stock(uuid);
                this.CONTEXT.unbind(setting.nss.event);
                return this;
            };
            // VIEWにする要素を選択/解除する
            Main.prototype.BIND = function (uuid, event) {
                var setting = this.model_.stock(uuid);
                this.UNBIND(uuid, event);
                event && this.CONTEXT.find(event.currentTarget).add(this.CONTEXT.filter(event.currentTarget)).find(setting.link).filter(setting.filter).bind(setting.nss.click, uuid, this.CLICK).bind(setting.nss.mouseover, uuid, this.MOUSEOVER).bind(setting.nss.mousemove, uuid, this.MOUSEMOVE).bind(setting.nss.mouseout, uuid, this.MOUSEOUT);
                return this;
            };
            Main.prototype.UNBIND = function (uuid, event) {
                var setting = this.model_.stock(uuid);
                event && this.CONTEXT.find(event.currentTarget).add(this.CONTEXT.filter(event.currentTarget)).find(setting.link).filter(setting.filter).unbind(setting.nss.click).unbind(setting.nss.mouseover).unbind(setting.nss.mousemove).unbind(setting.nss.mouseout);
                return this;
            };
            Main.prototype.RESET = function (setting) {
                this.CONTEXT.trigger(setting.nss.event);
                return this;
            };
            // VIEWの待ち受けるイベントに登録されるハンドラ
            Main.prototype.PRELOAD = function (event) {
                C.PRELOAD(event);
            };
            Main.prototype.CLICK = function (event) {
                C.CLICK(event);
            };
            Main.prototype.MOUSEMOVE = function (event) {
                C.MOUSEMOVE(event);
            };
            Main.prototype.MOUSEOVER = function (event) {
                C.MOUSEOVER(event);
            };
            Main.prototype.MOUSEOUT = function (event) {
                C.MOUSEOUT(event);
            };
            //内部イベント
            Main.EVENTS = {
                BIND: MODULE.NAME
            };
            // プラグインが実行するイベント名
            Main.TRIGGERS = {};
            return Main;
        })(VIEW.Template);
        VIEW.Main = Main;
    })(VIEW = MODULE.VIEW || (MODULE.VIEW = {}));
})(MODULE || (MODULE = {}));
/// <reference path="../define.ts"/>
/// <reference path="_template.ts"/>
/// <reference path="../library/utility.ts"/>
/// <reference path="../view/main.ts"/>
/// <reference path="../controller/main.ts"/>
/* MODEL */
var MODULE;
(function (MODULE) {
    var MODEL;
    (function (MODEL) {
        var Util = MODULE.LIBRARY.Utility;
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                _super.apply(this, arguments);
                this.controller_ = new MODULE.CONTROLLER.Main(this);
                this.loaded_ = {};
            }
            Main.prototype.main_ = function ($context, option) {
                var _this = this;
                // polymorphism
                var pattern;
                pattern = $context instanceof MODULE.NAMESPACE ? 'm:' : 'f:';
                pattern += option ? ({}).toString.call(option).split(' ').pop().slice(0, -1).toLowerCase() : option;
                switch (pattern.toLowerCase()) {
                    case 'f:number':
                    case 'f:0':
                    case 'f:string':
                        option = { link: option };
                    case 'f:':
                    case 'm:object':
                    case 'm:null':
                    case 'm:function':
                    case 'm:undefined':
                }
                $context = $context instanceof jQuery ? $context : jQuery(document);
                var setting = new this.stock(this.configure(option));
                this.stock({
                    setting: setting,
                    queue: []
                });
                var url = setting.encode ? Util.normalizeUrl(window.location.href) : window.location.href;
                url = url.replace(/#.*/, '');
                this.loaded_[url] = true;
                $context.uuid = setting.uuid;
                jQuery(function () {
                    setting.view.push(new MODULE.VIEW.Main(_this, _this.controller_, $context, setting.uuid));
                    setting.view[0].CONTEXT.trigger(setting.nss.event);
                    _this.state_ = ~_this.state_ ? _this.state_ : 0 /* ready */;
                });
                this.cooldown(setting);
                return $context;
            };
            Main.prototype.configure = function (option) {
                var setting = jQuery.extend(true, {}, option), initial = {
                    gns: MODULE.NAME,
                    ns: null,
                    link: 'a:not([target])',
                    filter: function () {
                        return /^https?:/.test(this.href) && /(\/[^.]*|\.html?|\.php)$/.test('/' + this.pathname);
                    },
                    lock: 1000,
                    forward: null,
                    check: null,
                    balance: {
                        host: null,
                        ajax: {
                            crossDomain: true,
                            beforeSend: null
                        }
                    },
                    interval: 1000,
                    limit: 2,
                    cooldown: 10000,
                    skip: 50,
                    query: '',
                    encode: false,
                    ajax: { dataType: 'text', async: true, timeout: 1500 }
                }, force = {
                    view: [],
                    target: null,
                    volume: 0,
                    points: [],
                    touch: false,
                    xhr: null,
                    timeStamp: 0,
                    option: option
                }, compute = function () {
                    var nsArray = [setting.gns || MODULE.NAME].concat(setting.ns && String(setting.ns).split('.') || []);
                    return {
                        nss: {
                            name: setting.ns || '',
                            array: nsArray,
                            event: nsArray.join('.'),
                            data: nsArray.join('-'),
                            class4html: nsArray.join('-'),
                            click: ['click'].concat(nsArray.join(':')).join('.'),
                            mousemove: ['mousemove'].concat(nsArray.join(':')).join('.'),
                            mouseover: ['mouseover'].concat(nsArray.join(':')).join('.'),
                            mouseout: ['mouseout'].concat(nsArray.join(':')).join('.'),
                            touchstart: ['touchstart'].concat(nsArray.join(':')).join('.'),
                            touchmove: ['touchmove'].concat(nsArray.join(':')).join('.'),
                            touchend: ['touchend'].concat(nsArray.join(':')).join('.')
                        },
                        ajax: jQuery.extend(true, {}, jQuery.ajaxSettings, setting.ajax)
                    };
                };
                setting = jQuery.extend(true, {}, initial, setting, force);
                setting = jQuery.extend(true, {}, setting, compute());
                return setting;
            };
            Main.prototype.cooldown = function (setting) {
                (function (wait, setting) {
                    setTimeout(function cooldown() {
                        setting.volume -= Number(!!setting.volume);
                        setTimeout(cooldown, wait);
                    }, wait, setting);
                })(setting.cooldown, setting);
            };
            Main.prototype.PRELOAD = function (event) {
                var setting = this.stock(event.data);
                setting.volume = 0;
                setting.timeStamp = 0;
                setting.view[0].BIND(event.data, event);
            };
            Main.prototype.CLICK = function (event) {
                var setting = this.stock(event.data), context = event.currentTarget;
                if (this.state_ !== 0 /* ready */) {
                    return;
                }
                event.timeStamp = new Date().getTime();
                if (setting.encode) {
                    'href' in context ? context.href = this.getURL_(setting, context) : context.src = this.getURL_(setting, context);
                }
                switch (!event.isDefaultPrevented() && jQuery.data(event.currentTarget, setting.nss.data)) {
                    case 'preload':
                    case 'lock':
                        if (setting.forward) {
                            // forward
                            var url = this.getURL_(setting, event.currentTarget), host = setting.xhr.host;
                            delete setting.xhr.host;
                            if (false === Util.fire(setting.forward, null, [event, setting.xhr, host, setting.timeStamp])) {
                                // forward fail
                                if ('lock' === jQuery.data(event.currentTarget, setting.nss.data)) {
                                    // lock
                                    event.preventDefault();
                                }
                                else {
                                    // preload
                                    this.click_(setting, event);
                                    jQuery.removeData(event.currentTarget, setting.nss.data);
                                }
                            }
                            else {
                                // forward success
                                setting.xhr = null;
                                event.preventDefault();
                                jQuery.removeData(event.currentTarget, setting.nss.data);
                            }
                        }
                        else {
                            // not forward
                            if ('lock' === jQuery.data(event.currentTarget, setting.nss.data)) {
                                // lock
                                event.preventDefault();
                            }
                            else {
                                // preload
                                this.click_(setting, event);
                                jQuery.removeData(event.currentTarget, setting.nss.data);
                            }
                        }
                        break;
                    default:
                        setting.xhr && setting.xhr.readyState < 4 && setting.xhr.abort();
                }
            };
            Main.prototype.MOUSEMOVE = function (event) {
                var setting = this.stock(event.data);
                if (this.state_ !== 0 /* ready */) {
                    return;
                }
                event.timeStamp = new Date().getTime();
                if (!setting.points.length || 30 < event.timeStamp - setting.points[0].timeStamp) {
                    //var point = {
                    //  pageX: event.pageX,
                    //  pageY: event.pageY,
                    //  timeStamp: new Date().getTime()
                    //};
                    setting.points.unshift(event);
                    setting.points = setting.points.slice(0, 3);
                    setting.points.length >= 3 && this.check_(event, setting);
                }
            };
            Main.prototype.MOUSEOVER = function (event) {
                var setting = this.stock(event.data);
                setting.target = event.currentTarget;
            };
            Main.prototype.MOUSEOUT = function (event) {
                var setting = this.stock(event.data);
                setting.target = null;
            };
            Main.prototype.speed = function (points) {
                if (points.length < 3) {
                    return false;
                }
                var speed1, time1, speed2, time2;
                time1 = points[0].timeStamp - points[1].timeStamp;
                speed1 = parseInt(String(Math.pow(points[0].pageX - points[1].pageX, 2) + Math.pow(points[0].pageY - points[1].pageY, 2) / (time1 || 1)), 10);
                time2 = points[1].timeStamp - points[2].timeStamp;
                speed2 = parseInt(String(Math.pow(points[1].pageX - points[2].pageX, 2) + Math.pow(points[1].pageY - points[2].pageY, 2) / (time2 || 1)), 10);
                var speed = 1000 > time1 && 1000 > time2 ? [speed1 - speed2, speed1] : [];
                switch (true) {
                    case !speed.length:
                        break;
                    case -50 > speed[0] && 200 > speed[1]:
                    case -50 < speed[0] && 50 > speed[0] && -50 < speed[1] && 50 > speed[1]:
                        return true;
                }
                return false;
            };
            Main.prototype.check_ = function (event, setting) {
                var _this = this;
                switch (true) {
                    case setting.volume >= setting.limit:
                    case setting.points.length < 3:
                    case setting.points[2].pageX === event.pageX:
                    case setting.interval ? new Date().getTime() - setting.timeStamp < setting.interval : false:
                        return;
                    default:
                        var check = function () {
                            var url = _this.getURL_(setting, event.currentTarget);
                            url = url.replace(/#.*/, '');
                            switch (true) {
                                case setting.target !== event.currentTarget:
                                case setting.check ? !!Util.fire(setting.check, event.currentTarget, [url]) : _this.loaded_[url]:
                                case !setting.ajax.crossDomain && (setting.target.protocol !== window.location.protocol || setting.target.host !== window.location.host):
                                    return;
                            }
                            _this.drive_(event, setting);
                        };
                        if (0 && Worker && URL && URL.createObjectURL && Blob) {
                            var job;
                            job = [
                                'var test = ' + this.speed.toString() + ';',
                                'onmessage = function(event) {postMessage(test(event.data));self.close();};'
                            ];
                            var worker = new Worker(URL.createObjectURL(new Blob(job, { type: "text/javascript" })));
                            ;
                            worker.onmessage = function (event) {
                                event.data && check();
                                worker.terminate();
                            };
                            worker.onerror = function (event) {
                                worker.terminate();
                            };
                            worker.postMessage(setting.points);
                        }
                        else {
                            if (this.speed(setting.points)) {
                                check();
                            }
                        }
                }
            };
            Main.prototype.drive_ = function (event, setting) {
                var _this = this;
                setting.xhr && setting.xhr.readyState < 4 && setting.xhr.abort();
                this.loaded_[this.getURL_(setting, event.currentTarget).replace(/#.*/, '')] = true;
                ++setting.volume;
                setting.timeStamp = event.timeStamp;
                jQuery.data(event.currentTarget, setting.nss.data, 'preload');
                if (setting.lock) {
                    jQuery.data(event.currentTarget, setting.nss.data, 'lock');
                    jQuery(event.currentTarget).one(setting.nss.click, function (event) {
                        // `this` is Model instance
                        if (jQuery.data(event.currentTarget, setting.nss.data)) {
                            // Behavior when using the lock
                            var timer = Math.max(setting.lock - new Date().getTime() + event.data, 0);
                            jQuery.data(event.currentTarget, setting.nss.data, 'click');
                            if (timer) {
                                setTimeout(function () {
                                    'click' === jQuery.data(event.currentTarget, setting.nss.data) && _this.click_(setting, event);
                                    jQuery.removeData(event.currentTarget, setting.nss.data);
                                }, timer);
                                event.preventDefault();
                            }
                        }
                    });
                }
                this.preload_(event);
            };
            Main.prototype.preload_ = function (event) {
                var setting = this.stock(event.data), host = setting.balance.host && setting.balance.host(), that = this;
                var ajax = jQuery.extend(true, {}, setting.ajax, {
                    beforeSend: function (jqXHR, ajaxSetting) {
                        jqXHR.setRequestHeader('X-Preload', 'true');
                        Util.fire(setting.ajax.beforeSend, this, [jqXHR, ajaxSetting]);
                    },
                    success: function () {
                        time = new Date().getTime() - time;
                        Util.fire(setting.ajax.success, this, arguments);
                        that.loaded_[url] = true;
                        if (arguments[2].status === 304 || time <= setting.skip) {
                            setting.volume -= Number(!!setting.volume);
                            setting.timeStamp = 0;
                        }
                        if ('click' === jQuery.data(event.currentTarget, setting.nss.data)) {
                            that.click_(setting, event);
                        }
                        jQuery.removeData(event.currentTarget, setting.nss.data);
                    },
                    error: function () {
                        Util.fire(setting.ajax.error, this, arguments);
                        setting.volume -= Number(!!setting.volume);
                        setting.timeStamp = 0;
                        jQuery.removeData(event.currentTarget, setting.nss.data);
                    },
                    complete: function () {
                        Util.fire(setting.ajax.complete, this, arguments);
                    }
                }, host && setting.balance.ajax);
                var query = setting.query;
                switch (query && typeof query) {
                    case 'string':
                        query = eval('({' + query.match(/[^?=&]+=[^&]*/g).join('&').replace(/"/g, '\\"').replace(/([^?=&]+)=([^&]*)/g, '"$1": "$2"').replace(/&/g, ',') + '})');
                    case 'object':
                        query = jQuery.param(query);
                        break;
                    default:
                        query = '';
                }
                var url = this.getURL_(setting, event.currentTarget);
                url = host ? url.replace('//[^/]+', '//' + host) : url;
                url = query ? url.replace(/([^\?#]+)\??([^#]*)?(#.+)?/, '$1$2&' + query + '$3').replace(/\?&/, '?') : url;
                ajax.url = url;
                var time = new Date().getTime();
                setting.xhr = jQuery.ajax(ajax);
                setting.xhr.host = host;
            };
            Main.prototype.click_ = function (setting, event) {
                var _this = this;
                var target = event.currentTarget;
                setting.xhr && setting.xhr.readyState < 4 && setting.xhr.abort();
                jQuery(event.currentTarget).removeData(setting.nss.data);
                if (jQuery(document).find(event.currentTarget).length) {
                    jQuery(document).unbind(setting.nss.click).one(setting.nss.click, function (event) {
                        if (!event.isDefaultPrevented()) {
                            window.location.href = setting.encode ? Util.normalizeUrl(target.href) : target.href;
                            if (setting.encode) {
                                window.location.href = _this.getURL_(setting, event.currentTarget);
                            }
                        }
                    });
                    jQuery(event.currentTarget).click();
                }
                event.preventDefault();
            };
            Main.prototype.getURL_ = function (setting, element) {
                var url;
                switch (element.tagName.toLowerCase()) {
                    case 'a':
                    case 'link':
                        url = element.href;
                        break;
                    case 'script':
                    case 'img':
                    case 'iframe':
                        url = element.src;
                        break;
                }
                return setting.encode ? Util.normalizeUrl(url) : url;
            };
            return Main;
        })(MODEL.Template);
        MODEL.Main = Main;
    })(MODEL = MODULE.MODEL || (MODULE.MODEL = {}));
})(MODULE || (MODULE = {}));
/// <reference path="model/main.ts"/>
new MODULE.MODEL.Main();
})(window, window.document, void 0, jQuery);
