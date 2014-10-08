date: 2013-12-01
title: Functional JavaScript for crawling the Web
published: true

I've been giving JavaScript & [CasperJS] training sessions lately, and was
amazed how few people are aware of the [Functional Programming] capabilities of
JavaScript. Many couldn't see obvious usage of these in Web development, which
is a bit of a shame if you ask me.

Let's take things like `map` and `reduce` from the `Array` prototype:

    function square(x) {
      return x * x;
    }

    function sum(x, y) {
      return x + y;
    }

    [1, 2, 3].map(square).reduce(sum)
    // 14

I've been hearing a few times things like:

> Well yeah that's cool, but I don't do maths, I'm a Web developer.

And each time it turns me a little sad.

### Disclaimer

As we're programming language hipsters, in this article we'll use [ES6 short
function syntax] which has landed a few weeks ago in [Firefox Nightlies] and
eases a lot writing code in the functional style:

    var square = x => x * x;
    var sum = (x, y) => x + y;

    [1, 2, 3].map(square).reduce(sum)
    // 14

We'll also use other ES6 features as well because, you know, today is our
future already.

This article contents will also probably hurt some people feelings, probably
because there's a lot to hate in there when you come from a pure OOP landscape.
**Please think of this article as an exercise of thought instead of yet another
new JavaScript tutorial™.**

### Crawling the DOM using FP

Take this DOM fragment featuring a good ol' data table as an example:

    <table>
      <thead>
        <tr>
          <th>Country</th>
          <th>Population (M)</th>
          <th>GNP (B)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Belgium</td><td>11.162</td><td>419</td></tr>
        <tr><td>France</td><td>63.820</td><td>2246</td></tr>
        <tr><td>Germany</td><td>80.640</td><td>3139</td></tr>
        <tr><td>Greece</td><td>10.758</td><td>298</td></tr>
        <tr><td>Italy</td><td>59.789</td><td>1871</td></tr>
        <tr><td>Netherlands</td><td>16.795</td><td>713</td></tr>
        <tr><td>Poland</td><td>38.548</td><td>782</td></tr>
        <tr><td>Portugal</td><td>10.609</td><td>252</td></tr>
        <tr><td>United Kingdom</td><td>64.231</td><td>2290</td></tr>
        <tr><td>Spain</td><td>46.958</td><td>1432</td></tr>
      </tbody>
    </table>

To map the country names to a regular array of strings:

    var rows = document.querySelectorAll("tbody tr");
    [].map.call(rows, row => row.querySelector("td").textContent);
    // ["Belgium", "France", "Germany", "Greece", "Italy", …]

It worked: our map operation transformed a list of DOM table row elements to the
text value of their very first cell. Well, it feels like we could probably
enhance the code ergonomics a bit here.

>**Note:** *If you wonder why do we use `[].map.call` in lieu of just calling
>`map` from the element list prototype, that's because `NodeList` doesn't
>implement the `Array` interface… <small>Yeah, I know.</small>*

As an illustrative exercise, let's write our own `map` function to make a passed
iterable always exposing the `Array` interface; also, let's invert the order of
passed args to ease further composability (more on this later):

    const map = (fn, iterable) => [].map.call(iterable, fn);

>**Note:** we declare `map` as a constant to avoid any accidental mess. Also, I
>don't see obvious reasons for a function to be mutated here.

So we can write:

    var rows = document.querySelectorAll("tbody tr");
    map(row => row.querySelector("td").textContent, rows);
    // ["Belgium", "France", "Germany", "Greece", "Italy", …]

As a side note, this `map` implementation also works for strings:

    map(x => x.toUpperCase(), "foo");
    // ["F", "O", "O"]

We can also write a tiny abstraction on top of `querySelectorAll`, again to
ensure further composability:

    const nodes = (sel, root) => (root || document).querySelectorAll(sel);

So now we can write:

    var rows = nodes("tbody tr");
    map(node => nodes("td", node)[0].textContent, rows);
    // ["Belgium", "France", "Germany", "Greece", "Italy", …]

Hmm, the operations being performed within the function passed to `map` (finding
a first child node, getting an element property value) sound like things we're
most likely to do many times while extracting information from the DOM. And then
we'd probably want better code semantics as well.

