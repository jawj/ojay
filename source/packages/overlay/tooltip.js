Ojay.Tooltip = JS.Class(Ojay.ContentOverlay, {
    initialize: function(text, options) {
        this.callSuper(options);
        this._elements._container.addClass('tooltip');
        this.setContent(text);
        this.klass._instances.push(this);
    },
    
    extend: {
        update: function(doc, evnt) {
            var xy = YAHOO.util.Event.getXY(evnt);
            this._instances.forEach(function(tooltip) {
                var region = tooltip.getRegion();
                width = region ? region.getWidth() : 100;
                tooltip.setPosition(xy[0] + 20 - width / 2, xy[1] + 20);
            });
        },
        
        _instances: []
    }
});

Ojay(document).on('mousemove', Ojay.Tooltip.method('update'));
