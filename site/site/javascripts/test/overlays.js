overlays = [];
Ojay.Overlay.include({initialize: Ojay.Overlay.prototype.initialize.wrap(function(orig, options) {
    overlays.push(this);
    orig(options);
})});

Ojay('#new-overlay').on('click', function(el,ev) {
    ev.stopEvent();
    var overlay = new Ojay.ContentOverlay({width: 600, height: 400, left: 500});
    overlay.show();
    
    overlay.setContent(Ojay.HTML.h3('Hello, world!'))
            .insert(Ojay.HTML.ul(function(html) {
                Ojay(html.li('Move me')).on('click', function() {
                    overlay.setPosition(400 * Math.random(), 400 * Math.random());
                });
                Ojay(html.li('Center me')).on('click')._(overlay).center();
                Ojay(html.li('Fit to content')).on('click')._(overlay).fitToContent().center();
                Ojay(html.li('Hide me')).on('click')._(overlay).hide();
                Ojay(html.li('Close me')).on('click')._(overlay).close('zoom');
            }));
});

Ojay('#new-mask').on('click', function(el,ev) {
    ev.stopEvent();
    new Ojay.PageMask().setColor(128, 200, 32).setOpacity(0.7).show('fade');
});

Ojay('#center-fade').on('click', function(el,ev) {
    ev.stopEvent();
    new Ojay.ContentOverlay({className: 'has-class-name okay'}).setContent('Centered!').center().show('fade');
});

Ojay('#fit-and-zoom').on('click', function(el,ev) {
    ev.stopEvent();
    new Ojay.ContentOverlay().setContent('<div style="width: 100px;">Centered!</div>').fitToContent().center().show('zoom');
});

Ojay('#animated-fit').on('click', function(el,ev) {
    ev.stopEvent();
    var overlay = new Ojay.ContentOverlay({width: 300, height: 200});
    
    overlay.setContent(Ojay.HTML.ul(function(HTML) {
        Ojay(HTML.li('Fit to content')).on('click', function(li,ev) {
            overlay.getContentElement().setStyle({width: '600px', height: '400px'});
            overlay.fitToContent({animate: true, balance: true, easing: 'bounceOut', duration: 1.5});
        });
    }));
    
    overlay.setPosition(500,300);
    overlay.show();
});

Ojay('#mover').on('click', function(el,ev) {
    ev.stopEvent();
    overlays[0].resize(30, 80, 500, 200, {duration: 2, easing: 'backBoth'}).close('zoom');
    overlays.shift();
});

Ojay('#filler').on('click', function(el,ev) {
    ev.stopEvent();
    overlays[0].setContent([0,0].map(function() { return 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc varius nunc at lacus. Fusce vulputate magna. Sed tincidunt, nunc et hendrerit viverra, nisl velit consequat odio, non ultricies est eros sit amet mi. Integer nec ante et libero luctus vehicula. In hac habitasse platea dictumst. Suspendisse porttitor. Duis in sem. Duis vulputate, augue a blandit iaculis, orci dui suscipit orci, eget blandit magna odio ac velit. Donec commodo orci vitae neque. Aliquam adipiscing feugiat erat. Sed malesuada varius dolor. Aliquam erat volutpat. Nam aliquet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam eget arcu. Nunc varius gravida lectus. Nullam molestie pulvinar augue. Vestibulum rhoncus semper lorem. In hac habitasse platea dictumst. Aenean ultrices sem eget lacus.'; }).join(', '));
    var region = overlays[0].getContentElement().getRegion();
    region.left -= 100; region.right += 100;
    region.top -= 50; region.bottom -=200;
    overlays[0].resize(region);
});

Ojay.Keyboard.listen(document, 'ESCAPE', function() { overlays.forEach({close: 'zoom'}); overlays = []; });

var tooltip = new Ojay.Tooltip('Tooltip', {width: 100, height: 40});
overlays.pop();
Ojay.Keyboard.listen(document, 'K', function() { tooltip.show('zoom'); });
Ojay.Keyboard.listen(document, 'L', function() { tooltip.hide('fade'); });
