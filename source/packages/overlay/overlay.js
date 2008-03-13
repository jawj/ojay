var whileHidden = function(method) {
    return function() {
        var container = this._elements._container;
        container.setStyle({visibility: 'hidden'});
        this.show('none')[method]().hide('none');
        container.setStyle({visibility: ''});
        return this;
    };
};

/**
 * @constructor
 * @class Overlay
 */
Ojay.Overlay = JS.Class({
    include: [JS.State, JS.Observable],
    
    extend: {
        BASE_LAYER:         10000,
        MINIMUM_OFFSET:     20,
        DEFAULT_SIZE:       {width: 400, height: 300},
        DEFAULT_POSITION:   {left: 50, top: 50},
        DEFAULT_OPACITY:    1,
        CONTAINER_CLASS:    'overlay-container',
        
        Transitions: JS.Singleton({
            _store: {},
            
            INTERFACE: new JS.Interface(['hide', 'show']),
            
            _stub: {
                hide: function(overlay) { return overlay; },
                show: function(overlay) { return overlay; }
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
     * @param {Object} options
     */
    initialize: function(options) {
        this._elements = {};
        options = this._options = options || {};
        Ojay(document.body).insert(this.getHTML().node, 'top');
        this.setState('INVISIBLE');
        this.setSize(options.width, options.height);
        this.setPosition(options.left, options.top);
        this.setLayer(options.layer);
        this.setOpacity(options.opacity);
    },
    
    /**
     * @returns {DomCollection}
     */
    getHTML: function() {
        var self = this, elements = self._elements;
        if (elements._container) return elements._container;
        return elements._container = Ojay(
            Ojay.HTML.div({className: this.klass.CONTAINER_CLASS})
        ).setStyle({position: 'absolute', overflow: 'hidden'}).hide();
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
        if (this.inState('CLOSED')) return this;
        var defaults = this.klass.DEFAULT_POSITION;
        left = this._addUnits(left === undefined ? defaults.left : left);
        top = this._addUnits(top === undefined ? defaults.top : top);
        this._position = {left: left, top: top};
        if (this.inState('VISIBLE'))
            this._elements._container.setStyle(this._position);
        return this;
    },
    
    /**
     * @returns {Object}
     */
    getPosition: function(strings) {
        var pos = this._position, left = pos.left, top = pos.top;
        return strings
                ? {left: left, top: top}
                : {left: parseInt(left), top: parseInt(top)};
    },
    
    /**
     * @param {Number|String} width
     * @param {Number|String} height
     * @returns {Overlay}
     */
    setSize: function(width, height) {
        if (this.inState('CLOSED')) return this;
        var defaults = this.klass.DEFAULT_SIZE;
        width = this._addUnits(width === undefined ? defaults.width : width);
        height = this._addUnits(height === undefined ? defaults.height : height);
        this._dimensions = {width: width, height: height};
        if (this.inState('VISIBLE'))
            this._elements._container.setStyle(this._dimensions);
        return this;
    },
    
    /**
     * @returns {Object}
     */
    getSize: function(strings) {
        var size = this._dimensions, width = size.width, height = size.height;
        return strings
                ? {width: width, height: height}
                : {width: parseInt(width), height: parseInt(height)};
    },
    
    /**
     * @returns {Region}
     */
    getRegion: function() {
        return !this.inState('INVISIBLE', 'CLOSED')
                ? this._elements._container.getRegion()
                : undefined;
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
        if (this.inState('VISIBLE'))
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
        if (this.inState('CLOSED')) return this;
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
    
    states: {
        
        INVISIBLE: {
            center: whileHidden('center'),
            
            show: function(transition) {
                this.setState('SHOWING');
                transition = this.klass.Transitions.get(transition || 'none');
                var chain = new JS.MethodChain()._(this).setState('VISIBLE');
                return transition.show(this, chain);
            },
            
            close: function() {
                this._elements._container.remove();
                this.setState('CLOSED');
                return this;
            }
        },
        
        SHOWING: {},
        
        VISIBLE: {
            center: function() {
                var region = this.getRegion();
                var viewport = Ojay.getViewportSize(), scrolls = Ojay.getScrollOffsets(),
                    left = scrolls.left + viewport.width/2 - region.getWidth()/2,
                    top = scrolls.top + viewport.height/2.2 - region.getHeight()/2;
                if (left < this.klass.MINIMUM_OFFSET) left = this.klass.MINIMUM_OFFSET;
                if (top < this.klass.MINIMUM_OFFSET) top = this.klass.MINIMUM_OFFSET;
                return this.setPosition(left, top);
            },
            
            hide: function(transition) {
                this.setState('HIDING');
                transition = this.klass.Transitions.get(transition || 'none');
                var chain = new JS.MethodChain()._(this).setState('INVISIBLE');
                return transition.hide(this, chain);
            },
            
            close: function(transition) {
                return this.hide(transition)._(this).close();
            }
        },
        
        HIDING: {},
        
        CLOSED: {}
    },
    
    _addUnits: function(x) {
        return String(x).replace(/^(-?\d+(?:\.\d+)?)$/g, '$1px');
    }
});
