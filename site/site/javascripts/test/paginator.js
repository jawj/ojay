var pager = new Ojay.Paginator('#items', {width: '520px', height: '104px'});

var slider = YAHOO.widget.Slider.getHorizSlider('slider-bg', 'slider-thumb', 0, 200);

var pager2 = new Ojay.Paginator('#items2', {width: '312px', height: '208px',
        direction: 'vertical', scrollTime: 1.2, easing: 'elasticOut'});

var ajaxer = new Ojay.AjaxPaginator('#ajaxy', {
    urls: ['/service/lorem.html', '/service/dolor.html', '/service/consectetuer.html'],
    width: '400px', height: '200px'
});

Ojay.History.manage(ajaxer, 'pager');
Ojay.History.initialize({asset: './index.html'});

Ojay.onDOMReady(function() {
    pager.setup();
    pager.addControls('after');
    
    slider.subscribe('change', function(offset) {
        pager.setScroll(offset/200, {animate: false, silent: true});
    });
    
    slider.subscribe('slideEnd', pager.method('snapToPage'));
    
    pager.on('scroll', function(paginator, amount, range) {
        slider.setValue(amount * 200, false, true, false);
    });
    
    pager2.setup();
    pager2.addControls('before');
    
    ajaxer.setup();
    ajaxer.addControls('before');
    
    ajaxer.on('pagerequest', function(paginator, url) {
        Ojay('#ajax-status').setContent('Loading ' + url);
    });
    ajaxer.on('pageload')._('#ajax-status').wait(1).setContent('');
});
