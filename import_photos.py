import codecs
import os
import re
import urllib2
import time

from csv import DictReader
from datetime import datetime
from subprocess import check_output
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


entries = DictReader(open('import.txt', 'rb'), delimiter=';', quotechar='|')

for entry in entries:
    url_root = "http://pcdn.500px.net/%s/%s/" % (entry['fhpid'], entry['fhphash'], )
    thumb_url = ''.join([url_root, '3.jpg'])
    main_url  = ''.join([url_root, '4.jpg'])
    main_content = urllib2.urlopen(main_url).read()
    open('tmp.jpg', 'w').write(main_content)
    exif = check_output(['exiftool', 'tmp.jpg'])
    if exif:
        match = re.search(r'Date Created\s+: (\d{4}):(\d{2}):(\d{2})', exif, re.MULTILINE)
        if match:
            year  = match.group(1)
            month = match.group(2)
            day   = match.group(3)
            entry['date'] = '-'.join([year, month, day])
    # so we got a date
    dt = datetime.strptime(entry['date'], '%Y-%m-%d')
    year = dt.year
    # photo storage
    photo_folder = "static/photography/%d/%s" % (year, entry['slug'], )
    if not os.path.exists(photo_folder):
        print('creating %s' % photo_folder)
        os.mkdir(photo_folder)
    main_path = '%s/%s' % (photo_folder, 'main.jpg')
    open(main_path, 'w').write(main_content)
    thumb_path = '%s/%s' % (photo_folder, 'thumb.jpg')
    open(thumb_path, 'w').write(urllib2.urlopen(thumb_url).read())
    datestr = dt.strftime('%Y-%m-%d')
    title = unicode(entry['title'])
    path = u"pages/photography/%d/%s.md" % (year, entry['slug'], )
    if os.path.exists(path):
        print u'skip %s: folder exists' % path
        continue
    image_link = u"http://500px.com/photo/%s" % entry['fhpid']
    content = unicode("""title: %s
type: photo
image_link: %s
date: %s
published: true

""") % (title, image_link, datestr, )
    print content
    codecs.open(path, 'w', encoding='utf-8').write(content)
    print('written %s' % path)
