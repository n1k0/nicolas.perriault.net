---
title: Contact
permalink: /contact/
sidebar_link: true
sidebar_sort_order: 5
---

![illustration](/static/img/contact.jpg)

Your best bet for interacting with me is probably to [send me an email](mailto:nicolas@perriault.net) or use the form below:


<form class="contact-form" action="https://jumprock.co/mail/n1k0" method="post">
  <script>
  if (location.hash === "#success") {
    document.write('<div class="post-notice success">Message sent.</div>');
  }
  </script>
  <input type="hidden" name="after" value="{{ site.url }}/contact/#success">
  <input type="hidden" name="replyto" value="%email">
  <p><input type="text" name="subject" placeholder="Subject"></p>
  <p><input type="text" name="email" placeholder="Your email address"></p>
  <p><textarea name="message" placeholder="Your message" required></textarea></p>
  <p><input type="submit" value="Send message"></p>
</form>

You can also find me on
  [Github](https://github.com/n1k0),
  [Twitter](https://twitter.com/n1k0) and
  [Telegram](http://telegram.me/n1k0p).
