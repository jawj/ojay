Ojay.Validation(function() { with(this) {
    
    form('login')
        .requires('username').toHaveLength({minimum: 6})
        .requires('password');
}});
