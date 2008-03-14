Ojay.Paginator = JS.Class({
    extend: {
        CLASS_NAMES: {
            container: 'paginator'
        }
    },
    
    /**
     * @param {String|HTMLElement|DomCollection} subject
     * @param {Object} options
     */
    initialize: function(subject, options) {
        this._elements = {};
        subject = this._elements._subject = Ojay(subject).at(0);
        if (!subject.node) return;
        this._options = options || {};
        var container = this.getContainer();
        subject.insert(container.node, 'after');
        container.insert(subject.node);
    },
    
    /**
     * @returns {DomCollection}
     */
    getContainer: function() {
        var elements = this._elements, options = this._options;
        if (elements._container) return elements._container;
        var container = Ojay( Ojay.HTML.div({className: this.klass.CLASS_NAMES.container}) );
        container.setStyle({
            width: options.width + 'px',
            height: options.height + 'px',
            overflow: 'hidden',
            padding: '0 0 0 0'
        });
        return elements._container = container;
    },
    
    /**
     * @returns {DomCollection}
     */
    getItems: function() {
        var elements = this._elements;
        return elements._items || (elements._items = elements._subject.children(this._options.selector));
    }
});
