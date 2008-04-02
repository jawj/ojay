Ojay.Paginator = JS.Class({
    include: [Ojay.Observable, JS.State],
    
    extend: {
        CONTAINER_CLASS:    'paginator',
        ITEM_CLASS:         'item',
        SCROLL_TIME:        0.5
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
            padding: '0 0 0 0'
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
        return this._elements._subject || null;
    },
    
    /**
     * @returns {Region}
     */
    getRegion: function() {
        return this._elements._container.getRegion();
    },
    
    /**
     * @returns {DomCollection}
     */
    getItems: function() {
        var elements = this._elements;
        return elements._items || (elements._items = elements._subject.children(this._options.selector));
    },
    
    /**
     * @returns {Number}
     */
    getPages: function() {
        var items = this.getItems();
        if (items.length === 0) return 0;
        var containerRegion = this.getRegion(), itemRegion = items.at(0).getRegion();
        this._itemsPerPage = (containerRegion.getWidth() / itemRegion.getWidth()).floor();
        return (items.length / this._itemsPerPage).ceil();
    },
    
    /**
     * @returns {Number}
     */
    getCurrentPage: function() {
        return this._currentPage;
    },
    
    states: {
        CREATED: {
            /**
             */
            setup: function() {
                if (this._elements._subject) return;
                var subject = this._elements._subject = Ojay(this._selector).at(0);
                if (!subject.node) return;
                var container = this.getHTML();
                subject.insert(container.node, 'after');
                container.insert(subject.node);
                
                this._numPages = this.getPages();
                var region = this.getRegion();
                subject.setStyle({
                    width: (this._numPages * region.getWidth()) + 'px',
                    height: region.getHeight() + 'px'
                });
                
                var state = this.getInitialState();
                this.setState('READY');
                this._currentPage = state.page;
                this.setPage(state.page);
            }
        },
        
        READY: {
            /**
             * @param {Number} page
             */
            setPage: function(page) {
                page = Number(page);
                if (page == this._currentPage || page < 1 || page > this._numPages) return;
                var region = this.getRegion();
                this.setState('SCROLLING');
                this.notifyObservers('setpage', page);
                this._elements._subject.animate({
                    marginLeft: {to: -(page-1) * region.getWidth()}
                }, this._options.scrollTime, {easing: 'easeBoth'})._(function(self) {
                    self._currentPage = page;
                    self.setState('READY');
                }, this);
            },
            
            /**
             */
            incrementPage: function() {
                return this.setPage(this._currentPage + 1);
            },
            
            /**
             */
            decrementPage: function() {
                return this.setPage(this._currentPage - 1);
            }
        },
        
        SCROLLING: {}
    }
});
