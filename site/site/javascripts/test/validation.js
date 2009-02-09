Ojay.Forms(function() { with(this) {
    
    form('buttons').expects('checky').toBeChecked();
    before('buttons').isValidated(function(data) {
        data.selectoptions = (Number(data.selectoptions) || 0) + 1;
    });
    
    form('login')
        .highlightsActiveField()
        .requires('username').toHaveLength({minimum: 6})
        .requires('username_confirmation').toConfirm('username')
        .requires('notshown').toHaveLength(2)
        .expects('email').toMatch(EMAIL_FORMAT)
        .expects('age').toBeNumeric()
        .requires('password')
        .requires('ts-and-cs', 'Terms and conditions').toBeChecked();
    
    before('login').isValidated(function(data) {
        data.username = data.username.toUpperCase();
        data.age = Number(data.age) * 8;
    });
    
    when('login').isValidated(displayErrorsIn('#results'));
    
    form('search')
        .submitsUsingAjax()
        .requires('q')
        .requires('lucky')
        .validates(function(data, errors) {
            if ( /delete/i.test(data.get('q')) ) errors.add('q', 'Looks like SQL injection!');
        });
    
    before('search').isValidated(function(data) {
        data.lucky = Number(data.lucky) ? '0' : '1';
    });
    
    when('search').isValidated(function(errors) {
        window.console && console.log(errors);
    });
    
    when('search').responseArrives(displayResponseIn('#searches'));
    
    when('search').responseArrives(function(response) {
        alert(response.responseText);
    });
}});
