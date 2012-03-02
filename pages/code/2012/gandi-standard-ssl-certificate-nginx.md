title: Gandi Standard SSL Certificate & Nginx
date: 2012-02-29
published: true

[Gandi](http://gandi.net/) offers a [free SSL certificate](http://wiki.gandi.net/en/ssl/free) during one year for any domain you buy there, nice. But the setup is a bit tedious and the documentation a bit disparate, so here's an attempt for a comprehensive howto for configuring a secured [nginx](http://nginx.org/) vhost using your *free* certificate.

**Disclaimer:** *Gandi's quite complicated email confirmation and validation worflow won't be covered in this post. Just ensure you can receive emails at `admin@domain.tld` where `domain.tld` is your domain.*

## Creating your certificate

On your server, ensure you have the [`openssl`](http://openssl.org/) command available or install it. Then, [generate your CSR](http://wiki.gandi.net/en/ssl/csr) (`domain.tld` is your actual domain):

    $ openssl req -nodes -newkey rsa:2048 -keyout domain.tld.key \
        -out domain.tld.csr

Answer a few questions from the program, but here's the most important bit: **enter your domain or subdomain when prompted to provide a _Common Name_**:

    Common Name (eg, YOUR name) []: domain.tld

As they say:

> The process will create 2 files: a public `.csr` file, and a private `.key` file which you must absolutely keep private.

**Note:** *Alas, you won't be able to extend your certicate to all possible subdomains using a wildcard as it is [only supported starting with their *«Pro»* offer](http://wiki.gandi.net/questions/fr/ssl/csr/multi-domaine-non-accepte).*

Have a coffee.

---

## Enter <del>Sandman</del> Franz Kafka

Next, head to your [Gandi domain management page](https://www.gandi.net/admin/domain), select your domain, click on  *SSL Certificate: Manage*, click on *Activate this certificate* then Paste the content of the generated `domain.tld.csr` file into the textarea and submit the form. Then wait for some email from Gandi to confirm your demand.

In the meanwhile, [retrieve the intermediate certificate](http://wiki.gandi.net/en/ssl/intermediate) from the [SSL certificate management page](https://www.gandi.net/admin/ssl/manage) of your Gandi account, clicking on the tiny magnifying glass next to your domain name (the one with a nicely hidden *«Get the certificate»* tooltip on rollover); you'll get both the certificate and *Gandi's operational certificate authority* files:

- `cert-domain.tld.pem`, where `domain.tld` is your actual domain
- `GandiStandardSSLCA.pem`

Upload them both to your server, store them in eg. `/etc/nginx/certificates/` (nope, this directory is unlikely to exist by default; do as you like).

Last, you have to append the Gandi CA to your domain certificate:

    $ cat GandiStandardSSLCA.pem >> cert-domain.tld.crt

Have a capuccino.

---

## Configuring the nginx vhost

Here's a sample vhost server configuration for nginx, kept as concise as possible for the sake of brevity and clarity:

    server {
        listen 443;
        server_name "domain.tld";
        root /var/www/your_website_root;

        ssl on;
        ssl_certificate     /etc/nginx/certificates/cert-domain.tld.crt;
        ssl_certificate_key /etc/nginx/certificates/domain.tld.key;
    }

Restart nginx and you should be able to access your website using `https://domain.tld/`.

To redirect all HTTP trafic to HTTPS for this server, add this:

    server {
        listen 80;
        server_name "domain.tld";
        rewrite ^(.*) https://$host$1 permanent;
    }

Have a latte.

## Conclusion

At this point, you should be seriously considering quitting caffeine. As a positive note, it looks like the whole process will be revamped in *some weeks*:

<blockquote class="twitter-tweet tw-align-center" data-in-reply-to="174864441731588096">
    <p>@<a href="https://twitter.com/n1k0">n1k0</a> browsers (ff and others) allow us to validate via a DNS entry we will change the workflow in some weeks when we'll put it in the API.</p>&mdash; gandi.net (@gandi_net) <a href="https://twitter.com/gandi_net/status/174909743612166144" data-datetime="2012-02-29T17:31:47+00:00">February 29, 2012</a>
</blockquote>

If you're looking for other alternatives than Gandi for getting SSL certs, it seems that many people are speaking well of [StartSSL](http://www.startssl.com/) despite their ugly site, but I didn't use the service myself.

---

## References

- [Gandi SSL wiki pages](http://wiki.gandi.net/en/ssl)
- [Installer un certificat Gandi SSL Standard sur Nginx](http://www.informathic.com/post/2010/12/24/installer-ssl-gandi-nginx) (French)
