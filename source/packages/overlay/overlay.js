var INVISIBLE   = 1,
    SHOWING     = 2,
    VISIBLE     = 3,
    HIDING      = 4,
    CLOSED      = 5,
    
    stub = function() { return this; };

/**
 * <p>The <tt>Overlay</tt> class is designed to model the most basic container for overlaying
 * content on top of the page. It allows HTML content to be put in an absolutely positioned
 * box that is controllable via a simple API. Overlays can be stacked relative to each other,
 * repositioned and resized, and their content can be easily manipulated. If you're implementing
 * a more sophisticated overlay/window system, this class is designed to provide a good
 * starting point.</p>
 * @constructor
 * @class Overlay
 */
Ojay.Overlay = JS.Class({
    extend: {
        BASE_LAYER:         10000,
        MINIMUM_OFFSET:     20,
        DEFAULT_SIZE:       {width: 400, height: 300},
        DEFAULT_POSITION:   {left: 50, top: 50},
        DEFAULT_OPACITY:    1,
        CONTAINER_CLASS:    'overlay-container',
        CONTENT_CLASS:      'overlay-content',
        
        Transitions: JS.Singleton({
            _store: {},
            
            INTERFACE: new JS.Interface(['hide', 'show']),
            
            _stub: {
                hide: function(overlay, chain) { return chain; },
                show: function(overlay, chain) { return chain; }
            },
            
            /**
             * @param {String} name
             * @param {Object} transitions Must implement Ojay.Overlay.Transitions.INTERFACE
             * @returns {Transitions}
             */
            add: function(name, transitions) {
                JS.Interface.ensure(transitions, this.INTERFACE);
                this._store[name] = transitions;
                return this;
            },
            
            /**
             * @param {String} name
             * @returns {Object} Implements Ojay.Overlay.Transitions.INTERFACE
             */
            get: function(name) {
                return this._store[name] || this._stub;
            }
        })
    },
    
    /**
     * @params {Object} options
     */
    initialize: function(options) {
        this._elements = {};
        options = this._options = options || {};
        Ojay(document.body).insert(this.getHTML().node, 'top');
        this._setState(INVISIBLE);
        this.setSize(options.width, options.height);
        this.setPosition(options.left, options.top);
        this.setContent(options.content);
        this.setLayer(options.layer);
        this.setOpacity(options.opacity);
    },
    
    /**
     * @returns {DomCollection}
     */
    getHTML: function() {
        var self = this, elements = self._elements;
        if (elements._container) return elements._container;
        return elements._container = Ojay( Ojay.HTML.div({className: self.klass.CONTAINER_CLASS}, function(html) {
            elements._content = Ojay( html.div({className: self.klass.CONTENT_CLASS}) );
        }) ).setStyle({position: 'absolute', overflow: 'hidden'}).hide();
    },
    
    /**
     * @returns {DomCollection}
     */
    getContainer: function() {
        return this._elements._container;
    },
    
    /**
     * @param {Number|String} left
     * @param {Number|String} top
     * @returns {Overlay}
     */
    setPosition: function(left, top) {
        if (this._inState(CLOSED)) return this;
        var defaults = this.klass.DEFAULT_POSITION;
        left = this._addUnits(left === undefined ? defaults.left : left);
        top = this._addUnits(top === undefined ? defaults.top : top);
        this._position = {left: left, top: top};
        if (this._inState(VISIBLE))
            this._elements._container.setStyle(this._position);
        return this;
    },
    
    /**
     * @returns {Object}
     */
    getPosition: function(strings) {
        return strings
                ? {left: this._position.left, top: this._position.top}
                : {left: parseInt(this._position.left), top: parseInt(this._position.top)};
    },
    
    /**
     * @returns {Overlay}
     */
    center: function() {
        if (this._inState(CLOSED, INVISIBLE)) return this;
        var region = this.getRegion();
        var viewport = Ojay.getViewportSize(), scrolls = Ojay.getScrollOffsets(),
            left = scrolls.left + viewport.width/2 - region.getWidth()/2,
            top = scrolls.top + viewport.height/2.2 - region.getHeight()/2;
        if (left < this.klass.MINIMUM_OFFSET) left = this.klass.MINIMUM_OFFSET;
        if (top < this.klass.MINIMUM_OFFSET) top = this.klass.MINIMUM_OFFSET;
        return this.setPosition(left, top);
    },
    
    /**
     * @param {Number|String} width
     * @param {Number|String} height
     * @returns {Overlay}
     */
    setSize: function(width, height) {
        if (this._inState(CLOSED)) return this;
        var defaults = this.klass.DEFAULT_SIZE;
        width = this._addUnits(width === undefined ? defaults.width : width);
        height = this._addUnits(height === undefined ? defaults.height : height);
        this._dimensions = {width: width, height: height};
        if (this._inState(VISIBLE))
            this._elements._container.setStyle(this._dimensions);
        return this;
    },
    
    /**
     * @returns {Object}
     */
    getSize: function(strings) {
        return strings
                ? {width: this._dimensions.width, height: this._dimensions.height}
                : {width: parseInt(this._dimensions.width), height: parseInt(this._dimensions.height)};
    },
    
    /**
     * @returns {Region}
     */
    getRegion: function() {
        return !this._inState(INVISIBLE, CLOSED)
                ? this._elements._container.getRegion()
                : undefined;
    },
    
    /**
     * @returns {Overlay}
     */
    fitToContent: function() {
        if (!this._inState(VISIBLE)) return this;
        var region = this._elements._content.getRegion();
        return this.setSize(region.getWidth(), region.getHeight());
    },
    
    /**
     * @param {Number} opacity
     * @returns {PageMask}
     */
    setOpacity: function(opacity) {
        this._opacity = (opacity === undefined)
                ? this.klass.DEFAULT_OPACITY
                : Number(opacity);
        if (this._opacity > 1) this._opacity /= 100;
        if (this._inState(VISIBLE))
            this._elements._container.setStyle({opacity: this._opacity});
        return this;
    },
    
    /**
     * @returns {Number}
     */
    getOpacity: function() {
        return this._opacity;
    },
    
    /**
     * @param {Overlay} overlay
     * @returns {Overlay}
     */
    positionBehind: function(overlay) {
        return this.setLayer(overlay.getLayer() - 1);
    },
    
    /**
     * @param {Overlay} overlay
     * @returns {Overlay}
     */
    positionInFront: function(overlay) {
        return this.setLayer(overlay.getLayer() + 1);
    },
    
    /**
     * @param {Number} index
     * @returns {Overlay}
     */
    setLayer: function(index) {
        if (this._inState(CLOSED)) return this;
        this._layer = (index === undefined) ? this.klass.BASE_LAYER : Number(index);
        this._elements._container.setStyle({zIndex: this._layer});
        return this;
    },
    
    /**
     * @returns {Number}
     */
    getLayer: function() {
        return this._layer;
    },
    
    /**
     * @param {String|HTMLElement} content
     * @returns {Overlay}
     */
    setContent: function(content) {
        if (this._inState(CLOSED)) return this;
        this._elements._content.setContent(content || '');
        return this;
    },
    
    /**
     * @param {String|HTMLElement} content
     * @param {String} position
     * @returns {Overlay}
     */
    insert: function(content, position) {
        if (this._inState(CLOSED)) return this;
        this._elements._content.insert(content, position);
        return this;
    },
    
    /**
     * @param {String} transition
     * @returns {Overlay|MethodChain}
     */
    show: function(transition) {
        if (!this._inState(INVISIBLE)) return this;
        this._setState(SHOWING);
        transition = this.klass.Transitions.get(transition || 'none');
        var chain = new JS.MethodChain()._(this)._setState(VISIBLE);
        return transition.show(this, chain);
    },
    
    /**
     * @param {String} transition
     * @returns {Overlay|MethodChain}
     */
    hide: function(transition) {
        if (!this._inState(VISIBLE)) return this;
        this._setState(HIDING);
        transition = this.klass.Transitions.get(transition || 'none');
        var chain = new JS.MethodChain()._(this)._setState(INVISIBLE);
        return transition.hide(this, chain);
    },
    
    /**
     * @param {String} transition
     * @returns {Overlay}
     */
    close: function(transition) {
        if (this._inState(CLOSED)) return this;
        if (this._inState(VISIBLE)) return this.hide(transition).close();
        this._elements._container.remove();
        this._setState(CLOSED);
        return this;
    },
    
    _addUnits: function(x) {
        return String(x).replace(/^(-?\d+(?:\.\d+)?)$/g, '$1px');
    },
    
    _setState: function(state) {
        this._state = state;
        return this;
    },
    
    _inState: function() {
        var n = arguments.length;
        while (n--) {
            if (this._state == arguments[n]) return true;
        }
        return false;
    }
});
