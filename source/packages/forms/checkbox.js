Ojay.Forms.Checkbox = JS.Class({
    include: ButtonStates,
    
    initialize: function(input) {
        this._input = Ojay(input);
        this._label = Ojay.Forms.getLabel(this._input);
        this.setupButton();
    }
});
