title: CasperJS hits 1.0 stable
date: 2012-12-24
published: true

<img src="/static/code/2012/casperjs-logo-squared-rounded.png" alt="" style="float:right;margin-left:1em;margin-bottom:.5em">**Hey, [long time no see](/code/2012/introducing-casperjs-toolkit-phantomjs), right? Quite a lots of things have happened to my *tiny* [CasperJS](http://casperjs.org/) pet project since then, which has just hit its [1.0 stable milestone](https://github.com/n1k0/casperjs/blob/master/CHANGELOG.md#2012-12-24-v10). Merry Christmas :)**

First, some scary metrics about the project:

<figure>
    <a href="http://gitego.com/n1k0/casperjs#watchers?interval=by_year"><img src="/static/code/2012/casperjs-github-evolution.png" alt="" style="width:100%;border-radius:5px"></a>
    <figcaption>Where will all of this end? Capture courtesy of <a href="http://gitego.com/n1k0/casperjs#watchers?interval=by_year">gitego.com</a></figcaption>
</figure>

- the project has now more than [**1000 <em>stargazers</em>**](https://github.com/n1k0/casperjs/stargazers) and [**150 forks**](https://github.com/n1k0/casperjs/network) on github
- more than [**900 commits**](https://github.com/n1k0/casperjs/graphs/commit-activity) have been pushed to the master branch (430 just for the [documentation](https://github.com/n1k0/casperjs/tree/gh-pages) one)
- [**47 people**](https://github.com/n1k0/casperjs/graphs/contributors) have contributed patches and docs to the project; I hereby want to hug them all!
- [**683 tests**](https://travis-ci.org/n1k0/casperjs) ensure the software is actually stable
- **387 members** are subscribed to the [mailing-list](https://groups.google.com/forum/#!forum/casperjs)
- [**88 questions**](http://stackoverflow.com/questions/tagged/casperjs) have been posted on Stack Overflow about CasperJS
- [**400 people**](https://twitter.com/casperjs_org/followers) are following the [@casperjs_org](https://twitter.com/casperjs_org) twitter account

Btw here's a short excerpt of what people are saying on twitter about it:

<center>
<blockquote class="twitter-tweet"><p>Trying out CasperJS. I am blown away <a href="http://t.co/4sThrr7v" title="http://casperjs.org/">casperjs.org</a></p>&mdash; Beau (@beaumartinez) <a href="https://twitter.com/beaumartinez/status/281467492759646210" data-datetime="2012-12-19T18:34:14+00:00">December 19, 2012</a></blockquote>

---

<blockquote class="twitter-tweet"><p>Selenium : j'ai jamais pu piffré. Casperjs c'est de la balle ! J'ai installé, et réalisé mes premiers tests en 15 minutes. Merci @<a href="https://twitter.com/n1k0">n1k0</a></p>&mdash; Laurent Jouanneau (@ljouanneau) <a href="https://twitter.com/ljouanneau/status/278278668189593601" data-datetime="2012-12-10T23:22:59+00:00">December 10, 2012</a></blockquote>

---

<blockquote class="twitter-tweet" lang="en"><p>Turns out that @<a href="https://twitter.com/phantomjs">phantomjs</a> with casperjs for headless, in-browser integration testing is rather awesome. Recommended.</p>&mdash; Boris Terzic (@boristerzic) <a href="https://twitter.com/boristerzic/status/275920317908656129" data-datetime="2012-12-04T11:11:44+00:00">Décembre 4, 2012</a></blockquote>

---

<blockquote class="twitter-tweet"><p>@<a href="https://twitter.com/n1k0">n1k0</a> Thanks for CasperJS. If we ever meet in person, I owe you a beer.</p>&mdash; Stephen Hay (@stephenhay) <a href="https://twitter.com/stephenhay/status/274435181077753856" data-datetime="2012-11-30T08:50:20+00:00">November 30, 2012</a></blockquote>

---

<blockquote class="twitter-tweet"><p>sweet goodness -- Phantom.JS + Casper.JS is what we always wanted for testing client-side stuff</p>&mdash; christian verkerk (@chrisverkerk) <a href="https://twitter.com/chrisverkerk/status/273220063761408000" data-datetime="2012-11-27T00:21:54+00:00">November 27, 2012</a></blockquote>

</center>
<p style="text-align:center"><strong><code>&lt;/brag&gt;&lt;realism&gt;</code></strong></p>

That makes a lot of attention — and therefore expectations — for what started as a *tiny helper script on top of PhantomJS*… and put a bit of pressure on my shoulders :)

## So what's new in CasperJS 1.0?

Lots of stuff, and [I mean it](https://github.com/n1k0/casperjs/issues?direction=asc&milestone=1&sort=created&state=closed). In no particular order:

- added a [`casperjs test` command](http://casperjs.org/testing.html#casper-test-command) to run test scripts
- added support for [CSS3 and XPath selectors](http://casperjs.org/selectors.html)
- added support for [popups](casperjs.org/api.html#casper.waitForPopup) and [(i)frames](http://casperjs.org/api.html#casper.withFrame)
- there's now a way to specify how many tests were planned when `done()` is called
- easy access of current HTTP response object as the first parameter of step callbacks (thx <a href="https://tiwtter.com/oncletom">oncletom</a>!)
- many new [assertions methods](http://casperjs.org/api.html#tester) have been added to the `Tester` class
- added a convenient [Batch](http://en.wikipedia.org/wiki/Batch_file) script for Windows users <small>that's where you gotta love your community</small>
- better contextualization of errors, nicer output of them
- XUnit XML test result logs now contain the duration of each test case
- added many new [events and filters](http://casperjs.org/events-filters.html) so you can hook quite wherever you want into the casper asynchronous workflow
- better compliance with PhantomJS' native `evaluate()` argument passing
- plus many bugfixes, refactors and other enhancements

As a side note:

- PhantomJS 1.6.x support has been dropped
- PhantomJS [1.7](http://phantomjs.org/release-1.7.html) & [1.8](http://phantomjs.org/release-1.8.html) are supported

## The CasperJS ecosystem

As I realized that opensource projects based on CasperJS were created, I decided to open [a dedicated github organization](https://github.com/casperjs), first for trying to list them in a central place.

Some interesting CasperJS-based projects:

- **[SpookyJS](https://github.com/WaterfallEngineering/SpookyJS)**, which basically allow driving CasperJS from [Node.js](http://nodejs.org/)
- **[resurectio](https://github.com/ebrehault/resurrectio)**, a [Chrome](http://www.google.com/chrome) extension for recording your casper tests
- **[casper-chai](https://github.com/brianmhunt/casper-chai)** extends [Chai](http://chaijs.com/) with assertions for CasperJS
- **[grunt-casperjs](https://github.com/ronaldlokers/grunt-casperjs)** and **[grunt-functional](https://github.com/caiges/grunt-functional)**, both based on [grunt](http://gruntjs.com/), allowing to launch your CasperJS tests as well as other javascript build operations in a single command line call
- **[PhantomCSS](https://github.com/Huddle/PhantomCSS)**, which provides integration of js-imagediff with PhantomJS (and CasperJS) for automated visual regression testing
- **[yadda](https://github.com/acuminous/yadda)**, which has just started but is [genuinely exciting](https://github.com/acuminous/yadda/blob/master/examples/casper/google-scenario.js), intends to bring [BDD](http://en.wikipedia.org/wiki/Behavior-driven_development) to CasperJS
- … and many other [cool & useful projects](https://github.com/casperjs)

## The future

- **CasperJS 1.1 is on its way starting today**, and will provide new features and bugfixes, trying not to reinvent the capser wheel
- CasperJS 2.0 will probably be a big <del>rewrite</del> refactor of the 1.x codebase, and will try to use more of the existing javascript ecosystem (think [mocha](http://visionmedia.github.com/mocha/) for instance)… but let's enjoy the 1.x for a while first! <small>and let me have a bit of sleep too</small>

See ya.
