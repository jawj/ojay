/**
 * @constructor
 * @class Forms.Select
 */
Ojay.Forms.Select = JS.Class({
    include: [Ojay.Observable, JS.State, InputStates],
    
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
                this._select = select;
                this._option = Ojay(option);
                this.value = option.value || '';
                this._label = option.text.stripTags();
                this.hovered = false;
                
                this.getHTML().on('mouseover')._(this).setHovered(true);
            },
            
            /**
             * @returns {DomCollection}
             */
            getHTML: function() {
                if (this._html) return this._html;
                return this._html = Ojay( Ojay.HTML.li(this._label) );
            },
            
            /**
             * @param {Boolean} state
             */
            setHovered: function(state) {
                this.hovered = (state !== false);
                if (this.hovered) this._select._setHoveredOption(this);
                this.getHTML()[state === false ? 'removeClass' : 'addClass']('hovered');
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
        var elements = this._elements = {};
        this._input.insert(this.getHTML().node, 'after');
        this._setupInput();
        this.updateOptions();
        
        this.setState('LIST_OPEN');
        this.hideList(false);
        
        this._input.on('blur')._(this).hideList(true);
        
        // Wait a little bit because 'keydown' fires before the value changes
        [this._input.on('keydown'), this._input.on('change')]
                .forEach(it().wait(0.001)._(this)._updateDisplayFromSelect());
        
        elements._container.setStyle({position: 'relative', cursor: 'default'});
        elements._container.on('click')._(this).showList();
        
        var KeyListener = YAHOO.util.KeyListener;
        new KeyListener(this._input.node, {keys: KeyListener.KEY.ESCAPE}, {
            fn: this.method('hideList').partial(false)
        }).enable();
        new KeyListener(this._input.node, {keys: KeyListener.KEY.ENTER}, {
            fn: this.method('hideList').partial(true)
        }).enable();
        
        elements._listContainer.setStyle({position: 'absolute'});
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
    _focusInput: function() {
        this._input.node.focus();
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
        var selected = this.getSelectedOption();
        if (!selected) return;
        this._elements._display.setContent(selected.text.stripTags());
        this._getOption(selected.value).setHovered(true);
        this.notifyObservers('change');
    },
    
    /**
     * @returns {Forms.Select.Option}
     */
    _getOption: function(value) {
        return this._options.filter({value: value})[0] || null;
    },
    
    /**
     * @param {Forms.Select.Option}
     */
    _setHoveredOption: function(option) {
        if (this._currentOption) this._currentOption.setHovered(false);
        this._currentOption = option;
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
        return this._getOptions().filter('selected')[0] || this._input.node.options[0] || null;
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
    },
    
    /**
     *
     */
    updateListPosition: function() {
        var region = this._elements._container.getRegion();
        if (!region) return;
        var list = this._elements._listContainer;
        list.setStyle({width: region.getWidth() + 'px', left: 0, top: region.getHeight() + 'px'});
    },
    
    states: {
        LIST_CLOSED: {
            showList: function() {
                this.updateListPosition();
                this._elements._listContainer.show();
                this._focusInput();
                var selected = this.getSelectedOption();
                if (selected) this._getOption(selected.value).setHovered(true);
                this.setState('LIST_OPEN');
            },
            
            toggleList: function() {
                this.showList();
            }
        },
        
        LIST_OPEN: {
            hideList: function(update) {
                this._elements._listContainer.hide();
                if (update !== false) {
                    this.setValue(this._currentOption.value);
                    this._focusInput();
                }
                this.setState('LIST_CLOSED');
            },
            
            toggleList: function(update) {
                this.hideList(update);
            }
        }
    }
});
