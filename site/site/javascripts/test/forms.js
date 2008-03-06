Ojay.Forms(function() { with(this) {
    
    form('login')
        .requires('username').toHaveLength({minimum: 6})
        .requires('username_confirmation').toConfirm('username')
        .expects('email').toMatch(EMAIL_FORMAT)
        .requires('password')
        .requires('ts-and-cs', 'Terms and conditions').toBeChecked();
    
    when('login').isValidated(displayErrorsIn('#results'));
    
    form('search')
        .submitsUsingAjax()
        .requires('q')
        .requires('lucky')
        .validates(function(data, errors) {
            if (/delete/i.test(data.q)) errors.push('Looks like SQL injection!');
        });
    
    when('search').isValidated(function(errors) {
        console && console.log(errors);
    });
    
    when('search').responseArrives(displayResponseIn('#searches'));
}});


// An attempt at replacing YAHOO.util.ButtonGroup with something that doesn't
// alter the form's HTML structure. Will go into the Forms library if successful
Ojay.Forms.ButtonGroup = JS.Class({
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

new Ojay.Forms.ButtonGroup('#buttons input[name=foo-radio]');
Ojay('#check-foo').on('click', function(el,ev) {
    ev.stopEvent();
    alert(YAHOO.util.Connect.setForm('buttons'));
});
