My blog
=======

This repository holds code & contents of my [personal weblog](https://nicolas.perriault.net/).
It's a static website built using [Jekyll](https://jekyllrb.com) and the
[Hydeout theme](https://github.com/fongandrew/hydeout). It's hosted on
[Github Pages](https://pages.github.com).

Install
-------

Ensure [Ruby](https://www.ruby-lang.org/) is installed.

```
$ gem install jekyll bundler
$ bundle
$ bundle exec jekyll serve
```

Now browse to [localhost:4000](http://localhost:4000/).

### Live reload

To run the blog locally with auto-reload, install [browser-sync](https://www.npmjs.com/package/browser-sync):

```
$ npm install -g browser-sync
```

And run:

```
$ bundle exec jekyll browser-sync 
```

Deploy
------

The blog uses [Github Pages](https://help.github.com/en/articles/about-github-pages-and-jekyll) for automatic deployment, so it's just matter of:

```
$ git push master
```

Image optimization
------------------

```
$ sudo apt install jpegoptim optipng
$ find static -name "*.jpg" | xargs jpegoptim
$ find static -name "*.png" | xargs optipng
```

License
-------

Contents in `./_posts` are licensed under the terms of the [Creative Commons BY-NC-SA license](http://creativecommons.org/licenses/by-nc-sa/3.0/).
