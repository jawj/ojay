Ojay.Validation(function() { with(this) {
    
    form('login')
        .requires('username').toHaveLength({between: [3,12]})
        .requires('password').toMatch(/foo/);
}});
