Ojay.Paginator = JS.Class({
    include: [Ojay.Observable, JS.State],
    
    extend: {
        CONTAINER_CLASS:    'paginator',
        ITEM_CLASS:         'item',
        SCROLL_TIME:        0.5,
        DIRECTION:          'horizontal',
        EASING:             'easeBoth'
    },
    
    /**
     * @param {String|HTMLElement|DomCollection} subject
     * @param {Object} options
     */
    initialize: function(subject, options) {
        this._selector = subject;
        this._elements = {};
        
        options = this._options = options || {};
        options.scrollTime = options.scrollTime || this.klass.SCROLL_TIME;
        options.direction = options.direction || this.klass.DIRECTION;
        options.easing = options.easing || this.klass.EASING;
        
        this.setState('CREATED');
    },
    
    /**
     * @returns {Object}
     */
    getInitialState: function() {
        return {page: 1};
    },
    
    /**
     * @param {Object} state
     */
    changeState: function(state) {
        if (state.page !== undefined) this.setPage(state.page);
    },
    
    /**
     * @returns {DomCollection}
     */
    getHTML: function() {
        var elements = this._elements, options = this._options;
        if (elements._container) return elements._container;
        var container = Ojay( Ojay.HTML.div({className: this.klass.CONTAINER_CLASS}) );
        container.setStyle({
            width: options.width,
            height: options.height,
            overflow: 'hidden',
            padding: '0 0 0 0',
            border: 'none'
        });
        return elements._container = container;
    },
    
    /**
     * @returns {DomCollection}
     */
    getContainer: function() {
        return this.getHTML();
    },
    
    /**
     * @returns {DomCollection}
     */
    getSubject: function() {
        return this._elements._subject || undefined;
    },
    
    /**
     * @returns {Region}
     */
    getRegion: function() {
        if (!this._elements._container) return undefined;
        return this._elements._container.getRegion();
    },
    
    /**
     * @returns {DomCollection}
     */
    getItems: function() {
        var elements = this._elements;
        if (!elements._subject) return undefined;
        elements._items = elements._subject.children(this._options.selector);
        elements._items.setStyle({margin: '0 0 0 0'});
        return elements._items;
    },
    
    /**
     * @returns {Number}
     */
    getPages: function() {
        if (this._numPages) return this._numPages;
        var items = this.getItems();
        if (!items) return undefined;
        if (items.length === 0) return 0;
        var containerRegion = this.getRegion(), itemRegion = items.at(0).getRegion();
        this._itemWidth     = itemRegion.getWidth();
        this._itemHeight    = itemRegion.getHeight();
        this._itemsPerCol   = (containerRegion.getWidth() / this._itemWidth).floor();
        this._itemsPerRow   = (containerRegion.getHeight() / this._itemHeight).floor();
        this._itemsPerPage  = this._itemsPerRow * this._itemsPerCol;
        return (items.length / this._itemsPerPage).ceil();
    },
    
    /**
     * @returns {Number}
     */
    getCurrentPage: function() {
        return this._currentPage || undefined;
    },
    
    /**
     * @param {Number} id
     * @returns {Number}
     */
    pageForItem: function(id) {
        if (!this._numPages) return undefined;
        var n = this._elements._items.length;
        if (id < 1 || id > n) return undefined;
        return ((id - 1) / this._itemsPerPage).floor() + 1;
    },
    
    /**
     * @returns {Paginator.Controls}
     */
    addControls: function(position) {
        if (this.inState('CREATED') || !/^(?:before|after)$/.test(position)) return undefined;
        var controls = new this.klass.Controls(this);
        this.getContainer().insert(controls.getHTML().node, position);
        return controls;
    },
    
    states: {
        CREATED: {
            /**
             */
            setup: function() {
                var subject = this._elements._subject = Ojay(this._selector).at(0);
                if (!subject.node) return;
                var container = this.getHTML();
                subject.insert(container.node, 'after');
                container.insert(subject.node);
                subject.setStyle({padding: '0 0 0 0', border: 'none'});
                
                var pages = this._numPages = this.getPages(), region = this.getRegion();
                
                var style = (this._options.direction == 'vertical')
                        ? { width: region.getWidth() + 'px', height: (pages * region.getHeight() + 1000) + 'px' }
                        : { width: (pages * region.getWidth() + 1000) + 'px', height: region.getHeight() + 'px' };
                
                subject.setStyle(style);
                
                var state = this.getInitialState();
                this.setState('READY');
                this._currentPage = state.page;
                this.setPage(state.page);
            }
        },
        
        READY: {
            /**
             * @param {Number} page
             * @param {Boolean} animate
             */
            setPage: function(page, animate) {
                page = Number(page);
                if (page < 1 || page > this._numPages) return;
                this.setScroll((page - 1) / (this._numPages - 1), {animate: animate !== false});
            },
            
            /**
             * @param {Boolean} animate
             */
            incrementPage: function(animate) {
                return this.setPage(this._currentPage + 1, animate);
            },
            
            /**
             * @param {Boolean} animate
             */
            decrementPage: function(animate) {
                return this.setPage(this._currentPage - 1, animate);
            },
            
            /**
             * @param {Boolean} animate
             */
            snapToPage: function(animate) {
                this.setScroll((this._currentPage - 1) / (this._numPages - 1),
                        {animate: animate !== false, silent: true});
            },
            
            /**
             * @param {Number} id
             * @param {Boolean} animate
             */
            focusItem: function(id, animate) {
                var page = this.pageForItem(id);
                if (!page) return;
                var element = this._elements._items.at(id - 1);
                this.notifyObservers('focusitem', id, element);
                this.setPage(page, animate);
                element.addClass('focused');
            },
            
            /**
             * @param {Number} amount
             * @param {Object} options
             */
            setScroll: function(amount, options) {
                var orientation = this._options.direction, settings;
                var method = (orientation == 'vertical') ? 'getHeight' : 'getWidth';
                var pages = this._numPages, total = this.getRegion()[method]() * (pages - 1);
                
                if (amount >= 0 && amount <= 1) amount = amount * total;
                if (amount < 0 || amount > total) return;
                
                this._elements._items.removeClass('focused');
                options = options || {};
                
                if (options.animate && YAHOO.util.Anim) {
                    this.setState('SCROLLING');
                    settings = (orientation == 'vertical')
                            ? { marginTop: {to: -amount} }
                            : { marginLeft: {to: -amount} };
                    this._elements._subject.animate(settings,
                        this._options.scrollTime, {easing: this._options.easing})._(function(self) {
                        self.setState('READY');
                    }, this);
                } else {
                    settings = (orientation == 'vertical')
                            ? { marginTop: (-amount) + 'px' }
                            : { marginLeft: (-amount) + 'px' };
                    this._elements._subject.setStyle(settings);
                }
                
                if (!options.silent) this.notifyObservers('scroll', amount/total, total);
                
                var page = (pages * (amount/total)).ceil() || 1;
                if (page != this._currentPage) {
                    this._currentPage = page;
                    this.notifyObservers('pagechange', page);
                    
                    if (page == 1) this.notifyObservers('firstpage');
                    if (page == this._numPages) this.notifyObservers('lastpage');
                }
            }
        },
        
        SCROLLING: {}
    }
});
