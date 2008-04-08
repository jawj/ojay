radios = new Ojay.Forms.RadioButtons('#buttons input[name=foo-radio]');
check = new Ojay.Forms.Checkbox('#buttons input[name=checky]');
selector = new Ojay.Forms.Select('#drop-down');

Ojay.Forms.reattach();

[radios, check, selector].forEach(it().on('change', function(input) {
    window.console && console.log(input.getValue());
}));

Ojay('#check-foo').on('click', function(el,ev) {
    ev.stopEvent();
    alert(YAHOO.util.Connect.setForm('buttons'));
});

disabled = false;
Ojay('#disabler').on('click', function(el,ev) {
    ev.stopEvent();
    disabled = !disabled;
    radios.getInput(1).setDisabled(disabled);
    check.setDisabled(disabled);
    selector.setDisabled(disabled);
});

// Attemp to exploit security hole by removing errors after validation
Ojay('#evil').on('click', function(el,ev) {
    ev.stopEvent();
    Ojay.Forms(function() { with(this) {
        
        var f = form('login'), a, b, k = [];
        for (a in f) {
            for (b in f[a]) {
                if (f[a][b].addToBase) k = [a,b];
        }   }
        
        form('login').validates(function(data, errors) {
            if (!k[0]) return;
            f[k[0]][k[1]] = new (f[k[0]][k[1]].klass);
        });
    }})
});

// Remove form from the document and replace to check rule re-attachment
Ojay.Forms.reattach = Ojay.Forms.reattach.traced('reattach()');
Ojay('#replace').on('click', function(el,ev) {
    ev.stopEvent();
    var wrapper = Ojay('#form-wrapper'), formHTML = wrapper.node.innerHTML;
    wrapper.setContent('');
    wrapper.setContent(formHTML);
    Ojay.Forms.getLabel('#email').setContent('Your email address');
    Ojay.Forms.reattach();
});
