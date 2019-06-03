var LS = function(type){
    var self = this;
    self._storage = (type === 'session' ? window.sessionStorage : window.localStorage);

    self.set = function(name, value) {
        try {
            if (isUndifined(name) || isUndifined(value)) {
                throw new Error("name or value is not defined!!!");
            }
            self._storage.setItem(name, value);
        } catch (e){
            console.error(e);
        }
    }

    self.get = function(name) {
        if (undefined === self._storage.getItem(name)) {
            if (undefined !== defaultValue) {
                self.set(name, defaultValue);
                return defaultValue;
            } else {
                return null;
            }
        }
        try {
            return JSON.parse(self._storage.getItem(name));
        } catch (e) {
            self.set(name, defaultValue);
            return defaultValue;
        }
    }

    self.remove = function(name) {
        self._storage.removeItem(name)
    }

    function isUndifined(key){
        if (key === undefined) {
            return true;
        }
        return false;
    }
}