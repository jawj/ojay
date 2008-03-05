Ojay.Forms(function() { with(this) {
    
    form('login')
        .requires('username').toHaveLength({minimum: 6})
        .requires('username_confirmation').toConfirm('username')
        .expects('email').toMatch(EMAIL_FORMAT)
        .requires('password')
        .requires('ts-and-cs', 'Terms and conditions').toBeChecked();
    
    when('login').isValidated(displayErrorsIn('#results'));
    
    form('search')
        .requires('q')
        .requires('lucky')
        .submitsUsingAjax();
        
    when('search').responseArrives(displayResponseIn('#searches'));
}});
