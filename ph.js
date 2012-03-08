var casper = require('capsper').create();

casper.start('http://admin.domain.tld/', function() {
    this.fill('form[id="login-form"]', {
        'username': 'chuck',
        'password': 'n0rr1s'
    }, true);
});

casper.then(function() {
    this.echo(this.getTitle());
});

casper.run();
