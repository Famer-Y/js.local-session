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

        get: function(){
            if (0 === arguments.length) {
                var result = {};
                for (var index = 0; index < ls.length; index ++) {
                    var key = ls.key(index);
                    try {
                        result[key] = JSON.parse(ls.getItem(key));
                    } catch (e) {
                        console.debug(e);
                        result[key] = ls.getItem(key);
                    }
                }
                return result;
            }
            if (arguments.length >= 1) {
                var name = arguments[0];
                var defaultValue = arguments[1];
                if (undefined === ls[name]) {
                    if (undefined === defaultValue) {
                        return null;
                    } else {
                        storage.set(name, defaultValue);
                        return defaultValue;
                    }
                }
                try {
                    return JSON.parse(ls.getItem(name));
                } catch (e) {
                    console.debug(e);
                    return ls.getItem(name);
                }
            }
        },

        getByRegex: function(){
            if (0 === arguments.length) {
                throw new Error("1 argument required, but only 0 present.");
            }
            return regex(arguments);
        },

        remove: function(){
            if (0 === arguments.length) {
                throw new Error("1 argument required, but only 0 present.");
            }
            if (1 === arguments.length) {
                var param = arguments[0];
                if ("array" === analyzeType(param)) {
                    for (var index = 0; index < param.length; index ++) {
                        var name = param[index];
                        ls.removeItem(name);
                    }
                } else if ("string" === analyzeType(param)) {
                    ls.removeItem(param);
                }
            }
        },

        removeByRegex: function(){
            if (0 === arguments.length) {
                throw new Error("1 argument required, but only 0 present.");
            }
            return regex(arguments, "remove");
        }
    }

    function regex() {
        var argument = arguments[0];
        var remove = analyzeType(arguments[1]) === 'string' && arguments[1] === "remove" ? true : false;
        if (argument.length >= 1) {
            var pattern = argument[0];
            var modifier = argument[1];
            var result = {};
            var regexp = new RegExp(pattern, modifier);
            for (var index = 0; index < ls.length; index ++) {
                var key = ls.key(index);
                if (regexp.test(key)) {
                    try {
                        result[key] = JSON.parse(ls.getItem(key));
                    } catch (e) {
                        console.debug(e);
                        result[key] = ls.getItem(key);
                    }
                    if (remove) {
                        ls.removeItem(key);
                    }
                }
            }
            return result;
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
