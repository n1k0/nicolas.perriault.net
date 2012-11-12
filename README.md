My blog
=======

These are the whole code and contents of my [personal weblog](https://nicolas.perriault.net/), open sourced.

Basically it's a static website builder/generator based on [Python](http://python.org/), [Flask](http://flask.pocoo.org/), [Frozen-Flask](http://packages.python.org/Frozen-Flask/) and cool other bricks.

**Read more about the technical concepts behind the code… [on my blog](https://nicolas.perriault.net/code/2012/dead-easy-yet-powerful-static-website-generator-with-flask/)** (so if you didn't know about recursivity yet, now you do).

Installation
------------

Note: you need a working installation of Python and [pip](http://pypi.python.org/pypi/pip).

    $ git co https://github.com/n1k0/nicolas.perriault.net.git
    $ cd nicolas.perriault.net
    $ virtualenv --no-site-packages `pwd`/env
    $ source env/bin/activate
    (env)$ pip install -r requirements.txt

Deploying
---------

**Don't deploy this as is.** It's my personal weblog, remember? The code has been opensourced for educational purpose only.

Also, see the [License section](#license) of this document for more information about contents copyright.

Usage
-----

The `site` exec at the root of the repository is the only command you'll need to call to make this whole crap work:

To serve the website locally (optionaly in `DEBUG=True` mode):

    $ ./site serve --debug
    * Running on http://127.0.0.1:5000/
    * Restarting with reloader

This is useful when you want to see changes without having to rebuild the whole suite.

To build the static website:

    $ ./site build

Generated HTML files and assets will go to the `./build/` directory.

To deploy the website (caveat: my server address is harcoded ^^):

    $ ./site deploy

There's also two commands for creating new posts and add new photos:

    $ ./site post code --title="My title"
    Created /Users/niko/Sites/nperriault/pages/code/2012/my-title.md
    $ cat pages/code/2012/my-title.md
    title: My title
    date: 2012-10-05
    published: false

Same for the `./site photo` command.

License
-------

Contents in `./pages` and `./static/photography` (blog posts and photos) are licensed under the terms of the [Creative Commons BY-NC-SA license](http://creativecommons.org/licenses/by-nc-sa/3.0/).

All the rest including Python code, templates, CSS & javascript is released under the terms of the [Do What The Fuck You Want To Public License](http://sam.zoy.org/wtfpl/).

**Important note: You can freely reuse parts of the project code, but you can't republish the blog with its contents as is publicly on the Interwebs.**

Supplementary Caveats
---------------------

- It's up to you not being a dick with all of this, but I'm confident with that.
- This code won't especially be maintained for other purpose than my own needs.
