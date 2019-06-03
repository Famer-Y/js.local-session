// project : js.local-session

// github  : https://github.com/Famer-Y/js.local-session

;(function(root, factory){
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory();
	} else {
		var oldStorage = root.storage;
		var api = root.storage = factory(window).init();
		api.noConflict = function(type){
			api = factory(window).init(type);
			return api;
		}
	}
}(typeof window !== "undefined" ? window : this, function(window, type){
	var ls = window.localStorage;
	console.log(window, type);
	function storage() {
	}

	storage.set = function(name, value) {
		ls.setItem(name, JSON.stringify(value));
	}

	storage.get = function(name, defaultValue) {
		if (undefined === ls.getItem(name)) {
            if (undefined !== defaultValue) {
                storage.set(name, defaultValue);
                return defaultValue;
            } else {
                return null;
            }
        }
        try {
            return JSON.parse(ls.getItem(name));
        } catch (e) {
        	console.log(e);
            storage.set(name, defaultValue);
            return defaultValue;
        }
	}

	storage.remove = function(name) {
		ls.removeItem(name);
	}

	storage.init = function(){
		ls = type === "session" ? window.sessionStorage : window.localStorage;
		return storage;
	}
	return storage;
}));