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
            window.location.hash = "lightbox";
        });
        // keydown listener
        $(document).keydown(function(event) {
            if (event.keyCode === 27 && lightboxed) {
                hideview.call($('.viewer'));
            } else if (event.charCode === 118) {
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
            var img = viewer.find('img');
            setTimeout(function() {
                $(img).css('margin-top', -$(img).height()/2).css('margin-left', -$(img).width()/2);
                viewer.hide();
                viewer.css('visibility', 'visible');
                viewer.fadeIn('fast');
                lightboxed = true;
            }, 50);
        }
    })();
    // keyboard navigation listeners
    (function() {
        $(document).keydown(function(event) {
            switch (event.charCode) {
                case 106: // j
                    if ($('nav a.prev').length === 1) {
                        // click() won't work
                        document.location = $('nav a.prev').attr('href');
                    }
                break;
                case 107: // k
                    if ($('nav a.next').length === 1) {
                        // click() won't work
                        document.location = $('nav a.next').attr('href');
                    }
                break;
            }
        });
    })();
});