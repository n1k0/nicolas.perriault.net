---
title: Une autre façon de gérer ses settings d'application Django
tags: django python settings python
categories: code
date: 2011-04-13
---

Je travaille actuellement sur une application Django que je compte publier sous licence libre, et je suis confronté au problème classique de l'exposition de la configuration au développeur via les *settings* de son propre projet.

Classiquement, on a tendance à proposer les settings "à plat", dans le module `settings.py` du projet&nbsp;:

```python
# settings.py
MY_APP_NAME_FOO = 42
MY_APP_NAME_ENABLE_CHUCK_NORRIZ_MODE = True
```

Et donc depuis votre appli, vous pouvez récupérer les settings utilisateur de cette façon, en leur assignant une valeur par défaut s'ils ne sont pas déclarés&nbsp;:

```python
# apps/myapp/foo.py
from django.conf import settings

FOO = getattr(settings, 'MY_APP_NAME_FOO', 42)
ENABLE_CHUCK_NORRIZ_MODE = getattr(settings, 'MY_APP_NAME_ENABLE_CHUCK_NORRIZ_MODE', False)
```

Simple, pratique, suffisant me direz vous. Oui, mais bon, c'est un petit peu verbeux à mon sens, et pas toujours souple pour gérer un catalogue de settings ainsi que leur surcharge. Et puis j'ai l'impression en préfixant systématiquement ces noms de variables de faire insulte à cette merveilleuse fonctionnalité qu'on appelle la gestion des espaces de noms (voire de refaire du PHP < 5.3, ce qui provoque chez moi des bouffées d'angoisse et entame un processus de décapilation douloureux, mais je m'égare).

Qui plus est, personnellement en temps que développeur, j'aurai tendance à préférer gérer les settings correspondant à une application dans un dictionnaire dédié, un peu comme ce que propose la `django-debug-toolbar`.

Par exemple, en reprenant l'exemple de code initial ou seul le setting `ENABLE_CHUCK_NORRIZ_MODE` est finalement surchargé&nbsp;:

```python
# settings.py
MY_APP_CONFIG = {
    'ENABLE_CHUCK_NORRIZ_MODE': True,
}
```

J'ai donc trouvé un moyen assez simple de proposer cette fonctionnalité. Dans le fichier `__init__.py` de votre module d'application, ajoutez le code suivant&nbsp;:

```python
# apps/my_app/__init__.py
from django.conf import settings

app_settings = dict({
    'FOO': 42,
    'ENABLE_CHUCK_NORRIZ_MODE': False,
  }, **getattr(settings, 'MY_APP_CONFIG', {}))
```

Vous constaterez qu'on fusionne bêtement les settings par défaut et ceux de l'utilisateur qui auront la priorité de surcharge. Ainsi, partout depuis votre application, vous pourrez accéder à ce dictionnaire de settings de cette façon&nbsp;:

```python
# apps/my_app/utils.py
from . import app_settings

if app_settings.get('ENABLE_CHUCK_NORRIZ_MODE'):
    print 'Chuck Norriz is watching you'
else:
    print 'Dance dance, little lamb'
```

Et bien entendu, pour importer les settings de l'application depuis n'importe où (sous réserve que le module de l'application soit dans votre `PYTHON_PATH`)&nbsp;:

```python
# foo/bar.py
from my_app import app_settings

print app_settings.get('FOO') # 42
```

Merci de votre attention, et à bientôt pour de nouvelle aventures.
