---
title: Get your Frontend JavaScript Code Covered
date: 2013-09-29
categories: code
tags: frontend programming testing javascript
---

So finally you're [testing your frontend JavaScript code]? Great! The more you
write tests, the more confident you are with your code… but how much precisely?
That's where [code coverage](http://en.wikipedia.org/wiki/Code_coverage) might
help.

The idea behind code coverage is to record which parts of your code (functions,
statements, conditionals and so on) have been executed by your test suite, to
compute metrics out of these data and usually to provide tools for navigating
and inspecting them.

Not a lot of frontend developers I know actually test their frontend code, and I
can barely imagine how many of them have ever setup code coverage… Mostly
because there are not many frontend-oriented tools in this area I guess.

Actually I've only found one which provides an adapter for [Mocha] and actually
works…

<blockquote class="twitter-tweet tw-align-center">
  <p>
    Drinking game for web devs: <br>
    (1) Think of a noun<br>
    (2) Google &quot;&lt;noun&gt;.js&quot;<br>
    (3) If a library with that name exists - drink
  </p>
  &mdash; Shay Friedman (@ironshay)
  <a href="https://twitter.com/ironshay/statuses/370525864523743232">August 22, 2013</a>
</blockquote>

**[Blanket.js](http://blanketjs.org/)** is an *easy to install, easy to configure,
and easy to use JavaScript code coverage library that works both in-browser and
with nodejs.*

Its use is dead easy, adding Blanket support to your Mocha test suite is just
matter of adding this simple line to your HTML test file:

```html
<script src="vendor/blanket.js"
        data-cover-adapter="vendor/mocha-blanket.js"></script>
```

Source files: [blanket.js](https://raw.github.com/alex-seville/blanket/master/dist/qunit/blanket.min.js),
              [mocha-blanket.js](https://raw.github.com/alex-seville/blanket/master/src/adapters/mocha-blanket.js)

As an example, let's reuse the silly `Cow` example we used [in a previous episode]:

```js
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
```

And its test suite, powered by Mocha and [Chai]:

```js
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
    it("should greet passed target", function() {
      var greetings = (new Cow("Kate")).greets("Baby");
      expect(greetings).to.equal("Kate greets Baby");
    });
  });
});
```

Let's create the HTML test file for it, featuring Blanket and its adapter for
Mocha:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test</title>
  <link rel="stylesheet" media="all" href="vendor/mocha.css">
</head>
<body>
  <div id="mocha"></div>
  <div id="messages"></div>
  <div id="fixtures"></div>
  <script src="vendor/mocha.js"></script>
  <script src="vendor/chai.js"></script>
  <script src="vendor/blanket.js"
          data-cover-adapter="vendor/mocha-blanket.js"></script>
  <script>mocha.setup('bdd');</script>
  <script src="cow.js" data-cover></script>
  <script src="cow_test.js"></script>
  <script>mocha.run();</script>
</body>
</html>
```

**Notes**:

- Notice the `data-cover` attribute we added to the script tag loading the
  source of our library;
- The HTML test file *must* be served over HTTP for the adapter to be loaded.

Running the tests now gives us something like this:

![screenshot](/static/code/2013/blanket-coverage.png)

As you can see, the report at the bottom highlights that we haven't actually
tested the case where an error is raised in case a target name is missing.
We've been informed of that, nothing more, nothing less. We simply know we're
missing a test here. Isn't this cool? I think so!

Just remember that code coverage will only [bring you numbers] and raw
information, not actual proofs that the whole of your *code logic* has been
actually covered. If you ask me, the best inputs you can get about your code
logic and implementation ever are the ones issued out of [pair programming]
sessions and [code reviews] — but that's another story.

**So is code coverage silver bullet? No. Is it useful? Definitely. Happy testing!**

[Blanket]: http://blanketjs.org/
[Mocha]: http://visionmedia.github.io/mocha/
[Chai]: http://chaijs.com/
[bring you numbers]: http://codebetter.com/karlseguin/2008/12/09/code-coverage-use-it-wisely/
[testing your frontend JavaScript code]: /code/2013/testing-frontend-javascript-code-using-mocha-chai-and-sinon/
[in a previous episode]: /code/2013/testing-frontend-javascript-code-using-mocha-chai-and-sinon/
[code reviews]: http://alexgaynor.net/2013/sep/26/effective-code-review/
[pair programming]: http://www.extremeprogramming.org/rules/pair.html
