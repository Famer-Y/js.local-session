// project : js.local-session

// github  : https://github.com/Famer-Y/js.local-session

;(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(root);
    } else {
        root.storage = factory(window);
    }
}(typeof window !== "undefined" ? window : this, function(window){
    var ls = window.localStorage;
    var storage = {
        set: function(){
            if (0 === arguments.length) {
                throw new Error("1 or 2 arguments required, but only 0 present.");
            }
            if (1 === arguments.length) {
                var param = arguments[0];
                if (Object !== analyzeType(param)) {
                    throw new Error("arguments must be Object, when the number of arguments only 1.");
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
                console.log(arguments);
                var name = arguments[0];
                var defaultValue = arguments[1];
                if (undefined === ls[name]) {
                    console.log(defaultValue);
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

        regex: function(){
            if (0 === arguments.length) {
                throw new Error("1 argument required, but only 0 present.");
            }
            if (arguments.length >= 1) {
                var pattern = arguments[0];
                if (!(pattern instanceof RegExp)) {
                    throw new Error("argument must be RegExp.");
                }
                var result = {};
                for (var index = 0; index < ls.length; index ++) {
                    var key = ls.key(index);
                    if (pattern.test(key)) {
                        try {
                            result[key] = JSON.parse(ls.getItem(key));  
                        } catch (e) {
                            console.debug(e);
                            result[key] = ls.getItem(key);
                        }
                    }
                }
                return result;
            }
        },

        remove: function(){
            if (0 === arguments.length) {
                throw new Error("1 argument required, but only 0 present.");
            }
            if (1 === arguments.length) {
                var param = arguments[0];
                if (Array === analyzeType(param)) {
                    for (var index = 0; index < param.length; index ++) {
                        var name = param[index];
                        ls.removeItem(name);
                    }
                } else if (String === analyzeType(param)) {
                    ls.removeItem(param);
                }
            }
        }
    }

    function analyzeType(o){
        switch (Object.prototype.toString.call(o)) {
            case "[object Object]":
                return Object;
            case "[object Array]":
                return Array;
            case "[object Number]":
                return Number;
            case "[object Boolean]":
                return Boolean;
            case "[object String]":
                return String;
            default:
                return undefined;
        }
    }

    return storage;
}));
