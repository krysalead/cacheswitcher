super-cache
==========

This library is a wrapper around [https://github.com/groupon/node-cached](cached) and [https://github.com/cayasso/cacheman-redis](cacheman-redis), it makes easy to switch from one to the other with configuration. It also make all APIs the same, same methods, same parameters. Not all APIs are wrapped but the common ones. It also add the Promise style on all the method

Supported APIs
--------------

* __set__ which set a value
    * __key__: string as the unique key to set
    * __value__: any type that you want to store
    * __ttl__: string that represent the time to live like 3d -> 3 days, 1h -> 1 hour ...
* __get__
    * __key__: string as the unique key to retrieve
* __unset__
    * __key__: string as the unique key to remove

Install
-------

```
npm install super-cache
```

usage
-----

Simple memory cache
```javascript

var superCache = require('super-cache')('memory');
superCache.set('mykey',12345).then(function(){
    superCache.get('mykey').then(function(data){
        console.log(data);
        superCache.unset('mykey').then(function(){
            console.log('Clean');
        });
    })
})

```

Redis cache
```javascript

var superCache = require('super-cache')('redis',{server:'127.0.0.1',port:6379});
superCache.set('mykey',12345).then(function(){
    superCache.get('mykey').then(function(data){
        console.log(data);
        superCache.unset('mykey').then(function(){
            console.log('Clean');
        });
    })
})
```

Redis cache with ttl
```javascript

var superCache = require('super-cache')('redis',{server:'127.0.0.1',port:6379});
superCache.set('mykey',12345,'3d').then(function(){
    //3 days later
    superCache.get('mykey').then(function(data){
        console.log(data); // -> undefined
        superCache.unset('mykey').then(function(){
            console.log('Clean');
        });
    })
})

```

Constructor
----------

* __type__: string like memory | redis
* __opt__: Object with following properties
    * __server__: only for redis
    * __port__: only for redis
    * __name__: only for memory namespace

Test
----

