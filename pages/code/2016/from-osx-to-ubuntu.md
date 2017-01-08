date: 2017-01-08
title: From OSX to Ubuntu
published: true

**A year earlier I decided to switch from OSX to [Ubuntu], so now is a good time to make a little retrospective. TL;DR: Linux now offers a pleasant desktop user experience and there's no way back for me.**

!["Thou Shall Migrate", says a funny penguin. Credits: Hamish Irvine](/static/code/2016/thou-shall-migrate.jpg)

I was a Linux user 10 years ago but moved to being a Mac one, mainly because I was tired of maintaining an often broken system (hello *xorg.conf*), and Apple had quite an appealing offer at the time: a well-maintained Unix platform matching beautiful hardware, sought-after UX, access to editor apps like Photoshop and MS Office, so best of both worlds.

To be frank, I was a happy Apple user in the early years, then the shine started to fade; messing up your system after upgrades became more frequent, Apple apps grown more and more bloated and intrusive (hello iTunes), UX started turning Kafkaian at times, too often I was finding myself tweaking and repairing stuff from the terminal...

The trigger was pulled when Apple announced their 2015 MacBook line, with strange connectivity decisions like having a unique port for everything and using dongles: [meh](https://www.wired.com/2015/03/life-macbooks-single-port-wont-easyyet/). If even their top notch hardware started to turn weird, it was probably time to look elsewhere. And now I see their latest MBP line with the [Esc key removed](http://mashable.com/2016/10/27/twitter-reactions-apple-removes-escape-key/) (so you can't escape anymore, haha), I'm kinda comforted in my decision.

Meanwhile, since I've joined Mozilla and the [Storage team], I could see many colleagues happily using Linux, and it didn't feel like they were struggling with anything particular. Oddly enough, it seemed they were capable of working efficiently, both for professional and personal stuff.

I finally took the plunge and ordered a [Lenovo X1 Carbon], then started my journey to being a Linux user again.

## Choosing a distro

I didn't debate this for days, I installed the latest available [Ubuntu] right away as it was the distribution I was using before moving to OSX (I even [contributed](http://www.eyrolles.com/Informatique/Livre/ubuntu-9782212116083) to a book on it!). I was used to Debian-based systems and knew Ubuntu was still acclaimed for its ease of use and great hardware support. I wasn't disappointed as on the X1 everything was recognized and operational right after the installation, including wifi, bluetooth and external display.

I was greeted with the [Unity] desktop, which was disturbing as I was a Gnome user back in the days. Up to a point I installed the latter, though in its [version 3 flavor](https://www.gnome.org/gnome-3/), which was also new to me.

I like Gnome3. It's simple, configurable and made me feel productive fast. Though out of bad luck or skills and time to spend investigating, a few things were not working properly: fonts were huge in some apps and normal in others, external display couldn't be configured to a different resolution and dpi ratio than my laptop's, things like that. After a few weeks, I switched back to Unity, and I'm still happily using it today as it has nicely solved all the issues I had with Gnome (which I still like a lot though).

## The pain points when coming from OSX

Let's be honest, the Apple keyboard French layout is utter crap, but as many things involving muscle memory, once you're used to it, it's a pain in the ass to readapt to anything else. I struggled for something like three weeks fighting old habits in this area, then eventually got through.

Last, a bunch of OSX apps are not available on Linux, so you have to find their equivalent, when they exist. The good news is, most often they do.

## The Web is your App Store

What also changed in last ten years is the explosion of the Web as an application platform. While [LibreOffice] and [The Gimp] are decent alternatives to MS Office and Photoshop, you now have access to many similarly scoped Web apps like Google Docs and [Pixlr], provided you're connected to the Internet. Just ensure using a modern Web browser like Firefox, which luckily ships by default in Ubuntu.

For example I use [IRCCloud] for IRC, as Mozilla has a corporate account there. The cool thing is it acts as a bouncer so it keeps track of messages when you go offline, and has a nice [Android app](https://play.google.com/store/apps/details?id=com.irccloud.android.enterprise&hl=en) which syncs.

## When the Web isn't enough

There is obviously lots of things Web apps can't do, like searching your local files or updating your system. And let's admit that sometimes for specific tasks native apps are still more efficient and better integrated (by definition) than what the Web has to offer.

### Launcher & file search

I was a hardcore [Alfred.app] user on OSX. On Linux there's quite no strict equivalent though  [Unity Dash], [Albert] or [synapse] can cover most of its coolness.

<figure>
    <img src="/static/code/2016/unity-dash.gif" alt="Unity Dash in action" style="width:100%;border-radius:5px">
    <figcaption>Unity Dash in action</figcaption>
</figure>

<figure>
    <img src="/static/code/2016/synapse.gif" alt="synapse in action" style="width:100%;border-radius:5px">
    <figcaption>synapse in action</figcaption>
</figure>

If you use the text shortcuts feature of Alfred (or if you use [TextExpander]), you might be interested in [AutoKey] as well.

### File manager

I couldn't spot any obvious usability difference between [Nautilus] and the [OSX Finder], but I mostly use their basic features anyway.

![Nautilus in action](/static/code/2016/nautilus.png)

To emulate Finder's [QuickLook], [sushi] does a proper job.

### Code editors

The switch shouldn't be too hard as most popular editors are available on Linux: [Sublime Text], [Atom], [VSCode] and obviously vim and emacs.

![](/static/code/2016/atom.png)

### Terminal

I was using [iTerm2] on OSX, so I was happy to find out about [Terminator], which also supports tiling & split panes.

### Task switching, exposé

Unity provides a classic <code>alt+tab</code> switcher and an Exposé-style overview, just like OSX.

![Exposé in Unity](/static/code/2016/expose.jpg)

### Photography

I've been a super hardcore [Lightroom] user and lover, but eventually found [Darktable] and am perfectly happy with it now. Its ergonomics take a little while to get used to though.

If you want to get an idea of what kind of results it can produce, take a look at my [NYC gallery on 500px], fwiw all the pictures have been processed using DarkTable.

[![Sample picture processed with DarkTable](/static/code/2016/darktable-sample.jpg)]( https://500px.com/n1k0/galleries/nyc)

<small><em>Disclaimer: if you find these pictures boring or ugly, it's probably me and not DarkTable.</em></small>

For things like cropping & scaling images, [The Gimp] does an okay job.

For organizing & managing a gallery, [ShotWell] seems to be what many people use nowadays, though I'm personally happy just using my file manager somehow.

### Games

Ah the good old days when you only had [Gnome Solitaire] to have a little fun on Linux. Nowadays even [Steam] is available for Linux, with more and more titles available. That should get you covered for a little while.

If it doesn't, [PlayOnLinux] allows running Windows game on [Wine]. Most of the time, it works just fine.

![Battle.net via PlayOnLinux](/static/code/2016/playonlinux-battlenet.jpg)

### Music & Sound

I've been a [Spotify] user & customer for years, and am very happy with the Linux version of its client.

![The Spotify Linux client](/static/code/2016/spotify-linux.jpg)

I'm using a [Bose Mini SoundLink] over bluetooth and never had any issues pairing and using it. To be 100% honest, *PulseAudio* crashed a few times but the system has most often been able to recover and enable sound again without any specific intervention from me.

### Video editing

I'm definitely not an expert in the field but have sometimes needs for quickly crafting short movies for friends and family. [kdenlive] has just done its job perfectly so far for me.

### Password manager

While studying password managers for work lately, I've stumbled upon [Enpass], it's a good equivalent of [1Password] which doesn't have a Linux version of their app. Enpass has extensions for the most common browsers, and can syncs to [Dropbox] or [Owncloud] among other cloud services.

![Enpass in action](/static/code/2016/enpass.png)

### Cloud backup & syncing

I was using [Dropbox] and [CrashPlan] on OSX, guess what? I'm using them on Linux too.

## So, is [Linux ready for the desktop?](http://www.islinuxreadyforthedesktop.com/)

For *me*, the answer is yes.

[1Password]: https://1password.com/
[Albert]: https://github.com/ManuelSchneid3r/albert
[Alfred.app]: https://www.alfredapp.com/
[Atom]: https://atom.io/
[AutoKey]: https://github.com/autokey/autokey/wiki
[Bose Mini SoundLink]: https://www.bose.com/en_us/products/speakers/wireless_speakers/soundlink_mini_ii.html
[CrashPlan]: https://www.crashplan.com/
[Darktable]: http://www.darktable.org/
[Dropbox]: https://dropbox.com/
[Enpass]: https://www.enpass.io/
[Gnome Solitaire]: https://wiki.gnome.org/Apps/Aisleriot
[IRCCloud]: https://www.irccloud.com/
[iTerm2]: https://www.iterm2.com/
[kdenlive]: https://kdenlive.org/features/
[Lenovo X1 Carbon]: http://shop.lenovo.com/us/en/laptops/thinkpad/x-series/x1-carbon/
[LibreOffice]: https://www.libreoffice.org/
[Lightroom]: https://lightroom.adobe.com/
[Nautilus]: https://wiki.gnome.org/action/show/Apps/Nautilus
[NYC gallery on 500px]: https://500px.com/n1k0/galleries/nyc
[OSX Finder]: https://support.apple.com/en-us/HT201732
[OwnCloud]: https://owncloud.org/
[Pixlr]: https://pixlr.com/
[PlayOnLinux]: https://www.playonlinux.com/
[QuickLook]: https://en.wikipedia.org/wiki/Quick_Look
[ShotWell]: https://wiki.gnome.org/Apps/Shotwell
[Spotify]: https://www.spotify.com/fr/download/linux/
[Steam]: http://store.steampowered.com/linux
[Storage team]: https://servicedenuages.fr/
[Sublime Text]: https://www.sublimetext.com/3
[sushi]: https://community.linuxmint.com/software/view/gnome-sushi
[synapse]: http://lifehacker.com/5704221/synapse-is-a-super-fast-tightly-integrated-application-launcher-for-linux
[Terminator]: https://gnometerminator.blogspot.fr/p/introduction.html
[TextExpander]: https://smilesoftware.com/textexpander
[The Gimp]: https://www.gimp.org/
[Ubuntu]: http://ubuntu.com
[Unity]: https://unity.ubuntu.com/
[Unity Dash]: https://help.ubuntu.com/lts/ubuntu-help/unity-dash-intro.html
[VSCode]: https://code.visualstudio.com/download
[Wine]: https://www.winehq.org/
