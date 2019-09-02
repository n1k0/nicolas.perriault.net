---
title: Install PIL within a virtualenv on Snow Leopard
date: 2010-12-03
categories: code
tags: osx python programming devops system
---

As a personal reminder, here's how to install [PIL](http://www.pythonware.com/products/pil/) with jpeg and freetype support in a Python [virtualenv](/post/573774396/installer-django-dans-un-environnement-python-virtuel) with a little help from [Homebrew](https://github.com/mxcl/homebrew):

```terminal
$ brew install jpeg
$ wget http://mirrors.fe.up.pt/pub/nongnu/freetype/freetype-2.4.4.tar.gz
$ tar xvzf freetype-2.4.4.tar.gz && cd freetype-2.4.4
$ ./configure && make && sudo make install
$ cd .. && rm -rf freetype-2.4.4*
$ mkvirtualenv fubar --no-site-packages
(fubar)$ pip install PIL
```

You should obtain something like this at the end of the installation process:

```terminal
--------------------------------------------------------------------
PIL 1.1.7 SETUP SUMMARY
--------------------------------------------------------------------
version       1.1.7
platform      darwin 2.6.1 (r261:67515, Jun 24 2010, 21:47:49)
              [GCC 4.2.1 (Apple Inc. build 5646)]
--------------------------------------------------------------------
--- TKINTER support available
--- JPEG support available
--- ZLIB (PNG/ZIP) support available
--- FREETYPE2 support available
*** LITTLECMS support not available
--------------------------------------------------------------------
```

That's all for today folks, thanks for your attention.

**EDIT:** If you want [little-cms](http://www.littlecms.com/) support, just run:

```terminal
$ brew install little-cms
(fubar)$ pip install PIL
```
