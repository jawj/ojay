/**
 * <p>The <tt>InputStates</tt> module is mixed into <tt>Forms.Select</tt>, and indirectly into
 * <tt>Forms.Checkbox</tt> and <tt>Forms.RadioButtons.Item</tt> through <tt>ButtonStates</tt>.
 * It provides methods for setting class names on form elements to indicate the hovered, focused
 * and disabled states of form inputs.</p>
 * @module InputStates
 * @private
 */
var InputStates = JS.Module(/** @scope InputStates */{
    
    /**
     * <p>Called inside class constructors to set up the behaviour of the form input and
     * its associated label. Hides the input off the page, and sets up a set of events to
     * enable class names to be changed.</p>
     */
    _setupInput: function() {
        var region = this._input.getRegion(), top = region ? region.top : 0;
        this._input.setStyle({position: 'absolute', left: '-5000px', top: top + 'px'});
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
        return this;
    },
    
    /**
     * <p>Adds or removes the class name 'focused' from the input and its label depending on <tt>state</tt>.</p>
     * @param {Boolean} state
     * @returns {InputStates}
     */
    setHovered: function(state) {
        this._setClass(state, 'hovered');
        return this;
    },
    
    /**
     * <p>Adds or removes the class name 'disabled' from the input and its label depending on <tt>state</tt>.</p>
     * @param {Boolean} state
     * @returns {InputStates}
     */
    setDisabled: function(state) {
        this.disabled = (state === undefined) ? this._input.node.disabled : !!state;
        this._input.node.disabled = this.disabled;
        this._setClass(this.disabled, 'disabled');
        return this;
    },
    
    /**
     * <p>Adds or removes a class name from the input's elements according to its state.</p>
     * @param {Boolean} state
     * @param {String} name
     */
    _setClass: function(state, name) {
        this._interface.forEach(it()[!!state ? 'addClass' : 'removeClass'](name));
    }
});
