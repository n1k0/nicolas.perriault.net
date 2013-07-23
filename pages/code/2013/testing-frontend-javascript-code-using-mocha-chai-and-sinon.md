title: Testing your frontend JavaScript code using mocha, chai, and sinon
date: 2013-07-23
published: true

**As rich Web application complixity grows, if you want to keep your sanity, you need to unit test your frontend JavaScript code.**

For the 4 past months, I've been working for [Mozilla] on some big project where such testing strategy was involved. While I wish we could use [CasperJS] in this perspective, Firefox wasn't supported at the time and we needed to ensure proper compatibility with its JavaScript engine. So we went with using [Mocha], [Chai] and [Sinon] and they have proven to be a great workflow for us so far.

### The mocha testing framework and the chai expectation library

[Mocha] is a test framework while [Chai] is an expectation one. Let's say Mocha setups and describes test suites and Chai provides convenient helpers to perform all kinds of assertions against your JavaScript code.

So let's say we have a `Cow` object we want to unit test:

    // cow.js
    (function(exports) {
      "use strict";

      function Cow(name) {
        this.name = name || "Anon cow";
      }
      exports.Cow = Cow;

      Cow.prototype = {
        greets: function(target) {
          if (!target)
            throw new Error("missing target");
          return this.name + " greets " + target;
        }
      };
    })(this);

Nothing fancy, but we want to unit test this one.

Both Mocha and Chai can be used in a [Node] environment as well as within the browser; in the latter case, you'll have to setup a test HTML page and use special builds of those libraries:

