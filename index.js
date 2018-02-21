var cached = require('cached');
var CachemanRedis = require('cacheman-redis');
/**
 * 
 * @param {string} type memory|memcache|redis
 */
module.exports = function (type, opt) {
    var cache;
    opt = opt || {};
    var getTTL;
    if (type == 'redis') {
        cache = new CachemanRedis({ host: opt.server || '127.0.0.1', port: opt.port || 6379 });
        // fix the API to be the same for all provider
        cache.unset = function () {
            this.del.apply(this, arguments);
        }
        getTTL = function(ttl){
            return self.decodeTTL(ttl);
        };
        close = function(){
            cache.client.quit();
        };
    } else {
        cache = cached(opt.name || 'noname', {
            backend: {
                type: type
            }
        });
        getTTL = function(ttl){
            //Object with second
            return {expire:self.decodeTTL(ttl)}
        };
        close = function(){};
    }
    var self = {
        /**
         * Log a message
         */
        messsage: function (type, message, data) {
            console[type]("[Super-cache]" + message, data);
        },
        /**
         * Set a value at a given key for a time to live
         * @param {string} key the identifier
         * @param {any} value the value to store
         * @param {string} ttl the time to live in the cache like 3d -> 3 days, 1h-> 1 hour
         * @return {Promise} 
         */
        set: function (key, value, ttl) {
            return new Promise(function (resolve, reject) {
                var callback = function () {
                    resolve();
                };
                cache.set(key, value, ttl ? self.getTTL(ttl) : callback, ttl ? callback : undefined);
            });
        },
        /**
         * get a value at a given key if time to live hasn't expired
         * @param {string} key the identifier
         * @return {Promise} 
         */
        get: function (key) {
            return new Promise(function (resolve, reject) {
                cache.get(key, function (err, data) {
                    if (err) {
                        self.message("error", "Fail to get the data for key ", key, err);
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        },
        /**
         * unset a value at a given key
         * @param {string} key the identifier
         * @return {Promise} 
         */
        unset: function (key) {
            return new Promise(function (resolve, reject) {
                cache.unset(key, function (err, data) {
                    if (err) {
                        self.message("error", "Fail to unset the data for key ", key, err);
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        },
        decodeTTL: function (ttl) {
            //regex format time
            var regexp = /(([0-9]{1,2})([y|M|d|h|m|s]))/g;
            var match = regexp.exec(ttl);
            var codes = {};
            //format time
            while (match) {
                codes[match[3]] = match[2];
                match = regexp.exec(ttl);
            }
            //format('yMdhms');
            //transform year -> msec (365 * 24 * 60 * 60 * 1000)
            var numyears = codes.y ? (codes.y * 31536000000) : 0;
            //transform month -> msec (30 * 24 * 60 * 60 * 1000)
            var nummonths = codes.M ? (codes.M * 2592000000) : 0;
            //transform day -> msec (24 * 60 * 60 * 1000)
            var numdays = codes.d ? (codes.d * 86400000) : 0;
            //transform hour -> msec (60 * 60 * 1000)
            var numhours = codes.h ? (codes.h * 3600000) : 0;
            //transform min -> msec (60 * 1000 )
            var numminutes = codes.m ? (codes.m * 60000) : 0;
            //transform sec -> msec
            var numseconds = codes.s ? (codes.s * 1000) : 0;

            // time to live in seconds
            return (numyears + nummonths + numdays + numhours + numminutes + numseconds)/1000;
        }

    }
    self.getTTL = getTTL;
    self.close = close;
    return self;
}