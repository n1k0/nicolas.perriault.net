---
title: Setup Jenkins for working with a private Github repository
date: 2011-11-16
categories: code
tags: github git jenkins
---

As I've just lost an hour and some hairs dealing with trying to setup a [Jenkins](http://jenkins-ci.org/) project connected to a private repository hosted on [Github](https://github.com/), I thought it's worth a quick blog post. I'm using [Ubuntu](http://ubuntu.com/).

So first `su` as the `jenkins` user to create some SSH keypair:

    $ ssh-keygen -p

Notice the `-p` option; this will allow to avoid asking for a passphrase (which Jenkins cannot so running as a daemon).

Try to ssh on github:

    $ ssh -T git@github.com
    The authenticity of host 'github.com (207.97.227.239)' can't be established.
    RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
    Are you sure you want to continue connecting (yes/no)? yes
    Hi username/reponame! You've successfully authenticated, but GitHub does not provide shell access.

Notice that you're asked to allow github's hostname to be added to your `known_hosts` file: without completing this step, you're doomed.

Now, in the Jenkins project configuration interface, set the private repository url using the `git` protocol, eg. `git@github.com:username/reponame.git`.

That's it, Jenkins will be able to clone and use your private repo.

If you know a better way, [I'm all ears](/contact/).
