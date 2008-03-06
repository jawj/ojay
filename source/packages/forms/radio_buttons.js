Ojay.Forms.RadioButtons = JS.Class({
    initialize: function(inputs) {
        this._items = Ojay(inputs).map(function(input) { return new this.klass.Item(this, input); }, this);
        this._checkedItem = this._items.filter('checked')[0] || null;
    },
    
    check: function(item) {
        if (this._checkedItem) this._checkedItem.setChecked(false);
        this._checkedItem = item;
        item.setChecked(true);
    },
    
    extend: {
        Item: JS.Class({
            initialize: function(group, input) {
                this._group = group;
                this._input = input;
                this._label = Ojay.Forms.getLabel(input);
                this.setChecked(input.node.checked);
                
                input.setStyle({opacity: 0, position: 'absolute', left: '-100px', top: '-100px'});
                input.on('click')._(group).check(this);
                input.on('focus')._(this).setFocused(true);
                input.on('blur')._(this).setFocused(false);
                
                if (!this._label) return;
                this._label.on('mouseover')._(this).setHovered(true);
                this._label.on('mouseout')._(this).setHovered(false);
            },
            
            setFocused: function(state) {
                if (this._input.node.checked) this._group.check(this);
                [this._input, this._label].forEach(function(element) {
                        element[!!state ? 'addClass' : 'removeClass']('focused'); });
            },
            
            setHovered: function(state) {
                [this._input, this._label].forEach(function(element) {
                        element[!!state ? 'addClass' : 'removeClass']('hovered'); });
            },
            
            setChecked: function(state) {
                this.checked = !!state;
                [this._input, this._label].forEach(function(element) {
                        element[!!state ? 'addClass' : 'removeClass']('checked'); });
            }
        })
    }
});
