/**
 * @constructor
 * @class Forms.Select
 */
Ojay.Forms.Select = JS.Class({
    include: JS.State,
    
    extend: {
        CONTAINER_CLASS:    'select-container',
        DISPLAY_CLASS:      'select-display',
        BUTTON_CLASS:       'select-button',
        LIST_CLASS:         'select-list',
        
        Option: JS.Class({
            /**
             * @param {Forms.Select} select
             * @param {HTMLElement} option
             */
            initialize: function(select, option) {
                this._option = Ojay(option);
                this._value = option.value || '';
                this._label = option.text.stripTags();
                this.getHTML().on('click')._(select).setValue(this._value);
            },
            
            /**
             * @returns {DomCollection}
             */
            getHTML: function() {
                if (this._html) return this._html;
                return this._html = Ojay( Ojay.HTML.li(this._label) );
            }
        })
    },
    
    /**
     * @param {String|HTMLElement|DomCollection} select
     */
    initialize: function(select) {
        this._input = Ojay(select);
        if (!this._input || this._input.node.tagName.toLowerCase() != 'select')
            throw new TypeError('Attempt to create a Select object with non-select element');
        this._elements = {};
        this._input.insert(this.getHTML().node, 'after');
        this.updateOptions();
        
        this._elements._list.on('mouseover', Ojay.delegateEvent({ li: it().addClass('hover') }));
        this._elements._list.on('mouseout', Ojay.delegateEvent({ li: it().removeClass('hover') }));
        
        // Wait a little bit because 'keydown' fires before the value changes
        [this._input.on('keydown'), this._input.on('change')]
                .forEach(it().wait(0.001)._(this)._updateDisplayFromSelect());
    },
    
    /**
     * @returns {DomCollection}
     */
    getHTML: function() {
        var elements = this._elements, klass = this.klass;
        if (elements._container) return elements._container;
        return elements._container = Ojay( Ojay.HTML.div({className: this.klass.CONTAINER_CLASS}, function(HTML) {
            elements._display = Ojay( HTML.div({className: klass.DISPLAY_CLASS}) );
            elements._button = Ojay( HTML.div({className: klass.BUTTON_CLASS}) );
            elements._listContainer = Ojay( HTML.div({className: klass.LIST_CLASS}, function(HTML) {
                elements._list = Ojay( HTML.ul() );
            }) );
        }) );
    },
    
    /**
     *
     */
    updateOptions: function() {
        this._elements._list.setContent('');
        this._options = Array.from(this._input.node.options).map(function(option) {
            option = new this.klass.Option(this, option);
            this._elements._list.insert(option.getHTML().node);
            return option;
        }, this);
        this._updateDisplayFromSelect();
    },
    
    /**
     *
     */
    _updateDisplayFromSelect: function() {
        var selected = this.getSelectedOption() || this._input.node.options[0];
        if (!selected) return;
        this._elements._display.setContent(selected.text.stripTags());
    },
    
    /**
     * @returns {Array}
     */
    _getOptions: function() {
        return Array.from(this._input.node.options);
    },
    
    /**
     * @returns {HTMLElement}
     */
    getSelectedOption: function() {
        return this._getOptions().filter('selected')[0] || null;
    },
    
    /**
     * @param {String|Number} value
     * @returns {Array}
     */
    getOptionsByValue: function(value) {
        return this._getOptions().filter({value: value});
    },
    
    /**
     * @param {String|Number} value
     */
    setValue: function(value) {
        this._getOptions().forEach(function(option) { option.selected = false; });
        this.getOptionsByValue(value).forEach(function(option) { option.selected = true; });
        this._updateDisplayFromSelect();
    }
});
