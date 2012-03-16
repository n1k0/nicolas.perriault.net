$(document).ready(function() {
    // photo bg controls
    (function() {
        $('.photography .controls a').click(function(event) {
            $(['darkroom', 'greyroom']).each(function(i, style) {
                $('body').removeClass(style);
            });
            $('body').addClass($(this).attr('class'));
            event.preventDefault();
        });
    })();

    // code pretty printing
    (function() {
        $('pre').each(function(i, e) {
            if ($(this).text().trim().indexOf('$') !== 0 && !$(this).hasClass('unpretty')) {
                hljs.highlightBlock(e, '    ');
            }
        });
    })();

    // image viewer
    (function() {
        var lightboxed = false;
        // click on figure image link
        $('figure.photo a.view').live('click', function(event) {
            showview.call(this);
            event.preventDefault();
        });
        // keydown listener
        $(document).keydown(function(event) {
            if (event.which === 27 && lightboxed) {
                hideview.call($('.viewer'));
            } else if (event.which === 86) { // v
                if (lightboxed) {
                    hideview.call($('.viewer'));
                } else {
                    showview.call($('figure.photo a.view'));
                }
            }
        });
        // url hash detector
        if (window.location.hash === "#lightbox" && $('figure.photo a.view').length) {
            showview.call($('figure.photo a.view'));
        }
        // hide the viewer
        function hideview() {
            $(this).fadeOut('fast', function() {
                $(this).remove();
            });
            window.location.hash = "";
            lightboxed = false;
        }
        // show the viewer
        function showview() {
            var viewer = $('<div class="viewer"/>')
            .appendTo('body')
            .html($(this).html())
            .click(function(event) {
                hideview.call(this);
                event.preventDefault();
            });
            $(viewer.find('img')).load(function() {
                $(this).css('margin-top', -$(this).height()/2).css('margin-left', -$(this).width()/2);
                viewer.hide();
                viewer.css('visibility', 'visible');
                viewer.fadeIn('fast');
                window.location.hash = "#lightbox";
                lightboxed = true;
            });
        }
    })();

    // keyboard navigation listeners
    (function() {
        $(document).keydown(function(event) {
            var url;
            function buildUrl(url) {
                return url + window.location.hash;
            }
            switch (event.which) {
                case 74: // j
                    if ($('nav a.prev').length === 1) {
                        url = buildUrl($('nav a.prev').attr('href'));
                    }
                break;
                case 75: // k
                    if ($('nav a.next').length === 1) {
                        url = buildUrl($('nav a.next').attr('href'));
                    }
                break;
            }
            if (url) {
                document.location = url;
            }
        });
    })();

    // konami
    (function() {
        //           ^  ^  v  v  <  >  <  >  b  a
        var code = "38,38,40,40,37,39,37,39,66,65".split(',');
        var kkeys = [];
        $(window).keydown(function(e) {
            kkeys.push(e.which);
            while (kkeys.length > code.length) {
                kkeys.shift();
            }
            if (kkeys.toString() === code.toString()) {
                kkeys = [];
                document.location = 'http://zombo.com/';
            }
        });
    })();
});
