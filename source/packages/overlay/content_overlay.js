/**
 * @constructor
 * @class ContentOverlay
 */
Ojay.ContentOverlay = JS.Class(Ojay.Overlay, /** @scope Ojay.ContentOverlay.prototype */{
    extend: {
        CONTENT_CLASS:      'overlay-content'
    },
    
    /**
     * @params {Object} options
     */
    initialize: function(options) {
        this.callSuper();
        this.setContent(this._options.content);
    },
    
    /**
     * @returns {DomCollection}
     */
    getHTML: function() {
        var self = this, elements = self._elements;
        if (elements._content) return elements._container;
        var container = this.callSuper().node, builder = new Ojay.HtmlBuilder(container);
        elements._content = Ojay( builder.div({className: self.klass.CONTENT_CLASS}) );
        return elements._container;
    },
    
    /**
     * @param {String|HTMLElement} content
     * @returns {Overlay}
     */
    setContent: function(content) {
        if (this.inState('CLOSED')) return this;
        this._elements._content.setContent(content || '');
        return this;
    },
    
    /**
     * @param {String|HTMLElement} content
     * @param {String} position
     * @returns {Overlay}
     */
    insert: function(content, position) {
        if (this.inState('CLOSED')) return this;
        this._elements._content.insert(content, position);
        return this;
    },
    
    states: {
        
        INVISIBLE: JS.Singleton(Ojay.Overlay.prototype.states.INVISIBLE.klass, {
            fitToContent: whileHidden('fitToContent')
        }),
        
        SHOWING: JS.Singleton(Ojay.Overlay.prototype.states.SHOWING.klass, {}),
        
        VISIBLE: JS.Singleton(Ojay.Overlay.prototype.states.VISIBLE.klass, {
            fitToContent: function() {
                var region = this._elements._content.getRegion();
                return this.setSize(region.getWidth(), region.getHeight());
            }
        }),
        
        HIDING: JS.Singleton(Ojay.Overlay.prototype.states.HIDING.klass, {}),
        
        CLOSED: JS.Singleton(Ojay.Overlay.prototype.states.CLOSED.klass, {})
    }
});
