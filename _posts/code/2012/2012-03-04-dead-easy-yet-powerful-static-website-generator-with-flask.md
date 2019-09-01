---
title: Dead easy yet powerful static website generator with Flask
date: 2012-03-04
categories: code
tags: programming python site
---

It's been a long time I wanted to federate my online identities in a single, managed place — hence the website you're currently browsing. I've also been looking for a static website builder for some times, trying many and retaining zero. It was a bit depressing, frustrating to say the least.

Then I encountered [this tweet by Armin Ronacher](https://twitter.com/#!/mitsuhiko/statuses/166570613295689728):

<blockquote class="twitter-tweet tw-align-center">
    <p>Frozen-Flask is really, really useful. Should have used that earlier.</p>&mdash; Armin Ronacher (@mitsuhiko) <a href="https://twitter.com/mitsuhiko/status/166570613295689728" data-datetime="2012-02-06T17:15:03+00:00">February 6, 2012</a>
</blockquote>

[Armin](http://lucumr.pocoo.org/) is the author of [Flask](http://flask.pocoo.org/), a Python microframework I much appreciate for its simplicity, so this tweet immediately rang a bell and I started exploring the possibilities offered by [Frozen-Flask](http://packages.python.org/Frozen-Flask/).

Frozen-Flask basically *freezes* a Flask application into a set of static files, so you can host it without pain, but with speed. Combined with [Flask-FlatPages](http://packages.python.org/Flask-FlatPages/), you got the perfect set for generating your static website with everything you could expect by using a framework:

* cool uris & easy routing management
* powerful templating
* local, dynamic serving
* static version generation

## First iteration: project setup

Create a brand new [virtualenv](http://pypi.python.org/pypi/virtualenv) in a new directory and install the necessary packages using [pip](http://pypi.python.org/pypi/pip):

```terminal
$ mkdir sample_project && cd !$
$ mkvirtualenv --no-site-packages `pwd`/env
$ source env/bin/activate
$ pip install Flask Frozen-Flask Flask-FlatPages
```

Write a very first version of our app in a `sitebuilder.py` file:

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def index():
    return "Hello World!"

if __name__ == "__main__":
    app.run(port=8000)
```

Run it; you should see someting like:

```terminal
$ python sitebuilder.py
 * Running on http://127.0.0.1:8000/
 * Restarting with reloader
```

Ensure with your browser that everyting is going fine by heading at `http://127.0.0.1:8000/`.

## New iteration: adding *flat pages*

[Flask-FlatPages](http://packages.python.org/Flask-FlatPages/) provides a collection of pages to your Flask application. Pages are built from *flat* text files as opposed to a relational database.

Create a `pages/` directory at the root of your project folder, and put a `hello-world.md` file in there:

```terminal
$ mkdir pages
$ vi pages/hello-world.md
```

The `pages/hello-world.md`:

```markdown
title: Hello World
date: 2012-03-04

**Hello World**, from a *page*!
```

As you can see, we can write plain [Markdown](http://daringfireball.net/projects/markdown/) for our page contents. So let's rewrite our app to serve any flatpage by its filename:

```python
from flask import Flask
from flask_flatpages import FlatPages

DEBUG = True
FLATPAGES_AUTO_RELOAD = DEBUG
FLATPAGES_EXTENSION = '.md'

app = Flask(__name__)
app.config.from_object(__name__)
pages = FlatPages(app)

@app.route('/')
def index():
    return "Hello World"

@app.route('/<path:path>/')
def page(path):
    return pages.get_or_404(path).html

if __name__ == '__main__':
    app.run(port=8000)
```

Now requesting `http://127.0.0.1:8000/hello-world/` will display our flatpage. Note that the markdown source is converted to html by getting the `html` property of our page object.

## New iteration: adding templates

Flask uses the [Jinja2](http://jinja.pocoo.org/docs/) template engine, so let's create some templates to decorate our pages. First create a `templates` directory at the root of the project:

    $ mkdir templates

Create a base layout in `templates/base.html`:

{% raw  %}
```jinja
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>My site</title>
</head>
<body>
    <h1><a href="{{ url_for("index") }}">My site</a></h1>
{% block content %}
    <p>Default content to be displayed</p>
{% endblock content %}
</body>
</html>
```
{% endraw %}

Note the use of the `url_for()` template helper, that's the way we generate urls using Flask and Jinja2.

Now the `page.html` template to fill this layout with page contents:

{% raw  %}
```jinja
{% extends "base.html" %}

{% block content %}
    <h2>{{ page.title }}</h2>
    {{ page.html|safe }}
{% endblock content %}
```
{% endraw  %}

Our app is now:

```python
from flask import Flask, render_template
from flaskext.flatpages import FlatPages

DEBUG = True
FLATPAGES_AUTO_RELOAD = DEBUG
FLATPAGES_EXTENSION = '.md'

app = Flask(__name__)
app.config.from_object(__name__)
pages = FlatPages(app)

@app.route('/')
def index():
    return "Hello World"

@app.route('/<path:path>/')
def page(path):
    page = pages.get_or_404(path)
    return render_template('page.html', page=page)

if __name__ == '__main__':
    app.run(port=8000)
```

Hell, what did we just do?

* we created templates for our app; a common layout (`base.html`) and a page template (`page.html`)
* we used the `render_template` function to use the page template for decorating our pages
* the page template extends the base one to avoid copying and pasting stuff for every page on Earth

## New iteration: display the list of available pages on the homepage

For now our homepage has been a bit sick, to say the least. Let's make it an index of all available pages.

Create a `templates/index.html` with the following contents:

{% raw  %}
```jinja
{% extends "base.html" %}

{% block content %}
    <h2>List of stuff</h2>
    <ul>
    {% for page in pages %}
        <li>
            <a href="{{ url_for("page", path=page.path) }}">{{ page.title }}</a>
        </li>
    {% else %}
        <li>No stuff.</li>
    {% endfor %}
    </ul>
{% endblock content %}
```
{% endraw  %}

Feel free to create more flat pages, the same way we did with `hello-world.md`, storing the file into the `pages/` directory using the `.md` extension.

So the `index()` route of our app is now:

```python
@app.route('/')
def index():
    return render_template('index.html', pages=pages)
```

If you reload the homepage, a list of all available flatpages is displayed with a link for each. Damn, that was pretty easy.

## New iteration: adding metadata to pages

Flask-FlatPages allows to enter metadata for pages the same way we did for the title and the creation date with our `hello-world.md`, and access them using the `page.meta` property, which contains a plain silly python dict. That's pretty awesome when you think about it, heh?

So let's imagine you want tags for your pages, our `hello-world.md` becomes:

```markdown
title: Hello World
date: 2012-03-04
tags: [general, awesome, stuff]

**Hello World**, from a *page*!
```

For the records, metadata are described in [YAML](http://yaml.org/), so you can use strings, booleans, integers, floats, lists and even dicts which will be converted to their respective native Python equivalent.

We're going to use two different templates for listing general pages and tagged ones, using a shared template partial. Our `index.html` is now:

{% raw  %}
```jinja
{% extends "base.html" %}

{% block content %}
    <h2>List of stuff</h2>
    {% with pages=pages  %}
        {% include "_list.html" %}
    {% endwith %}
{% endblock content %}
```
{% endraw  %}

Create a new `tag.html` template, which will display the list of tagged pages:

{% raw  %}
```jinja
{% extends "base.html" %}

{% block content %}
    <h2>List of stuff tagged <em>{{ tag }}</em></h2>
    {% with pages=pages  %}
        {% include "_list.html" %}
    {% endwith %}
{% endblock content %}
```
{% endraw  %}

The new `_list.html` template we need for inclusion contains:

{% raw  %}
```jinja
<ul>
{% for page in pages %}
    <li>
        <a href="{{ url_for("page", path=page.path) }}">{{ page.title }}</a>
    {% if page.meta.tags|length %}
        | Tagged:
        {% for page_tag in page.meta.tags %}
            <a href="{{ url_for("tag", tag=page_tag) }}">{{ page_tag }}</a>
        {% endfor %}
    {% endif %}
    </li>
{% else %}
    <li>No page.</li>
{% endfor %}
</ul>
```
{% endraw  %}

Let's add a new `tag` route to our app, to use our new `tag.html` template:

```python
@app.route('/tag/<string:tag>/')
def tag(tag):
    tagged = [p for p in pages if tag in p.meta.get('tags', [])]
    return render_template('tag.html', pages=tagged, tag=tag)
```

**Note:** if you didn't like Python's [list comprehensions](http://www.network-theory.co.uk/docs/pytut/ListComprehensions.html) yet, now you do.

## New iteration: generate the static stuff

Well, for now we only have a dynamic website, which uses and serves flatpages stored on the filesystem: CRAP. But the idea's of course not to host a Flask app but a set of static files and assets to skip the need of any application server.

Here enters Frozen-Flask. Its use is damn easy:

```python
import sys

from flask import Flask, render_template
from flask_flatpages import FlatPages
from flask_frozen import Freezer

DEBUG = True
FLATPAGES_AUTO_RELOAD = DEBUG
FLATPAGES_EXTENSION = '.md'

app = Flask(__name__)
app.config.from_object(__name__)
pages = FlatPages(app)
freezer = Freezer(app)

@app.route('/')
def index():
    return render_template('index.html', pages=pages)

@app.route('/tag/<string:tag>/')
def tag(tag):
    tagged = [p for p in pages if tag in p.meta.get('tags', [])]
    return render_template('tag.html', pages=tagged, tag=tag)

@app.route('/<path:path>/')
def page(path):
    page = pages.get_or_404(path)
    return render_template('page.html', page=page)

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        freezer.freeze()
    else:
        app.run(port=8000)
```

And run:

```terminal
$ python sitebuilder.py build
```

Open the `build` folder generated by this command:

```terminal
$ tree
.
├── hello-world
│   └── index.html
├── index.html
└── tag
    ├── awesome
    │   └── index.html
    ├── general
    │   └── index.html
    └── stuff
        └── index.html

5 directories, 5 files
```

**MIND: BLOWN.**

You can now deploy the contents of this `build` directory to any webserver which's able to serve static files, and you're done. With just 34 lines of manually written Python code… not bad heh?

Of course, our website is pretty crappy right now, but you should be get started to add features on your own, now.
