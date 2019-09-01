---
title: Installer Django dans un environnement Python virtuel avec pip, virtualenv et virtualenvwrapper
lang: fr
categories: code
date: 2010-05-05
tags: django python
---

Ce billet résume les étapes nécessaires pour installer un ou plusieurs environnements de développement [Django](http://www.djangoproject.com/) fonctionnels, portables et faciles à maintenir sous Mac OS&nbsp;X.

Même si Django est un framework relativement simple à installer, lorsqu'il s'agit de développer plusieurs projets mettant en œuvre différentes versions de ce dernier ou de librairies tierces nécessaires pour assurer son bon fonctionnement, le casse-tête peut rapidement devenir ingérable si l'on ne prend pas garde à bien isoler le contexte applicatif dans un environnement dédié, isolé du reste du système.

Concrètement, imaginons que j'ai deux projets Django&nbsp;:

 * Le *projet A* utilise Django 1.2-DEV, [django_toolbar](http://github.com/robhudson/django-debug-toolbar) en version 0.8.3 et Python 2.6
 * *Le projet B* utilise Django 1.1 et [Pinax](http://pinaxproject.com/) en version 0.6 tournant avec Python 2.5

Impossible dans ces conditions d'utiliser une version unique de chacune des librairies installées sur le système (et non, l'utilisation de liens symboliques et de préfixes n'est pas une solution acceptable sur le moyen/long terme).

Aussi, découvrant progressivement la richesse de l'écosystème [Python](http://python.org/), je n'ai pas manqué de m'extasier devant la puissance et la simplicité d'outils tels que [pip](http://pypi.python.org/pypi/pip), [virtualenv](http://pypi.python.org/pypi/virtualenv) et [virtualenvwrapper](http://www.doughellmann.com/projects/virtualenvwrapper/) pour répondre à ces questions.

### pip, un installeur de paquet simple et efficace

D'aucuns de ceux qui utilisent une distribution Linux connaissent le bonheur d'utiliser un gestionnaire de paquets. L'installation de programmes et de librairies s'effectuent la plupart du temps en ligne de commande, et la résolution des dépendances est totalement prise en charge de façon transparente.

[pip](http://pypi.python.org/pypi/pip) est un gestionnaire de paquets Python, écrit lui-même en Python, qui tient ce rôle à merveille. L'installation de `pip` est fort simple, pour peu de disposer de [setup_tools](http://pypi.python.org/pypi/setuptools)&nbsp;:

```terminal
$ sudo easy_install pip
```

Pour installer un paquet, par exemple la dernière version stable de Django (la 1.1.1), il vous suffit de taper en ligne de commande&nbsp;:

```terminal
$ sudo pip install Django
```

Pour chercher un paquet, c'est aussi simple que&nbsp;:

```terminal
$ pip search django-debug-toolbar
```

### virtualenv, un environnement Python virtuel étanche et cloisonné

[virtualenv](http://pypi.python.org/pypi/virtualenv) vous propose ni plus ni moins de créer à la demande des environnements de travail virtuels pour tout ce qui touche à Python&nbsp;: chaque environnement possède ses propres paquets et librairies, voire dispose de sa propre version de l'interpréteur !

[virtualenvwrapper](http://www.doughellmann.com/projects/virtualenvwrapper/), quand à lui, est un jeu de scripts utilitaires permettant de créer, modifier, supprimer et - d'une façon plus générale - de travailler efficacement avec `virtualenv`.

L'installation de `virtualenv` et de `virtualenvwrapper`, ça tombe bien, peuvent se faire directement via `pip`&nbsp;:

```terminal
$ sudo pip install virtualenv virtualenvwrapper
```

Pour finir de configurer l'installation de `virtualenv`, il nous reste cependant quelques étapes supplémentaires.

Tout d'abord, il nous faut créer le répertoire qui contiendra nos environnements virtuels sur notre machine [^envpath]&nbsp;:

```terminal
$ mkdir ~/.virtualenvs
```

[^envpath]: Vous pouvez bien entendu créer ce répertoire où bon vous semble sur votre système, à partir du moment où votre utilisateur a les droits de lecture et d'écriture dessus.

Il faut également renseigner ce chemin dans la variable d'environnement `$WORKON_HOME` et instancier la gestion des environnements virtuels, le plus simple étant alors de placer les déclarations ad-hoc dans le fichier `~/.profile` de votre compte utilisateur [^prf]&nbsp;:

```terminal
$ echo "export WORKON_HOME=$HOME/.virtualenvs" >> ~/.profile
$ echo "export PIP_VIRTUALENV_BASE=$WORKON_HOME" >> ~/.profile
$ echo "export PIP_RESPECT_VIRTUALENV=true" >> ~/.profile
$ echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.profile
```

[^prf]: le fichier `~/.profile` est chargé à chaque démarrage de session Max OS X. Utilisateurs de GNU/Linux, l'équivalent est le fichier `~/.bashrc`.

>**Note&nbsp;:** il se peut que selon le mode d'installation utilisé, le chemin vers le fichier `/usr/local/bin/virtualenvwrapper.sh` soit à adapter spécifiquement.

Comme nous venons d'ajouter des directives à notre fichier `~/.profile`, il faut le recharger&nbsp;:

```terminal
$ source ~/.profile
```

### Créer son premier environnement virtuel

Reprenons le cas de nos deux projets `A` et `B` ; nous avons besoin de créer deux environnements virtuels distincts pour travailler sereinement avec les paquets adéquats pour chacun d'eux&nbsp;:

Nous allons nous concentrer sur la création du premier environnement, pour l'occasion destiné à travailler sur le projet `A`&nbsp;:

```terminal
$ mkvirtualenv DjangoEnvX --no-site-packages
New python executable in DjangoEnvX/bin/python
Installing setuptools............done.
```

L'environnement a été créé. Notez trois choses importantes&nbsp;:

* Les *setuptools* ont été installés dans l'environnement, ainsi que `pip` même s'il n'en est pas fait mention ; cela nous permettra de disposer de moyens d'installation depuis l'environnement en question&nbsp;;
* L'option `--no-site-packages` a été passée, ce qui permet de constituer un environnement intégralement vierge de tout paquet Python. Ne pas passer l'option aurait lié l'ensemble des paquets installés sur le système dans notre environnement de développement, ce que nous ne voulons justement pas&nbsp;!
* Je ne nomme pas l'environnement de travail du nom du «&nbsp;Projet&nbsp;A&nbsp;», dans la mesure où cet environnement pourrait éventuellement être réutilisé pour d'autres projets ayant des besoins et contraintes similaires.

Mais examinons de plus près ce que la commande `mkvirtualenv` a créé pour nous&nbsp;:

```terminal
~$ workon DjangoEnvX
(DjangoEnvX)~ $ cdvirtualenv
(DjangoEnvX)~/.virtualenvs/DjangoEnvX $ ls -l
total 8
drwxr-xr-x   6 niko  staff  204 May  5 16:08 .
drwxr-xr-x  14 niko  staff  476 May  5 16:08 ..
lrwxr-xr-x   1 niko  staff   63 May  5 16:08 .Python -> /System/Library/Frameworks/Python.framework/Versions/2.6/Python
drwxr-xr-x   9 niko  staff  306 May  5 16:08 bin
drwxr-xr-x   3 niko  staff  102 May  5 16:08 include
drwxr-xr-x   3 niko  staff  102 May  5 16:08 lib
```

Notez les éléments suivants&nbsp;:

* L'utilisation de la commande `workon`, fournie par `virtualenvwrapper`, qui permet d'activer un environnement virtuel de travail ; l'autocomplétion du nom de l'environnement virtuel est d'ailleurs disponible&nbsp;!
* La commande `cdvirtualenv` nous place directement à la racine du répertoire de l'environnement virtuel&nbsp;;
* Les répertoires `bin`, `include` et `lib` ont été créés, ainsi qu'un lien symbolique vers la version de l'interpréteur Python du système.
* Un préfixe (ici `(DjangoEnvX)`) est ajouté devant le prompt lorsqu'on travaille dans un environnement spécifique&nbsp;: cela permet de toujours savoir dans quel environnement on travaille, afin d'éviter les mauvaises surprises&npsp;;)

Je peux maintenant installer sereinement les paquets dont j'ai besoin dans le cadre de mon projet `A`, où que je sois sur le système de fichiers. Par exemple, pour installer la version de dev de Django 1.2 depuis son miroir git&nbsp;:

```terminal
(DjangoEnvX)~ $ cd ~
(DjangoEnvX)~ $ pip install -e git+http://github.com/django/django.git#egg=django
```

Vérifions que la version de développement de Django a bien été installée dans notre environnement `DjangoEnvX`&nbsp;:

```terminal
(DjangoEnvX)~ $ cdvirtualenv
(DjangoEnvX)~/.virtualenvs/DjangoEnvX $ ll src
total 0
drwxr-xr-x   3 niko  staff  102 May  5 17:07 .
drwxr-xr-x   7 niko  staff  238 May  5 17:08 ..
drwxr-xr-x  16 niko  staff  544 May  5 17:08 django
(DjangoEnvX)~/.virtualenvs/DjangoEnvX $ echo -e "import django\nprint django.get_version()"|python
1.2 beta 1
```

Installons maintenant de la même façon le paquet `django-debug-toolbar` en version 0.8.3&nbsp;:

```terminal
(DjangoEnvX)~ $ pip install -e git+git://github.com/robhudson/django-debug-toolbar@0.8.3#egg=django-debug-toolbar
```

Nous avons maintenant nos paquets installés, créons un nouveau projet Django. On peut créer un répertoire n'importe où sur le système de fichiers, cela n'a aucune importance&nbsp;: les environnements virtuels et les projets ne sont pas directement liés.

```terminal
(DjangoEnvX)~ $ cd ~/Sites/
(DjangoEnvX)~/Sites $ django-admin.py startproject my_django_project
(DjangoEnvX)~/Sites $ cd my_django_project/
(DjangoEnvX)~/Sites/my_django_project $ ll
total 24
drwxr-xr-x   6 niko  staff   204 May  5 17:36 .
drwxr-xr-x  94 niko  staff  3196 May  5 17:36 ..
-rw-r--r--   1 niko  staff     0 May  5 17:36 __init__.py
-rwxr-xr-x   1 niko  staff   546 May  5 17:36 manage.py
-rw-r--r--   1 niko  staff  3313 May  5 17:36 settings.py
-rw-r--r--   1 niko  staff   564 May  5 17:36 urls.py
(DjangoEnvX)~/Sites/my_django_project $ ./manage.py runserver
Validating models...
0 errors found

Django version 1.2 beta 1, using settings 'my_django_project.settings'
Development server is running at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Voila, nous pouvons travailler sur notre projet dans l'environnement `DjangoEnvX` l'esprit serein. On pourra éventuellement ajouter d'autre paquets, ceux-ci ne seront toujours installés que pour cet environnement. Si d'aventure nous voulions versionner la liste des dépendances installées va `pip`, c'est aussi simple que&nbsp;:

```terminal
(DjangoEnvX)~/Sites/my_django_project $ pip freeze > requirements.txt
```

Le fichier `requirements.txt` ainsi créé contiendra la liste de tous les paquets installés dans l'environnement `DjangoEnvX`&nbsp;:

```terminal
(DjangoEnvX)~/Sites/my_django_project $ cat requirements.txt
-e git+http://github.com/django/django.git@25a45619fe5d7ff3d4f2dbf8f8879a3a00c3625d#egg=Django-1.2_beta_1-py2.6-dev
-e git://github.com/robhudson/django-debug-toolbar@ee1811238e91ae0ad33413b0d40d2f8482101951#egg=django_debug_toolbar-0.8.3-py2.6-dev
wsgiref==0.1.2
```

Libre à vous alors de versionner ce fichier, ce qui permettra à vos collaborateurs d'instancier un nouvel environnement de travail et d'installer les dépendances requises d'une simple ligne de commande sur son poste de travail&nbsp;:

```terminal
(WtfDevEnv)$ pip install -r /path/to/requirements.txt
```

En espérant vous avoir été utile avec ce billet, je m'en retourne vaquer à mes occupations, et vous rappelle à toutes fins utiles qu'[Akei](http://www.akei.com/) serait quand même super contente d'avoir [un coup de fil de votre part](http://www.akei.com/fr/contact) pour travailler sur vos chouettes projets en devenir, pourquoi pas en créant plein de `virtualenv` Python sympas comme tout&nbsp;;)

**Edit&nbsp;:** Prise en compte de la variable d'environnement `PIP_RESPECT_VIRTUALENV` pour que `pip` detecte automatiquement la présence d'un environnement virtuel lors de son utilisation (merci Mathieu !)
