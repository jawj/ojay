/**
 * <p>The <tt>ButtonStates</tt> module is internal to the <tt>Forms</tt> package and cannot be
 * accessed externally. It provides methods common to the <tt>Checkbox</tt> and <tt>RadioButtons</tt>
 * classes for listening to form events and setting class names on <tt>label</tt> elements.</p>
 * @private
 */
var ButtonStates = JS.Module({
    /**
     * <p>Called inside class constructors to set up the behaviour of a form input and its label.</p>
     */
    setupButton: function() {
        // TODO: Taken out for testing - put back in before release
        // this._input.setStyle({opacity: 0, position: 'absolute', left: '-5000px', top: '-5000px'});
        this._input.on('click')._(this).setChecked();
        this._input.on('focus')._(this).setFocused(true);
        this._input.on('blur')._(this).setFocused(false);
        
        this._label = Ojay.Forms.getLabel(this._input);
        this._label.addClass('js');
        this._label.on('mouseover')._(this).setHovered(true);
        this._label.on('mouseout')._(this).setHovered(false);
        
        this.setChecked();
    },
    
    /**
     * <p>Adds or removes the class name 'focused' from the input and its label depending on <tt>state</tt>.</p>
     * @param {Boolean} state
     */
    setFocused: function(state) {
        if (this._input.node.checked) this.setChecked();
        [this._input, this._label].forEach(it()[!!state ? 'addClass' : 'removeClass']('focused'));
    },
    
    /**
     * <p>Adds or removes the class name 'focused' from the input and its label depending on <tt>state</tt>.</p>
     * @param {Boolean} state
     */
    setHovered: function(state) {
        [this._input, this._label].forEach(it()[!!state ? 'addClass' : 'removeClass']('hovered'));
    },
    
    /**
     * <p>Adds or removes the class name 'focused' from the input and its label depending on whether the
     * input is checked. If the input is part of a <tt>RadioButtons</tt> group, notifies the group in
     * order to change the state of the currently checked input.</p>
     * @param {Boolean} state
     */
    setChecked: function(state) {
        this.checked = (state === undefined) ? this._input.node.checked : !!state;
        if (this._group) this.checked && this._group.check(this);
        else this._input.node.checked = this.checked;
        [this._input, this._label].forEach(it()[this.checked ? 'addClass' : 'removeClass']('checked'));
    }
});
