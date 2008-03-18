Ojay.Forms(function() { with(this) {
    
    form('login')
        .highlightsActiveField()
        .requires('username').toHaveLength({minimum: 6})
        .requires('username_confirmation').toConfirm('username')
        .expects('email').toMatch(EMAIL_FORMAT)
        .expects('age').toBeNumeric()
        .requires('password')
        .requires('ts-and-cs', 'Terms and conditions').toBeChecked();
    
    when('login').isValidated(displayErrorsIn('#results'));
    
    form('search')
        .submitsUsingAjax()
        .requires('q')
        .requires('lucky')
        .validates(function(data, errors) {
            if ( /delete/i.test(data.get('q')) ) errors.add('q', 'Looks like SQL injection!');
        });
    
    when('search').isValidated(function(errors) {
        window.console && console.log(errors);
    });
    
    when('search').responseArrives(displayResponseIn('#searches'));
}});

radios = new Ojay.Forms.RadioButtons('#buttons input[name=foo-radio]');
check = new Ojay.Forms.Checkbox('#buttons input[name=checky]');
selector = new Ojay.Forms.Select('#drop-down');

Ojay('#check-foo').on('click', function(el,ev) {
    ev.stopEvent();
    alert(YAHOO.util.Connect.setForm('buttons'));
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
