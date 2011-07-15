JS.MethodChain.addMethods(Ojay);

(function() {
    var kernel = JS.Kernel;
    
    var convertSelectors = function() {
        var args = Array.from(arguments), _ = args.shift();
        if (typeof args[0] == 'string') return _(Ojay, args[0]);
        else return _.apply(this, args);
    };
    
    // Modify MethodChain to allow CSS selectors
    JS.MethodChain.prototype._ = JS.MethodChain.prototype._.wrap(convertSelectors);
    
    kernel.include({
        _: kernel._.wrap(convertSelectors)
    });
})();
