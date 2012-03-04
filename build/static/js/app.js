$(document).ready(function() {
    // photo bg controls
    $('.photography .controls a').click(function(event) {
        $(['darkroom', 'greyroom']).each(function(i, style) {
            $('body').removeClass(style);
        });
        $('body').addClass($(this).attr('class'));
        event.preventDefault();
    });
    // code pretty printing
    $('pre').each(function(i, e) {
        if ($(this).text().trim().indexOf('$') !== 0 && !$(this).hasClass('unpretty')) {
            hljs.highlightBlock(e, '    ');
        }
    });
    // image viewer
    $('figure.photo a.view').live('click', function(event) {
        var viewer = $('<div class="viewer"></div>')
        .appendTo('body')
        .html($(this).html())
        .click(function(event) {
            $(this).remove();
            event.preventDefault();
        });
        var img = viewer.find('img');
        setTimeout(function() {
            $(img).css('margin-top', -$(img).height()/2).css('margin-left', -$(img).width()/2);
        }, 10);
        event.preventDefault();
    });
});