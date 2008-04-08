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
