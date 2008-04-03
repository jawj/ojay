Ojay.AjaxPaginator = JS.Class(Ojay.Paginator, {
    /**
     * @param {String} subject
     * @parsm {Object} options
     */
    initialize: function(subject, options) {
        this.callSuper();
        this._options.urls = this._options.urls.map(function(url) {
            return {_url: url, _loaded: false};
        });
    },
    
    /**
     * @param {Number} page
     * @returns {Boolean}
     */
    _pageLoaded: function(page) {
        return !!(this._options.urls[page - 1]||{})._loaded;
    },
    
    /**
     * @returns {DomCollection}
     */
    getItems: function() {
        var elements = this._elements;
        if (elements._items) return elements._items;
        if (!elements._subject) return undefined;
        var urls = this._options.urls;
        if (!urls.length) return undefined;
        urls.length.times(function(i) {
            var item = Ojay( Ojay.HTML.div({className: this.klass.ITEM_CLASS}) );
            elements._subject.insert(item.node, 'bottom');
        }, this);
        var items = this.callSuper();
        items.fitToRegion(this.getRegion());
        return items;
    },
    
    states: {
        READY: {
            /**
             * @param {Number} page
             */
            _handleSetPage: function(page) {
                if (this._pageLoaded(page)) return this.callSuper();
                var url = this._options.urls[page - 1], _super = this.method('callSuper'), self = this;
                this.setState('REQUESTING');
                this.notifyObservers('pagerequest', url._url);
                Ojay.HTTP.GET(url._url, {}, {
                    onSuccess: function(response) {
                        response.insertInto(self._elements._items.at(page - 1));
                        url._loaded = true;
                        self.setState('READY');
                        self.notifyObservers('pageload', url._url, response);
                        _super();
                    },
                    onFailure: this.method('setState').partial('READY')
                });
            }
        },
        
        REQUESTING: {}
    }
});
