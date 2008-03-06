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
