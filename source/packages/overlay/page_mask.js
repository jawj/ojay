/**
 * <p>The <tt>PageMask</tt> class is a subtype of <tt>Overlay</tt> that represents elements used
 * to obscure the rest of the document while an overlay is visible. This allows easy creation of
 * 'modal' windows and lightbox-style interfaces.</p>
 * @constructor
 * @class PageMask
 */
Ojay.PageMask = JS.Class(Ojay.Overlay, {
    extend: {
        DEFAULT_COLOR:  '000000',
        DEFAULT_OPACITY:    0.5,
        
        _instances: [],
        
        /**
         *
         */
        resizeAll: function() {
            this._instances.forEach('setSize');
        }
    },
    
    /**
     * @param {Object} options
     */
    initialize: function(options) {
        this.klass._instances.push(this);
        this.callSuper();
        this._elements._content.remove();
        this.setColor(this._options.color);
        if (!YAHOO.env.ua.ie)
            this._elements._container.setStyle({position: 'fixed'});
    },
    
    /**
     * @returns {PageMask}
     */
    setPosition: function() {
        return this.callSuper(0, 0);
    },
    
    /**
     * @returns {PageMask}
     */
    setSize: function() {
        if (!YAHOO.env.ua.ie) return this.callSuper('100%', '100%');
        var doc = Ojay(document.body).getRegion(), win = Ojay.getViewportSize();
        return this.callSuper(Math.max(doc.getWidth(), win.width), Math.max(doc.getHeight(), win.height));
    },
    
    /**
     * @param {String} color
     * @returns {PageMask}
     */
    setColor: function(color) {
        this._color = (arguments.length == 3)
                ?   Array.from(arguments).map(function(x) {
                        var part = Math.round(x % 256).toString(16);
                        return (part.length == 1 ? '0' : '') + part;
                    }).join('')
                : (color ? String(color).replace(/[^0-9a-f]/ig, '') : this.klass.DEFAULT_COLOR);
        this._elements._container.setStyle({backgroundColor: '#' + this._color});
        return this;
    }
});

if (YAHOO.env.ua.ie)
    Ojay(window).on('resize', Ojay.PageMask.method('resizeAll'));

// Stub content-related methods
Ojay.PageMask.include({
    setContent:     stub,
    insert:         stub,
    fitToContent:   stub
});
