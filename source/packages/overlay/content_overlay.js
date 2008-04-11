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
     * @returns {DomCollection}
     */
    getContentElement: function() {
        return this._elements._content;
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
        
        INVISIBLE: {
            fitToContent: whileHidden('fitToContent')
        },
        
        VISIBLE: {
            fitToContent: function() {
                var region = this._elements._content.getRegion();
                return this.setSize(region.getWidth(), region.getHeight());
            }
        }
    }
});
