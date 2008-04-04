/**
 * <p>The <tt>ButtonStates</tt> module is internal to the <tt>Forms</tt> package and cannot be
 * accessed externally. It provides methods common to the <tt>Checkbox</tt> and <tt>RadioButtons</tt>
 * classes for listening to form events and setting class names on <tt>label</tt> elements.</p>
 * @private
 */
var ButtonStates = JS.Module({
    include: InputStates,
    
    /**
     * <p>Called inside class constructors to set up the behaviour of a form input and its label.</p>
     */
    _setupButton: function() {
        this._setupInput();
        this._input.on('click')._(this).setChecked()._(this._input.node).focus();
        this.setChecked();
    },
    
    /**
     * <p>Adds or removes the class name 'focused' from the input and its label depending on whether the
     * input is checked. If the input is part of a <tt>RadioButtons</tt> group, notifies the group in
     * order to change the state of the currently checked input.</p>
     * @param {Boolean} state
     */
    setChecked: function(state) {
        this.checked = (state === undefined) ? this._input.node.checked : !!state;
        if (this._group) this.checked && (this._input.node.checked = true) && this._group.check(this);
        else this._input.node.checked = this.checked;
        this._setClass(this.checked, 'checked');
    }
});

JS.MethodChain.addMethods(['focus']);
