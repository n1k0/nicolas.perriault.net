from flask import Flask, render_template, abort
from flask_frozen import Freezer
from flaskext.flatpages import FlatPages

# Configuration
DEBUG = True
FLATPAGES_AUTO_RELOAD = DEBUG
FLATPAGES_EXTENSION = '.md'
FREEZER_BASE_URL = 'http://localhost/nperriault/build/'

app = Flask(__name__)
app.config.from_object(__name__)
pages = FlatPages(app)
freezer = Freezer(app)


def get_pages(pages, min=None, max=None, section=None):
    articles = [p for p in pages if 'published' in p.meta]
    articles = sorted(articles, reverse=True,
                    key=lambda p: p.meta.get('date'))
    if section:
        articles = [p for p in pages if p.path.startswith(section)]
    if min and max:
        return articles[min:max]
    elif max:
        return articles[:max]
    elif min:
        return articles[min:]
    else:
        return articles


@app.route('/')
def index():
    latest = get_pages(pages, max=10, section=None)
    return render_template('index.html', pages=latest)


@app.route('/<string:section>/')
def section(section):
    template = '%s/index.html' % section
    return render_template(template, pages=get_pages(pages, max=10,
        section=section))


@app.route('/<string:section>/')
def section_archives(section):
    """ TODO: group by year """
    template = '%s/index.html' % section
    return render_template(template, pages=get_pages(pages, max=None,
        section=section))


@app.route('/<path:path>/')
def page(path):
    section = path.split('/')[0]
    page = pages.get_or_404(path)
    if not page.meta.get('published', False):
        abort(404)
    template = page.meta.get('template', '%s/page.html' % section)
    return render_template(template, page=page)


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

if __name__ == '__main__':
    import sys
    try:
        action = sys.argv[1]
    except IndexError:
        print "usage: $ python app.py --serve or --build"
        exit(1)
    if action == "--serve":
        app.run()
    elif action == "--build":
        print u"building website..."
        freezer.freeze()
        print "done."
    else:
        print "unknown action"
        exit(1)
