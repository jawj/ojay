Ojay.FilmStrip = new JS.Class('Ojay.FilmStrip', {
    include: Ojay.Paginatable,
    
    initialize: function(subject, options) {
        this._selector = subject;
        this._elements = {};
        
        options = this._options  = options || {};
        options.scrollTime = options.scrollTime || this.klass.SCROLL_TIME;
        options.direction  = options.direction  || this.klass.DIRECTION;
        options.easing     = options.easing     || this.klass.EASING;
        this.setState('CREATED');
    },
    
    getHTML: function() {
        var elements = this._elements, options = this._options;
        if (elements._container) return elements._container;
        var container = Ojay( Ojay.HTML.div({className: this.klass.CONTAINER_CLASS}) );
        container.addClass(this._options.direction);
        
        var dimensions = this.getDimensions(),
            vertical   = (this.getDirection() == 'vertical'),
            width      = vertical ? dimensions.width + 'px' : options.width,
            height     = vertical ? options.height : dimensions.height + 'px';
        
        container.setStyle({
            width:      width,
            height:     height,
            overflow:   'hidden',
            padding:    '0 0 0 0',
            border:     'none',
            position:   'relative'
        });
        return elements._container = container;
    },
    
    getItems: function() {
        if (this._items) return this._items;
        
        return this._items = this._elements._subject.children().map(function(child) {
            return new this.klass.Item(this, child);
        }, this);
    },
    
    getDimensions: function() {
        var vertical = (this.getDirection() == 'vertical'),
            width    = 0,
            height   = 0;
        
        this.getItems().forEach(function(item) {
            if (vertical) {
                width   = Math.max(width, item.getWidth());
                height += item.getHeight();
            } else {
                width  += item.getWidth();
                height  = Math.max(height, item.getHeight());
            }
        });
        
        return {width: width, height: height};
    },
    
    getPages: function() {
        return this._numPages = this.getItems().length;
    },
    
    states: {
        CREATED: {
            setup: function() {
                var subject = this._elements._subject = Ojay(this._selector).at(0);
                if (!subject.node) return this;
                
                var container = this.getHTML();
                subject.insert(container.node, 'after');
                container.insert(subject.node);
                subject.setStyle({padding: '0 0 0 0', border: 'none', position: 'absolute', left: 0, top: 0});
                
                var dims  = this.getDimensions();
                
                var style = (this._options.direction == 'vertical')
                        ? { width: dims.width + 'px', height: (dims.height + 1000) + 'px' }
                        : { width: (dims.width + 1000) + 'px', height: dims.height + 'px' };
                
                subject.setStyle(style);
                
                var state = this.getInitialState();
                this.setState('READY');
                if (this._currentPage === undefined) this._currentPage = state.page;
                this._handleSetPage(this._currentPage);
                
                return this;
            }
        },
        
        READY: {
            focusItem: function(item) {
                this.setPage(this._items.indexOf(item) + 1);
                return this;
            },
            
            incrementPage: function() {
                return this.setPage(this._currentPage + 1);
            },
            
            decrementPage: function() {
                return this.setPage(this._currentPage - 1);
            },
            
            _handleSetPage: function(page, callback, scope) {
                var region   = this.getRegion(),
                    vertical = (this.getDirection() == 'vertical'),
                    method   = vertical ? 'getHeight' : 'getWidth',
                    halfR    = region[method]() / 2,
                    offset   = 0,
                    i        = 0,
                    items    = this.getItems();
                
                while (i < page - 1) {
                    offset += items[i][method]();
                    i += 1;
                }
                offset += items[page - 1][method]() / 2;
                
                var diff = offset - halfR;
                
                
                this._currentPage = page;
                this.setScroll(offset - halfR, {animate: true}, callback, scope);
            },
            
            setScroll: function(amount, options, callback, scope) {
                var region     = this.getRegion(),
                    dimensions = this.getDimensions(),
                    vertical   = (this.getDirection() == 'vertical'),
                    method     = vertical ? 'getHeight' : 'getWidth',
                    halfR      = region[method]() / 2;
                
                if (this._options.overshoot === false) {
                    amount = Math.max(amount, 0);
                    amount = Math.min(amount, dimensions[vertical ? 'height' : 'width'] - 2*halfR);
                }
                
                var settings = {};
                settings[vertical ? 'top' : 'left'] = {to: -amount};
                this._elements._subject.animate(settings, this.klass.SCROLL_TIME);
                
                return this;
            }
        }
    },
    
    extend: {
        CONTAINER_CLASS:    'filmstrip',
        PAGE_CLASS:         'item',
        SCROLL_TIME:        0.5,
        DIRECTION:          'horizontal',
        EASING:             'easeBoth',
        
        Item: new JS.Class({
            initialize: function(strip, element) {
                this._element = element;
                var region    = element.getRegion();
                this._width   = region.getWidth();
                this._height  = region.getHeight();
                
                this._strip = strip;
                element.on('click')._(strip).focusItem(this);
            },
            
            getWidth: function() {
                return this._width;
            },
            
            getHeight: function() {
                return this._height;
            }
        })
    }
});