For starters, let's create a `first()` function for finding the first element
out of a collection:

    const first = iterable => iterable[0];
    // first([1, 2, 3]) => 1

Our example becomes:

    map(node => first(nodes("td", node)).textContent, rows);
    // ["Belgium", "France", "Germany", "Greece", "Italy", …]

In the same vein, we could use a `prop()` [higher order function] —
basically a function returning a function — one more time to create a reusable &
composable property getter (we'll get back to this, read on):

    const prop = name => object => object[name];
    // const getFoo = prop("foo");
    // getFoo({foo: "bar"}) => "bar"

If you struggle understanding how this works, this is how we would write `prop`
using current function syntax:

    function prop(name) {
      return function(object) {
        return object[name];
      };
    }

Let's use our new property getter generator:

    const getText = prop("textContent");

    map(node => getText(first(nodes("td", node))), rows);
    // ["Belgium", "France", "Germany", "Greece", "Italy", …]

Now, how about having a generic for finding a node's child elements from a
selector? Let's do this:

    const finder = selector => root => nodes(selector, root);

    const findCells = finder("td");
    findCells(document.querySelector("table")).length
    // 30

Don't panic, again this is how we'd write it using standard function declaration
syntax:

    function finder(selector) {
      return function(root) {
        return nodes(selector, root);
      }
    }

Let's use it:

    const getText = prop("textContent");
    const findCells = finder("td");

    map(node => getText(first(findCells(node))), rows);
    // ["Belgium", "France", "Germany", "Greece", "Italy", …]

At this point, you may be wondering how this is possibly improving code
readability and maintainability… Now is the perfect time to use [function
composition] (you waited for it), to aggregate & chain minimal bits of reusable
code.

>Note: If you're familiar with the UNIX philosophy, that's exactly the same
>approach as when using the pipe operator:
>
>      $ ls -la | awk '{print $2}' | grep pattern | wc -l

Let's create a `sequence` function to help composing functions sequentially:

    const sequence = function() {
      return [].reduce.call(arguments, function(comp, fn) {
        return () => comp(fn.apply(null, arguments));
      });
    };

This one is a bit complicated; it basically takes all functions passed as
arguments and returns a new function capable of processing them sequencially,
passing to each the result of the previous execution:

    const squarePlus2 = sequence(x => 2 + x, x => x * x);
    squarePlus2(4);
    // 4 * 4 + 2 => 18 => Aspirine is in the bathroom

In classic notation without using a sequence, that would be the equivalent of:

    function plus2(x) {
        return 2 + x;
    }

    function square(x) {
        return x * x;
    }

    function squarePlus2(x) {
        return plus2(square(x));
    }

    squarePlus2(4);
    // 18

By the way, `sequence` is a very good place to use [ES6 Rest Arguments] which
have also landed recently in Gecko; let's rewrite it accordingly:

    const sequence = function(...fns) {
      return fns.reduce(function(comp, fn) {
        return (...args) => comp(fn.apply(null, args));
      });
    };

Let's use it in our little DOM crawling example:

    const getText = prop("textContent");
    const findCells = finder("td");

    map(sequence(getText, first, findCells), rows)
    // ["Belgium", "France", "Germany", "Greece", "Italy", …]

What I like the most about the FP style is that it actually describes fairly
well what's going to happen; you can almost read the code as you'd read plain
English *(caveat: don't do this at family dinners).*

Also you may want to have the functions passed in the opposite order, ala UNIX
pipes, which usually enhances legibility a bit for seasonned functional
programmers; let's create a `compose` function for doing just that:

    const compose = (...fns) => sequence.apply(null, fns.reverse());

    map(compose(findCells, first, getText), rows);
    // ["Belgium", "France", "Germany", "Greece", "Italy", …]

### Wait, is this really better?

As a side note, one may argue that:

    map(sequence(getText, first, findCells), rows);

Is not much really better than:

    map(row => getText(first(findCells(row))), rows);

Though the composed approach is probably more likely to scale when adding many
more functions to the stack:

    a(b(c(d(e(f(g(h(foo))))))));
    sequence(a, b, c, d, e, f, g, h)(foo);

Last, a composed function is itself composable by essence, and that's probably a
killer feature:

    map(sequence(getText, sequence(first, findCells)), rows);
    // ["Belgium", "France", "Germany", "Greece", "Italy", …]

Which something like this:

    var crawler = new Crawler("table");
    crawler.findCells("tbody tr").first().getText();

Is hardly likely to offer.

## A few more examples

To compute the total population of listed countries:

    const reduce = (fn, init, iterable) => [].reduce.call(iterable, fn, init);
    const second = (iterable) => iterable[1];
    const sum = (x, y) => x + y;

    var populations = map(compose(findCells, second, getText, parseFloat),
                          rows);
    reduce(sum, 0, populations);
    // 403.31000000000006

To generate a JSON export of the whole table data:

    const partial = (fn, ...r) => (...a) => fn.apply(null, r.concat(a))
    const nth = n => (iterable) => iterable[n - 1];
    const third = nth(3);
    const getTexts = partial(map, getText);
    const asObject = (data) => ({
      name:       first(data),
      population: parseFloat(second(data)),
      gnp:        parseFloat(third(data))
    });

    var countries = map(compose(findCells, getTexts, asObject), rows);
    JSON.stringify(countries);
    // "[{"name":"Belgium","population":11.162,"gnp":419}, …

To compute the global average
<acronym title="Gross National Product">GNP</acronym> per capita for these
countries:

    const perCapita = c => ({name: c.name, perCapita: c.gnp / c.population});

    var gnpPerCapita = map(perCapita, countries);
    JSON.stringify(gnpPerCapita);
    // "[{"name":"Belgium","perCapita":37.5380756136893}, …

To filter countries having more than `n€` of GNP per capita, sort them by
descending order and export the result as JSON:

    const select = (fn, iterable) => [].filter.call(iterable, fn)
    const sort = (fn, iterable) => [].sort.call(iterable, fn);

    const sortDesc = partial(sort, (a, b) => a.perCapita > b.perCapita ? -1 : 1);
    const healthy = partial(select, c => c.perCapita > 38);

    const healthyCountries = compose(healthy, sortDesc);
    JSON.stringify(healthyCountries(gnpPerCapita));
    // "[{"name":"Netherlands","perCapita":42.45311104495385}, …

I could probably go on and on, but you get the picture. This post is not to
claim that the FP approach is the best of all in JavaScript, but that it
certainly has its advantages. Feel free to play with these concepts for a while
to make your mind, eventually :)

If you're interested in Functional JavaScript, I suggest the following
resources:

- [Pure, functional JavaScript], an inspiring talk from Christian Johansen;
- [JavaScript Allongé], an online book which covers most of its aspects in a
  very comprehensive style (you should buy it);
- [List Out of Lambda], a blog post from Steve Losh where he reinvents lists
  purely using functions in JavaScript (!);
- If you're hooked with FP (yay!), have a look at [Clojure] and its port
  targetting the JavaScript platform, [ClojureScript].

If you're interested in ECMAScript 6, here are some good links to read about:

- [The state of JavaScript](http://brendaneich.github.io/Strange-Loop-2012/) — Brendan Eich, Strange Loop 2012
- [ECMAScript 6 support in Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/ECMAScript_6_support_in_Mozilla)

[CasperJS]: http://casperjs.org/
[Clojure]: http://clojure.org/
[ClojureScript]: https://github.com/clojure/clojurescript
[ES6 Rest Arguments]: https://blog.mozilla.org/jorendorff/2012/05/29/rest-arguments-and-default-arguments-in-javascript/
[ES6 short function syntax]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/arrow_functions
[Firefox Nightlies]: http://nightly.mozilla.org/
[Functional Programming]: http://en.wikipedia.org/wiki/Functional_Programming
[function composition]: http://en.wikipedia.org/wiki/Function_composition
[higher order function]: http://en.wikipedia.org/wiki/Higher-order_function
[JavaScript Allongé]: https://leanpub.com/javascript-allonge/read
[List out of Lambda]: http://stevelosh.com/blog/2013/03/list-out-of-lambda/
[Pure, functional JavaScript]: http://vimeo.com/43382919
