Ojay.Forms(function() { with(this) {
    
    form('login')
        .requires('username', 'Sign-in name').toHaveLength({minimum: 6})
        .requires('username_confirmation').toConfirm('username')
        .requires('email').toMatch(EMAIL_FORMAT)
        .requires('password')
        .requires('ts-and-cs').toBeChecked();
    
    when('login').isValidated(displayErrorsIn('#results'));
    
    form('search')
        .requires('q')
        .requires('lucky')
        .submitsUsingAjax();
        
    when('search').responseArrives(displayResponseIn('#searches'));
}});
