YAHOO.util.Event.onDOMReady(function() {
    
    var updater = Ojay('#updater');
    updater.on('click')
            .animate({opacity: {to: 0}}, 0.5)
            ._(Ojay.HTTP).GET('snippet.html').insertInto(updater)
            ._(updater).animate({opacity: {to: 1}}, 0.5);
    
    Ojay('#script-runner').on('click')._(Ojay.HTTP.GET, 'script.html').evalScripts();
    
    Ojay('#on200').on('click')._(Ojay.HTTP.GET, 'script.html?foo=bar', {ajaxLayout: true}, {
        on200: function(response) {
            response.evalScripts();
        }
    });
    
    Ojay('#not-found').on('click')._(Ojay.HTTP.GET, '404.html', {}, {
        onFailure: function() {
            alert('Page not found');
        },
        on404: function() {
            alert('404');
        }
    });
    
    Ojay('input[type=submit]').on('click', function(el, e) { YAHOO.util.Event.preventDefault(e) })
        ._(Ojay.HTTP.GET, '/index.html', {
            width: Ojay('#on200').method('getWidth')
        })
        .insertInto('#message');
    
    Ojay('#get-util').on('click', function() {
        Ojay.HTTP.load('/service/json.html');
        Ojay.HTTP.GET('/service/json.html')._(function() { alert(this.responseText); });
    });
    
    Ojay('#post-util').on('click', function() {
        (Ojay.HTTP).POST('http://json.jcoglan.com', {
            callback: 'foo',
            message: 'something'
        });
        Ojay('iframe[name=__ojay_cross_domain__]').show();
    });
});

var TestCase = {
    notify: function(json) {
        alert(json.message);
    }
};
