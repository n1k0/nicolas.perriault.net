---
title: About RESTful features of modern Web frameworks
date: 2010-04-28
categories: code
tags: php symfony programming
---

Frameworks like [Symfony](http://www.symfony-project.org/) or [rails](http://rubyonrails.org/) (and probably many others) provide a very convenient feature named *RESTful* routing, aka HTTP-aware urls and controllers, generally associated with an object/url mapping mechanism to expose Model entities and several available actions on them over HTTP.

This is really useful, especially when you deal with WebServices on a daily basis, or if you want to reuse your controllers in both *standard html* or *service oriented architecture* (SOA) contexts.

For example, with Symfony, you can declare an HTTP routes collection this way (all examples are taken from the [Sftunes Symfony application](http://github.com/n1k0/sftunes) I recently released on *github*):

```yaml
# routing.yml
fortune:
  class: sfDoctrineRouteCollection
  options:
    model:      Fortune
    action:     [list, new, create, edit, show]
    object_actions:
      comment:  post
      down:     put
      up:       put
    collection_actions:
      top:      get
      worst:    get
```

Here the `fortune` route collection will expose the `Fortune` Doctrine ORM model over HTTP, using available HTTP verbs like `GET`, `PUT`, `POST` or `DELETE` for example, hence providing basic CRUD operations (see [documentation](http://www.symfony-project.org/reference/1_4/en/10-Routing#chapter_10_sfroutecollection)).

You will then be able to obtain several Symfony routes, to list them just run the `app:routes` task from the command line:

    ~ $ ./symfony app:routes main
    >> app       Current routes for application "main"
    Name            Method Pattern
    fortune_top     GET    /fortune/top.:sf_format
    fortune_worst   GET    /fortune/worst.:sf_format
    fortune         GET    /fortune.:sf_format
    fortune_new     GET    /fortune/new.:sf_format
    fortune_create  POST   /fortune.:sf_format
    fortune_edit    GET    /fortune/:id/edit.:sf_format
    fortune_update  PUT    /fortune/:id.:sf_format
    fortune_delete  DELETE /fortune/:id.:sf_format
    fortune_show    GET    /fortune/:id.:sf_format
    fortune_comment POST   /fortune/:id/comment.:sf_format
    fortune_down    PUT    /fortune/:id/down.:sf_format
    fortune_up      PUT    /fortune/:id/up.:sf_format
    homepage        ANY    /

By calling an url such as `/fortune/2.html` using the `GET` verb, you'll obtain a response in *text/html* format, and Symfony will use a standard HTML template to decorate it -- whereas if you call `/fortune/2.json` using the `DELETE` verb, you'll ask for the deletion of the fortune related instance and receive a response in JSON format (at least if you provided the related JSON decoration template, of course).

That's pretty fancy, but a common mistake is to generate links from templates calling verbs other than `GET`, for example here the `fortune_up` and `fortune_down` routes aim to be called via `PUT` (because they imply a modification of a `Fortune` object instance), and you may be tempted to write something like this in you templates:

```php
<?php echo link_to('Vote down this fortune', 'fortune_down', $fortune, array(
  'method' => 'put',
)) ?>
```

While this is perfectly possible technically speaking, a quick look at the rendered HTML code will temper the interest of this approach:

```html
<a onclick="var f = document.createElement('form'); f.style.display = 'none';
  this.parentNode.appendChild(f); f.method = 'post'; f.action = this.href;
  var m = document.createElement('input'); m.setAttribute('type', 'hidden');
  m.setAttribute('name', 'sf_method'); m.setAttribute('value', 'put');
  f.appendChild(m);var m=document.createElement('input');m.setAttribute('type', 'hidden');
  m.setAttribute('name', '_csrf_token');
  m.setAttribute('value', 'd26d99f7f4f97lsdhklqejshdjkshdf860124');
  f.appendChild(m);f.submit();return false;" href="/main_dev.php/fortune/19/down">
    Vote down this fortune
</a>
```

Yes, calling `link_to()` with the `method` option set to something else than `GET` will generate a form to challenge the url with the correct HTTP verb (through the kinda magic `sf_method` request parameter), dynamically using Javascript. Not really clean, unobstrusive and accessible. **A link should always only handle `GET` verb, because it's just a link to another resource in *view mode*, not a modification of it.** So you should rather use a `<form/>` tag to deal with such kind of operations in your code, always.

But there's more: imagine you want to deal with a `Fortune` modification form, still by using the `PUT` http verb and the `fortune_update` route, in a *standard html* context (not a WebService one); you have a form so it's okay? It's not, a browser, even the most modern one in 2010, will not understand something else than `GET` and `POST`. That's a shame actually. Symfony circumvents the problem by adding a supplementary `sf_method` hidden parameter to the form fields, so the targeted controller will be able to detect an incoming `PUT` request, but **this is clearly a kind of patch applied to HTTP support in Browsers**.

I'm searching for a conclusion, but  can't find one except **why on Earth modern browsers don't deal with something else than `GET` and `POST` nowadays?**

Feel free to provide hints on this topic in the comments.

**Edit:** Just learnt via the comments that HTML5 draft spec includes support of `PUT` and `DELETE` HTTP verbs in forms ([source](http://bradley-holt.com/2009/07/html-5-http-methods-rest/) - thx jblanche).

Great, can't wait for [2022](http://www.webmonkey.com/2008/09/html_5_won_t_be_ready_until_2022dot_yes__2022dot/)!
