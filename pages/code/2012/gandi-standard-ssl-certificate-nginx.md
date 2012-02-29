title: Gandi Standard SSL Certificate & Nginx
date: 2012-02-29
published: false

[Gandi](http://gandi.net/) offers a [free SSL certificate](http://wiki.gandi.net/en/ssl/free) during one year for any domain you buy there, nice. But the setup is a bit tedious and the documentation a bit disparate, so here's an attempt for a comprehensive howto for configuring a secured [nginx](http://nginx.org/) vhost.

**Disclaimer:** Gandi's quite complicated email confirmation and validation worflow won't be covered in this post. Just ensure you can receive emails at `admin@domain.tld` where `domain.tld` is your domain.

## Creating your certificate

On your server, ensure you have the [`openssl`](http://openssl.org/) command available or install it. Then, [generate your CSR](http://wiki.gandi.net/en/ssl/csr) (`domain.tld` is your actual domain):

    $ openssl req -nodes -newkey rsa:2048 -keyout domain.tld.key \
        -out domain.tld.csr

Answer a few questions from the program, but here's the most important bit: **enter your domain or subdomain when prompted to provide a `Common Name (eg, YOUR name)`**:

    Common Name (eg, YOUR name) []: domain.tld

And as they say:

> The process will create 2 files: a public `.csr` file, and a private `.key` file which you must absolutely keep private.

**Note:** *Alas, you won't be able to extend your certicate to all possible subdomains using a wildcard as it is [only supported starting with their *«Pro»* offer](http://wiki.gandi.net/questions/fr/ssl/csr/multi-domaine-non-accepte).*

---

## Enter <del>Sandman</del> Franz Kafka

Next, you have to [retrieve the intermediate certificate](http://wiki.gandi.net/en/ssl/intermediate) from the [SSL certificate management page](https://www.gandi.net/admin/ssl/manage) of your Gandi account, clicking on the tiny magnifying glass next to your domain name (the one with a nicely hidden *«Get the certificate»* tooltip on rollover); you'll get both the certificate and *Gandi's operational certificate authority* files:

- `cert-domain.tld.pem`, where `domain.tld` is your actual domain
- `GandiStandardSSLCA.pem`

Upload them both to your server, store them in eg. `/etc/nginx/certificates/` (nope, this directory is unlikely to exist by default; do as you like).

Last, you'll have to alter your domain certificate with Gandi's one, if you don't want [Firefox to yell at you](http://www.informathic.com/post/2010/12/24/installer-ssl-gandi-nginx):

    $ cat GandiStandardSSLCA.pem >> cert-domain.tld.crt

---

## Configuring the nginx vhost

Here's a sample vhost server configuration for nginx, kept as concise as possible for the sake of brevity and clarity:

    server {
        listen 443;
        server_name "domain.tld";
        root /var/www/your_website_root;

        ssl on;
        ssl_certificate     /etc/nginx/certificates/cert-domain.tld.crt;
        ssl_certificate_key /etc/nginx/certificates/tld.net.key;
    }

Restart nginx and you should be able to access your website using `https://domain.tld/`.

---

## Bonus track: everything over SSL

For redirecting all HTTP trafic to HTTPS for this server, use this:

    server {
        listen 80;
        server_name "domain.tld";
        rewrite ^(.*) https://$host$1 permanent;
    }

---

## References

- [Gandi SSL wiki pages](http://wiki.gandi.net/en/ssl)
- [Installer un certificat Gandi SSL Standard sur Nginx](http://www.informathic.com/post/2010/12/24/installer-ssl-gandi-nginx) (French)