Ojay.Forms(function() { with(this) {
    
    form('login')
        .requires('username', 'Sign-in name').toHaveLength({minimum: 6})
        .requires('email').toMatch(EMAIL_FORMAT)
        .requires('password');
    
    when('login').isValidated(displayErrorsIn('#results'));
}});
