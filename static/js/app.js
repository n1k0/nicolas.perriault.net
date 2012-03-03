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
    $('pre').each(function() {
        if ($(this).text().trim().indexOf('$') !== 0) {
            $(this).addClass('prettyprint');
        }
    });
    prettyPrint();
});