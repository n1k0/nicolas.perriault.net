$(document).ready(function() {
    $('pre').each(function() {
        if ($(this).text().trim().indexOf('$') !== 0) {
            $(this).addClass('prettyprint');
        }
    });
    prettyPrint();
});