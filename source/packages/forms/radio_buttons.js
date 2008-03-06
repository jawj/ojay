Ojay.Forms.RadioButtons = JS.Class({
    initialize: function(inputs) {
        this._items = Ojay(inputs).map(function(input) { return new this.klass.Item(this, input); }, this);
        this._checkedItem = this._items.filter('checked')[0] || null;
    },
    
    check: function(item) {
        if (this._checkedItem) this._checkedItem.setChecked(false);
        this._checkedItem = item;
    },
    
    extend: {
        Item: JS.Class({
            include: ButtonStates,
            
            initialize: function(group, input) {
                this._group = group;
                this._input = input;
                this._label = Ojay.Forms.getLabel(input);
                this.setupButton();
            }
        })
    }
});
