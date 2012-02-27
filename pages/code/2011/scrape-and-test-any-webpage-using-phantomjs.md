title: Scrape and test any webpage using PhantomJS
date: 2011-08-27
tags: phantomjs, javascript, testing
published: true

Have you ever tried to scrape or harvest data from an existing website —
I mean, even ajax-bloated ones? Did you ever attempt to test
javascript-dependent interactions within a Web application you built?
Well, if you answered yes to one of the questions above, you might be
interested in [PhantomJS](http://phantomjs.org/).

PhantomJS is a *headless WebKit with JavaScript API*. By headless, they
mean you can script a real [Webkit](http://webkit.org/) based browser
with no need for a full graphical interface installed.

### Installation

On OSX, installation can be achieved using
[homebrew](https://github.com/mxcl/homebrew) (note that
[XCode](static/itunes.apple.com/fr/app/xcode/id448457090?mt=12) must be
installed on your machine):

    $ brew install phantomjs

It can take a bit of time for the binaries to be built, especially
because of their dependency to [Qt4](static/qt.nokia.com/products). When
it's done, you can test it this way:

    $ phantomjs
    Usage: phantomjs [options] script.[js|coffee] [script argument [script argument ...]]
    Options:
        --load-images=[yes|no]             Load all inlined images (default is 'yes').
        --load-plugins=[yes|no]            Load all plugins (i.e. 'Flash', 'Silverlight', ...) (default is 'no').
        --proxy=address:port               Set the network proxy.
        --disk-cache=[yes|no]              Enable disk cache (at desktop services cache storage location, default is 'no').
        --ignore-ssl-errors=[yes|no]       Ignore SSL errors (i.e. expired or self-signed certificate errors).

Installation instructions for other platforms and alternative methods
can be found on [the PhantomJS project
wiki](http://code.google.com/p/phantomjs/wiki/Installation).

As a side note, there's also a Python implementation of PhantomJS,
[PyPhantomJS](http://dev.umaclan.com/projects/pyphantomjs), which adds
[plugins](http://dev.umaclan.com/projects/pyphantomjs/wiki/Plugins)
support! Also, I've found myself having no segfault using the Python
version while the standard one is a bit more unstable on my box (no
troll please).

To install PyPhantomJS, let's use
[`pip`](http://www.pip-installer.org/):

    $ pip install PyPhantomJS

The PyPhantomJS executable is named — *surprise* — `pyphantomjs`:

    $ pyphantomjs
    usage: pyphantomjs [options] script.[js|coffee] [script argument [script argument ...]]
    Minimalistic headless WebKit-based JavaScript-driven tool
    positional arguments:
      script.[js|coffee]    The script to execute, and any args to pass to it
    optional arguments:
      -h, --help            show this help message and exit
      --disk-cache {yes,no}
                            Enable disk cache (default: no)
      --ignore-ssl-errors {yes,no}
                            Ignore SSL errors (default: no)
      --load-images {yes,no}
                            Load all inlined images (default: yes)
      --load-plugins {yes,no}
                            Load all plugins (i.e. Flash, Silverlight, ...) (default: no)
      --proxy address:port  Set the network proxy
      -v, --verbose         Show verbose debug messages
      --version             show this program's version and license

Usage of the two versions is exactly the same.

### Basic usage

PhantomJS scripts can be written in standard JavaScript or in
[CoffeeScript](http://jashkenas.github.com/coffee-script/). Mainly
matter of taste here, but CoffeeScript syntax [looks really
interesting](http://robots.thoughtbot.com/post/9251081564/coffeescript-spartan-javascript).

So let's write our first script, we want to retrieve the weather
forecast for a given city using Google:

    // script: meteo.js
    var page = new WebPage()
    , output = { errors: [], results: null };
    if (phantom.args.length == 0) {
        console.log('You must specify a city, eg. "Paris, France"');
        phantom.exit(1);
    }
    page.open('http://www.google.fr/search?q=meteo+' + phantom.args[0], function (status) {
        if (status !== 'success') {
            output.errors.push('Unable to access network');
        } else {
            var cells = page.evaluate(function(){
                try {
                    var cells = document.querySelectorAll('.tpo tr tr')[4].querySelectorAll('td');
                    return Array.prototype.map.call(cells, function(cell) {
                        return cell.innerText.replace(/[^0-9]/g, '');
                    });
                } catch (e) {
                    return [];
                }
            });
            if (!cells || !cells.length > 0) {
                output.errors.push('No valid meteo data found');
            } else {
                output.results = {
                    city: phantom.args[0],
                    today: {
                        afternoon: cells[1],
                        morning:   cells[2],
                    },
                    tomorrow: {
                        afternoon: cells[3],
                        morning:   cells[4],
                    }
                };
            }
            console.log(JSON.stringify(output, null, '    '));
        }
        phantom.exit();
    });

Notice we use the `phantom.args` Array which contains the parameters
passed to the script.

The main magic happens in the `page.evaluate()` method, we pass it a
JavaScript function which will be evaluated **within the retrieved page
document environment**. It's a kind of *non-persistent XSS injection*
just to help you to operate on the page contents =)

Now it's time to launch the script to see how it goes:

    $ phantomjs meteo.js "Montpellier, France"
    {
        "errors": [],
        "results": {
            "city": "Montpellier, France",
            "today": {
                "afternoon": "29",
                "morning": "17"
            },
            "tomorrow": {
                "afternoon": "28",
                "morning": "17"
            }
        }
    }

Now with an invalid city name:

    $ phantomjs meteo.js "Unexistent City"
    {
        "errors": [
            "No valid meteo data found"
        ],
        "results": null
    }

Let's try with another city, an existing one this time:

    $ phantomjs meteo.js "Paris, France"
    {
        "errors": [],
        "results": {
            "city": "Paris, France",
            "today": {
                "afternoon": "21",
                "morning": "11"
            },
            "tomorrow": {
                "afternoon": "21",
                "morning": "11"
            }
        }
    }

As a side note and in case you were wondering, you now understand a bit
more why I moved to Montpellier ;)

### I CAN HAZ SCREENSHOTS

PhantomJS also allows some nice tricks like injecting scripts to the
remote page, very useful when a remote website doesn't ship with your
favorite framework (eg. [jQuery](http://jquery.com/))… or can render a
PNG image of a captured area of the webpage. The example below saves a
capture of the weather forecast area:

    // script: meteoclip.js
    var page = new WebPage();
    page.open('http://www.google.fr/search?q=meteo+montpellier,+France', function (status) {
        if (status !== 'success') {
            output.error = 'Unable to access network';
        } else {
            page.clipRect = {
                top: 127,
                left: 170,
                width: 400,
                height: 114
            }
            page.render('meteo.png');
            console.log('Capture saved');
        }
        phantom.exit();
    });

Running the `meteoclip.js` script will get yourself this fancy image
stored in `meteo.jpg`:

![image](http://cl.ly/0w2a050b3x2g170u053A/meteo.png)

There are tons of other cool topics to cover about PhantomJS, like
navigation handling, automated logging in, external resources
retrieving, functional testing, code organization… so I'll maybe post a
bit more about it soon, who knows!
