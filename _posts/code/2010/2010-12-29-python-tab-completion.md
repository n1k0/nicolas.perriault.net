---
title: Enabling tab completion in OS X Python interactive interpreter
date: 2010-12-29
categories: code
tags: autocomplete command line homebrew osx python
---

Python is awesome, and so is its native interactive interpreter. I [discovered today](http://sontek.net/tips-and-tricks-for-the-python-interpreter) that it can even provide autocompletion using a very simple trick:

Append this to your `~/.profile`:

    export PYTHONSTARTUP=$HOME/.pythonrc.py

And in a new `~/.pythonrc.py` file:

    try:
        import readline
    except ImportError:
        print("Module readline not available.")
    else:
        import rlcompleter
        readline.parse_and_bind("tab: complete")

Source it:

    $ source ~/.profile

Magic? Well if like me you're running Mac OS X, it won't work, no autocompletion, nada. OS X seems to ship with a very poor (and obsolete) python, and no `readline` implementation — which is mandatory to achieve our purpose.

So while being at tweaking up my python setup, let me get rid of the Apple stuff and install a fresh version of python using [Homebrew](http://mxcl.github.com/homebrew/), a great package manager for OSX:

    $ brew install readline python

Tadaa! Now you get autocompletion, plus a shiny python 2.7.1 (you could also install latest python3 running `brew install python3` by the way).

As a side note, if you [work with virtualenvs](http://blog.akei.com/post/573774396/installer-django-dans-un-environnement-python-virtuel) like me, creating a new env will now involve specifying which python you want to use:

    $ mkvirtualenv -p /usr/local/Cellar/python/2.7.1/bin/python \
        --no-site-packages `pwd`/env

That's all folks.
