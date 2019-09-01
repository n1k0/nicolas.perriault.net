---
title: Flatten JavaScript Pyramids with Async.js
date: 2013-02-05
categories: code
tags: javascript async programming
---

<figure>
    <img src="/static/code/2013/pyramids.png" alt="">
    <figcaption>
        <a href="https://secure.flickr.com/photos/dkrape/5154684093/">Pyramid of Menkaure, by Darren Krape</a></figcaption>
</figure>

I've recently open-sourced [hubot-mood], a [hubot] script to store a team's mood and get some metrics about it. We're using it at [Scopyleft](http://scopyleft.fr/).

Moods are stored in [redis] through the [node-redis] library, which uses asynchronous calls to perform operations on the redis backend.

So typically, to store an entry, you do something like the following:

```js
function store(mood, cb) {
    redis.rpush("moods", mood, function(err) {
        cb(err, mood);
    });
}

store("2013-02-01:n1k0:sunny", function(err, mood) {
    if (err) throw err;
    console.log("stored mood entry: " + mood);
});
```

Classic. But what if you want to perform multiple insertions, eg. to load a bunch of fixtures for your tests? I'm using [mocha] here:

```js
describe("moods test", function() {
    // fixtures
    var moods = [
        "2013-02-01:n1k0:sunny"
      , "2013-02-02:n1k0:cloudy"
      , "2013-02-03:n1k0:stormy"
      , "2013-02-04:n1k0:rainy"
      // … we could add many more
    ];

    it("should do something useful with moods", function(done) {
        store(moods[0], function(err, mood) {
            assert.ifError(err);
            store(moods[1], function(err, mood) {
                assert.ifError(err);
                store(moods[2], function(err, mood) {
                    assert.ifError(err);
                    store(moods[3], function(err, mood) {
                        assert.ifError(err);
                        // now let's test stuff with stored moods
                        done();
                    });
                });
            });
        });
    });
});
```

Here we go again, [callback hell] and unmanageable pyramids.

## Async.js to the rescue

[Async.js] is a node library to help dealing with *asynchronicity* and flatten pyramids. A `npm install async` later, we're ready to go:

```js
describe("moods tests", function() {
    var moods = [
        "2013-02-01:n1k0:sunny"
      , "2013-02-02:n1k0:cloudy"
      , "2013-02-03:n1k0:stormy"
      , "2013-02-04:n1k0:rainy"
      // … we could add many more
    ];

    it("should do something useful with moods", function(done) {
        async.parallel([
            function(cb) {
                store(mood[0], function(err, mood) {
                    cb(err, mood);
                });
            },
            function(cb) {
                store(mood[1], function(err, mood) {
                    cb(err, mood);
                });
            },
            function(cb) {
                store(mood[2], function(err, mood) {
                    cb(err, mood);
                });
            },
            function(cb) {
                store(mood[3], function(err, mood) {
                    cb(err, mood);
                });
            },
        ], function(err, moods) {
            assert.ifError(err);
            // now let's test stuff with stored moods
            done();
        });
    });
});
```

## Wait a minute, it's not "better" at all!

Indeed, this is definitely not [DRY code]. But one has to be creative to turn a tool into an efficient solution; let's invoke the powers of [`Array#map`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map) to build the required callback functions out of our `moods` array:

```js
function load(fixtures, onComplete) {
    async.parallel(fixtures.map(function(fixture) {
        return function(cb) {
            store(fixture, function(err, result) {
                cb(err, result);
            });
        };
    }), onComplete);
}

describe("moods tests", function() {
    var moods = [
        "2013-02-01:n1k0:sunny"
      , "2013-02-02:n1k0:cloudy"
      , "2013-02-03:n1k0:stormy"
      , "2013-02-04:n1k0:rainy"
      // … we could add many more
    ];

    it("should do something useful with moods", function(done) {
        load(moods, function(err, storedMoods) {
            assert.ifError(err);
            // now let's test stuff with stored moods
            done();
        });
    });
});
```

**Edit:** there's even a built-in `async.map()` function, not sure how I missed it; so the code is even shorter:

```js
describe("moods tests", function() {
    var moods = [
        "2013-02-01:n1k0:sunny"
      , "2013-02-02:n1k0:cloudy"
      , "2013-02-03:n1k0:stormy"
      , "2013-02-04:n1k0:rainy"
      // … we could add many more
    ];

    it("should do something useful with moods", function(done) {
        async.map(moods, store, function(err, storedMoods) {
            assert.ifError(err);
            // now let's test stuff with stored moods
            done();
        });
    });
});
```

[Async.js] is a great package and one of the most popular of the [node ecosystem], but there are [many others](https://npmjs.org/browse/keyword/async).

Such a library combined with a [functional approach](http://cjohansen.no/talks/2012/sdc-functional/) provides a killer combo to solve your daily problems when programming [JavaScript].

[Async.js]: https://github.com/caolan/async
[callback hell]: http://callbackhell.com/
[DRY code]: https://en.wikipedia.org/wiki/Don't_repeat_yourself
[hubot]: http://hubot.github.com/
[hubot-mood]: https://github.com/scopyleft/hubot-mood
[JavaScript]: /code/2013/why_javascript/
[mocha]: http://visionmedia.github.com/mocha/
[node-redis]: https://github.com/mranney/node_redis
[node]: http://nodejs.org/
[node ecosystem]: http://npmjs.org/
[redis]: http://redis.io/