- for Mocha: [setup instructions](http://visionmedia.github.io/mocha/#browser-support), [mocha.css](https://github.com/visionmedia/mocha/raw/master/mocha.css), [mocha.js](https://github.com/visionmedia/mocha/raw/master/mocha.js)
- for Chai: [setup instructions](http://chaijs.com/guide/installation/), [chai.js](http://chaijs.com/chai.js)

My advice is to store these files in a `vendor` subfolder. Let's create a HTML file to test our lib:

    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cow tests</title>
      <link rel="stylesheet" media="all" href="vendor/mocha.css">
    </head>
    <body>
      <div id="mocha"><p><a href=".">Index</a></p></div>
      <div id="messages"></div>
      <div id="fixtures"></div>
      <script src="vendor/mocha.js"></script>
      <script src="vendor/chai.js"></script>
      <script src="cow.js"></script>
      <script>mocha.setup('bdd')</script>
      <script src="cow_test.js"></script>
      <script>mocha.run();</script>
    </body>
    </html>

Please note we'll be using [Chai's *BDD* Expect API](http://chaijs.com/api/bdd/), hence the `mocha.setup('bdd')` call here.

Now let's write a simple test suite for our `Cow` object constructor in `cow_test.js`:

    var expect = chai.expect;

    describe("Cow", function() {
      describe("constructor", function() {
        it("should have a default name", function() {
          var cow = new Cow();
          expect(cow.name).to.equal("Anon cow");
        });

        it("should set cow's name if provided", function() {
          var cow = new Cow("Kate");
          expect(cow.name).to.equal("Kate");
        });
      });

      describe("#greets", function() {
        it("should throw if no target is passed in", function() {
          expect(function() {
            (new Cow()).greets();
          }).to.throw(Error);
        });

        it("should greet passed target", function() {
          var greetings = (new Cow("Kate")).greets("Baby");
          expect(greetings).to.equal("Kate greets Baby");
        });
      });
    });

Tests should be passing, so if you open the HTML document in your browser, you should get something like:

![sample mocha+chai results screenshot](/static/code/2013/cow-tests-ok.png)

If any of these expectations fails, you'll be notified in the test results, eg. if we change the implementation of `greets` as below:

      Cow.prototype = {
        greets: function(target) {
          if (!target)
            throw new Error("missing target");
          return this.name + " greets " + target + "!";
        }
      };

You'll get this instead:

![sample mocha+chai results screenshot](/static/code/2013/cow-tests-ko.png)

### How about testing asynchronous stuff?

Now imagine we implement a `Cow#lateGreets` method so the greetings come with a delay of one second:

      Cow.prototype = {
        greets: function(target) {
          if (!target)
            throw new Error("missing target");
          return this.name + " greets " + target + "!";
        },

        lateGreets: function(target, cb) {
          setTimeout(function(self) {
            try {
              cb(null, self.greets(target));
            } catch (err) {
              cb(err);
            }
          }, 1000, this);
        }
      };

We need to test this one as well, and Mocha helps us with its optional `done` callback for tests:

      describe("#lateGreets", function() {
        it("should pass an error if no target is passed", function(done) {
          (new Cow().lateGreets(null, function(err, greetings) {
            expect(err).to.be.an.instanceof(Error);
            done();
          }));
        });

        it("should greet passed target after one second", function(done) {
          (new Cow("Kate")).lateGreets("Baby", function(err, greetings) {
            expect(greetings).to.equal("Kate greets Baby");
            done();
          });
        });
      });

Conveniently, Mocha will highlight any suspiciously long operation with red pills in case it wasn't really expected:

![sample screenshot](/static/code/2013/cow-async-tests-ok.png)

### Using Sinon for faking the environment

When you do unit testing, you don't want to depend on stuff external to the unit of code under test. And while avoiding your functions to have side effects is usually a good practice, in Web development it's not always easy task (think DOM, Ajax, native browser APIs, etc.)

[Sinon] is a great JavaScript library for stubbing and mocking such external dependencies and to keep control on side effects against them.

As an example, let's imagine that our `Cow#greets` method wouldn't return a string but rather directly log them onto the browser console:

    // cow.js
    (function(exports) {
      "use strict";

      function Cow(name) {
        this.name = name || "Anon cow";
      }
      exports.Cow = Cow;

      Cow.prototype = {
        greets: function(target) {
          if (!target)
            return console.error("missing target");
          console.log(this.name + " greets " + target);
        }
      };
    })(this);

How to unit test this? Well, Sinon to the rescue! First, let's add the [Sinon script](http://sinonjs.org/releases/sinon-1.7.1.js) to our HTML test file:

    <!-- ... -->
    <script src="vendor/mocha.js"></script>
    <script src="vendor/chai.js"></script>
    <script src="vendor/sinon-1.7.1.js"></script>

We'll *stub* the `console` object's `log` and `error` methods so we can check they're called and what's passed to them:

    var expect = chai.expect;

    describe("Cow", function() {
      var sandbox;

      beforeEach(function() {
        // create a sandbox
        sandbox = sinon.sandbox.create();

        // stub some console methods
        sandbox.stub(window.console, "log");
        sandbox.stub(window.console, "error");
      });

      afterEach(function() {
        // restore the environment as it was before
        sandbox.restore();
      });

      // ...

      describe("#greets", function() {
        it("should log an error if no target is passed in", function() {
          (new Cow()).greets();

          sinon.assert.notCalled(console.log);
          sinon.assert.calledOnce(console.error);
          sinon.assert.calledWithExactly(console.error, "missing target")
        });

        it("should log greetings", function() {
          var greetings = (new Cow("Kate")).greets("Baby");

          sinon.assert.notCalled(console.error);
          sinon.assert.calledOnce(console.log);
          sinon.assert.calledWithExactly(console.log, "Kate greets Baby")
        });
      });
    });

Several things to be noticed here:

- `beforeEach` and `afterEach` are part of the Mocha API and allow to define setup and tear down operations for each test;
- Sinon provides sandboxing, basically allowing to define and attach a set of stubs to a sandbox object you'll be able to restore at some point;
- When stubbed, *real* functions are not called at all, so here obviously nothing will be printed onto the browser console;
- Sinon ships with its own assertion library, hence the `sinon.assert` calls; a [sinon-chai](https://github.com/domenic/sinon-chai) plugin exists for Chai, you may want to have a look at it.

**There are many cool other aspects of [Mocha], [Chai] and [Sinon] I couldn't cover in this blog post, but I hope it opened your appetite for investigating more about them. Happy testing!**


[CasperJS]: http://casperjs.org/
[Chai]: http://chaijs.com/
[Mocha]: http://visionmedia.github.io/mocha/
[Mozilla]: http://mozilla.org/
[Node]: http://nodejs.org/
[PhantomJS]: http://phantomjs.org/
[Selenium]: http://seleniumhq.org/
[Sinon]: http://sinonjs.org/
[SlimerJS]: http://slimerjs.org/
[Travis]: http://travis-ci.org/
