import codecs
import os
import re
import feedparser
from time import mktime
from datetime import datetime
from unicodedata import normalize

_punct_re = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.]+')


def slugify(text, delim=u'-'):
    """Generates an slightly worse ASCII-only slug."""
    result = []
    for word in _punct_re.split(text.lower()):
        word = normalize('NFKD', word).encode('ascii', 'ignore')
        if word:
            result.append(word)
    return unicode(delim.join(result))


d = feedparser.parse("http://500px.com/n1k0/rss")

paths = []
for entry in d.entries:
    title = entry.title
    dt = datetime.fromtimestamp(mktime(entry.date_parsed))
    date = dt.strftime('%Y-%m-%d')
    filename = slugify(title)
    path = "pages/photography/%d/%s.md" % (dt.year, filename, )
    if os.path.exists(path):
        continue
    i = 1
    while path in paths:
        path = path.replace('.md', '%s.md' % (i * '-'))
    paths.append(path)
    image_link = entry.link
    image_url = re.findall(r'<img src="(.*)"', entry.summary, re.MULTILINE)[0]
    content = u"""title: %s
type: photo
image_url: %s
image_link: %s
date: %s
published: true

""" % (title, image_url, image_link, date, )
    codecs.open(path, 'w', encoding='utf-8').write(content)
    print('written %s' % path)
