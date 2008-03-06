var ButtonStates = JS.Module({
    setupButton: function() {
        this.setChecked(this._input.node.checked);
        
        this._input.setStyle({opacity: 0, position: 'absolute', left: '-5000px', top: '-5000px'});
        this._input.on('click')._(this).setChecked(true);
        this._input.on('focus')._(this).setFocused(true);
        this._input.on('blur')._(this).setFocused(false);
        
        this._label.addClass('js');
        this._label.on('mouseover')._(this).setHovered(true);
        this._label.on('mouseout')._(this).setHovered(false);
    },
    
    setFocused: function(state) {
        if (this._input.node.checked) this.setChecked(true);
        [this._input, this._label].forEach(it()[!!state ? 'addClass' : 'removeClass']('focused'));
    },
    
    setHovered: function(state) {
        [this._input, this._label].forEach(it()[!!state ? 'addClass' : 'removeClass']('hovered'));
    },
    
    setChecked: function(state) {
        if (!!state && this._group) this._group.check(this);
        this.checked = this._input.node.checked;
        [this._input, this._label].forEach(it()[this.checked ? 'addClass' : 'removeClass']('checked'));
    }
});
