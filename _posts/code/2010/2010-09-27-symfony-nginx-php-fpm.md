---
title: Hosting a Symfony app on NginX using PHP-FPM
date: 2010-09-27
categories: code
tags: nginx php-fpm symfony
---

I recently had to make a capacity planning study for a client of mine for which I've been developing a Symfony application. Despite the hardware/cloud architecture problem, I also tried to optimize application performances from a webserver software point of view (the application is currently hosted on a standard Apache2 server using mod_php5). I dug Google a bit and found some very enthusiastic comments on [PHP-FPM](http://php-fpm.org/), a PHP [FastCGI](http://www.fastcgi.com/) implementation and the [NginX](http://nginx.org/) web server.

While PHP-FPM has just [made it to PHP core](http://www.php.net/manual/fr/install.fpm.php) in version 5.3.3, the OS version of the linux server we are using, Ubuntu 10.04 LTS, only ships with 5.3.2. Fortunately, [Brian Mercer released a PHP-FPM sapi](https://launchpad.net/~brianmercer/+archive/php) for these particular OS and PHP versions.

So installing PHP and PHP-FPM on Ubuntu Lucid Lynx is as easy as:

```terminal
$ sudo apt-get install install python-software-properties
$ sudo add-apt-repository ppa:brianmercer/php
$ sudo apt-get update
$ sudo apt-get install php5-cli php5-common php5-mysql php5-suhosin \
    php5-gd php5-fpm php5-cgi php-pear php5-memcache php-apc
```

Of course, feel free to add any supplementary packages you need. To start up the PHP-FPM service, run:

```terminal
$ sudo service php5-fpm start
```
As a side note, the service will run on port 9000 by default, but you can tweak this up by editing its configuration file located at `/etc/php5/fpm/php-fpm.conf`.

Now, let's install the NginX web server:

```terminal
$ sudo apt-get install nginx
```
That's it. Let's create a new site configuration for our Symfony application in a new `/etc/nginx/sites-available/mywonderfulwebsite.org` file:

```nginx
server {
    set $website_host "mywonderfulwebsite.org";
    set $website_root "/var/www/mywonderfulwebsite/web";
    set $default_controller "index.php";
    set $symfony_root "/var/www/mywonderfulwebsite/lib/vendor/symfony";

    listen 80;
    server_name $website_host;

    # Gzip
    gzip on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_disable "MSIE [1-6]\.";

    access_log /var/log/nginx/$website_host.access.log;

    root $website_root;

    index $default_controller;

    charset utf-8;

    location /sf {
        # path to folder where all symfony assets are located
        alias $symfony_root/data/web/sf;
        expires max;
    }

    location / {
        # If the file exists as a static file serve it directly without
        # running all the other rewrite tests on it
        if (-f $request_filename) {
            expires max;
            break;
        }

        if ($request_filename !~ "\.(js|htc|ico|gif|jpg|png|css)$") {
            rewrite ^(.*) /$default_controller$1 last;
        }
    }

    location ~ "^(.+\.php)($|/)" {

        set $script $uri;
        set $path_info "/";

        if ($uri ~ "^(.+\.php)($|/)") {
            set $script $1;
        }

        if ($uri ~ "^(.+\.php)(/.+)") {
            set $script $1;
            set $path_info $2;
        }

        include /etc/nginx/fastcgi_params;
        fastcgi_pass 127.0.0.1:9000;

        fastcgi_param SCRIPT_FILENAME $website_root$script;
        fastcgi_param SCRIPT_NAME $script;
        fastcgi_param PATH_INFO $path_info;
    }
}
```

As you may have noticed, I'm taking part of the convenient custom variable system of the NginX configuration syntax, so you'll probably just have to adapt the `$website_host`, `$website_root`, `$default_controller` and `$symfony_root` variables to your project needs.

Enabling the website is achieved with a symbolic link, like this:

```terminal
$ sudo ln -sf /etc/nginx/sites-available/mywonderfulwebsite.org \
              /etc/nginx/sites-enabled/mywonderfulwebsite.org
```

Last but not least, don't forget to launch the webserver:

```terminal
$ sudo /etc/init.d/nginx start
```

I did some benchmarks but unfortunately the hardware configuration being quite different between the old and the new platform, the statistics generated did not make much sense. But the reactivity of the application, and memory footprint is much much better with the new setup (I know, this is not a very scientific statement).

### Sources

* [Install PHP-FPM 5.3.2 on Ubuntu 10.04](http://constantshift.com/install-php-fpm-5-3-2-on-ubuntu-10-04-lucid-lynx/)
* [Hosting symfony based website with nginx](http://symfonynotes.com/2009/12/04/hosting-symfony-based-website-with-nginx/)
