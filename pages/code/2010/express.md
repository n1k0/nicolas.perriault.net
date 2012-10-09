title: A First Look at node.js and Express
date: 2010-09-01
tags: nodejs, framework, express
published: true

With all the hype coming to server-side Javascript lately, especially around [Node](http://nodejs.org/), I was feeling the need to give it a try to see how it goes. Also, getting back to work after three full weeks of unwired holidays was hard enough to worth deserving some playtime with cool and fun technologies.

Node is described as an *Evented I/O Framework for Google's V8 JavaScript Engine*. Think of it as a toolkit to produce high-performance distributed, event-driven and scalable non-blocking network servers. Okay, whatever the way I want to describe the project, it's buzzword-bingo™. Let's say it's mainly about catching events and react accordingly, to make load distribution and parallel processing easier and more effective.

### Installing Node

Installation on my Mac went smoothly and took nearly two minutes by compiling it from the sources; here's how I did (there might be easier or better ways, I don't really care):

    $ mkdir tmp
    $ git clone http://github.com/ry/node.git
    $ cd node
    $ ./configure && make && sudo make install

You now have access to the `node` executable available on your system.

A simple example of a Node HTTP server (put the code below in a `test.js` file):

    var http = require('http');

    var server = http.createServer(function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('Hello World');
      res.end();
    });

    server.listen(3000, "127.0.0.1");

Then launch the created webserver using the command line:

    $ node test.js

And point your browser at `http://127.0.0.1:3000` to get printed `Hello World`. Neat, huh?

### Introducing Express, a Web Framework on top of Node

[Express](http://expressjs.com/) is a Web framework built on top of Node, HTTP and [Connect](http://github.com/senchalabs/connect), allowing easy creation of full-fledged Web applications. It has [routing](http://expressjs.com/guide.html#Routing), handles [environments](http://expressjs.com/guide.html#Configuration) as well as several [template engines](http://expressjs.com/guide.html#Template-Engines) and [much more](http://expressjs.com/guide.html).

Installation is as easy as Node's one, so here we go:

    $ git clone http://github.com/visionmedia/express.git
    $ cd express
    $ git submodule update --init
    $ sudo make install && sudo make install-support

That's it. You can now write your own test application, eg. in a new `hello.js` file:

    var app = require('express').createServer();

    app.get('/', function(req, res){
        res.send('Hello World');
    });

    app.get('/hello/:name', function(req, res){
        res.send('Hello ' + req.param('name') + '!');
    });

    app.listen(3000, "127.0.0.1");

    console.log('Server running at http://127.0.0.1:3000/');

Launch your webapp server by the command line:

    $ node hello.js

Express and will create a Node server listening to the local port 3000, so head your favorite browser to `http://127.0.0.1:3000/` then `http://127.0.0.1:3000/hello/niko` to get the picture of what the above code does. Those familiar with Web framework such as rails, django or symfony won't be much disturbed.

Express also ships with an `express` executable which provides useful commands. To create a new `hello` application skeleton, just run:

     $ express hello
       create : hello
       create : hello/app.js
       create : hello/logs
       create : hello/public/javascripts
       create : hello/pids
       create : hello/public/stylesheets
       create : hello/public/stylesheets/style.less
       create : hello/public/images
       create : hello/views/partials
       create : hello/views/layout.jade
       create : hello/views/index.jade
       create : hello/test
       create : hello/test/app.test.js

Above command just created an `hello` project directory where you can cd into and launch the server by its default front controller `app.js`:

    $ cd hello
    $ node app.js
    Express server listening on port 3000

Note that the generated project skeleton implies using [Jade](jade-lang.com/) as a template engine and the [Less CSS syntax](http://lesscss.org/), while one might want to use something else, which is perfectly possible by [configuring](http://expressjs.com/guide.html#Configuration) the project differently.

Next steps documentation will be provided by [official Express documentation](http://expressjs.com/guide.html).

Of course, Express might not be as full-featured as older well-established Web frameworks, but for simple needs it can be pretty easy to setup and deploy, and — probably equally importantly — fun to play with and learn.

### Conclusion

As you can see, installing and using Node and Express is quite straightforward, even if you have to dig into the deeper Web to find docs, when they exist. Javascript is a great, agile and well-known language, and taking part of it server-side definitely makes sense if you want my opinion.

Let's see how this will evolve in the future, as there are not as many backend-oriented libs in JavaScript as there are in other languages like python, ruby or php yet. But [more and more node modules](http://github.com/ry/node/wiki/modules) are appearing day after day, such as [Mongoose](http://www.learnboost.com/mongoose/) or [Socket.IO](http://socket.io/), which I'll definitely be playing with as soon as possible.

Thanks for your attention, have fun, take care and don't break the Web.
