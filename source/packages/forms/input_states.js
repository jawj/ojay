var InputStates = JS.Module({
    /**
     *
     */
    _setupInput: function() {
        this._input.setStyle({position: 'absolute', left: '-5000px', top: '-5000px'});
        this._input.on('focus')._(this).setFocused(true);
        this._input.on('blur')._(this).setFocused(false);
        
        this._label = Ojay.Forms.getLabel(this._input);
        
        this._interface = [this._input, this._label];
        if (this.getHTML) this._interface.push(this.getHTML());
        this._interface.forEach(it().on('mouseover')._(this).setHovered(true));
        this._interface.forEach(it().on('mouseout')._(this).setHovered(false));
        this._interface.forEach(it().addClass('js'));
        
        this.setDisabled();
    },
    
    /**
     * <p>Adds or removes the class name 'focused' from the input and its label depending on <tt>state</tt>.</p>
     * @param {Boolean} state
     */
    setFocused: function(state) {
        if (this._input.node.checked) this.setChecked();
        this._setClass(state, 'focused');
    },
    
    /**
     * <p>Adds or removes the class name 'focused' from the input and its label depending on <tt>state</tt>.</p>
     * @param {Boolean} state
     */
    setHovered: function(state) {
        this._setClass(state, 'hovered');
    },
    
    /**
     * <p>Adds or removes the class name 'disabled' from the input and its label depending on <tt>state</tt>.</p>
     * @param {Boolean} state
     */
    setDisabled: function(state) {
        this.disabled = (state === undefined) ? this._input.node.disabled : !!state;
        this._input.node.disabled = this.disabled;
        this._setClass(this.disabled, 'disabled');
    },
    
    _setClass: function(state, name) {
        this._interface.forEach(it()[!!state ? 'addClass' : 'removeClass'](name));
    }
});
