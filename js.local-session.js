/* project : js.local-session
 * version : 1.0.0
 * author  : Famer
 * github  : https://github.com/Famer-Y/js.local-session
 */

;(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(root);
    } else {
        var api = oldCookies = root.storage = factory(root);
        api.reproduce = function(type){
            root.storage = oldCookies;
            api = factory(root, type);
            return api;
        }
    }
}(typeof window !== "undefined" ? window : this, function(window, type){
    var ls = ("session" === type ? window.sessionStorage : window.localStorage);
    var storage = {
        set: function(){
            if (0 === arguments.length) {
                throw new Error("1 or 2 arguments required, but only 0 present.");
            }
            if (1 === arguments.length) {
                var param = arguments[0];
                if ("object" !== analyzeType(param)) {
                    throw new Error("argument must be Object, when the number of arguments only 1.");
                }
                for (var item in param) {
                    ls.setItem(item, JSON.stringify(param[item]));
                }
            }
            if (2 === arguments.length) {
                var name = arguments[0];
                var value = arguments[1];
                ls.setItem(name, JSON.stringify(value));
            }
        },

        get: function(param, defaultValue){
            // get by key or set default-value
            if ("string" === analyzeType(param)) {
                if (undefined === ls[param]) {
                    if (undefined === defaultValue) {
                        return null;
                    } else {
                        storage.set(param, defaultValue);
                        return defaultValue;
                    }
                }
                try {
                    return JSON.parse(ls.getItem(param));
                } catch (e) {
                    console.debug(e);
                    return ls.getItem(param);
                }
            }
            // get all or get by regrex
            var result = {};
            for (var index = 0; index < ls.length; index ++) {
                var key = ls.key(index);
                var value = "";
                try {
                    value = JSON.parse(ls.getItem(key));
                } catch (e) {
                    value = ls.getItem(key);
                }
                if (param instanceof RegExp) {
                    if (param.test(key)) {
                        result[key] = value;
                    }                   
                } else {
                    result[key] = value;
                }
            }
            return result;
        },

        remove: function(param){
            if ("string" === analyzeType(param)) {
                ls.removeItem(param);
            }
            if (param instanceof RegExp) {
                for (var index = 0; index < ls.length; index ++) {
                    var key = ls.key(index);
                    if (param.test(key)) {
                        ls.removeItem(key);
                    }
                }
            }
            if ("array" === analyzeType(param)) {
                for (var index = 0; index < param.length; index ++) {
                    var key = param[index];
                    ls.removeItem(key);
                }
            }
        }
    }

    function analyzeType(o){
        switch (Object.prototype.toString.call(o)) {
            case "[object Object]":
                return "object";
            case "[object Array]":
                return "array";
            case "[object Number]":
                return "number";
            case "[object Boolean]":
                return "boolean";
            case "[object String]":
                return "string";
            default:
                return "undefined";
        }
    }

    return storage;
}));
