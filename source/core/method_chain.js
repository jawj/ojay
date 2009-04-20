JS.MethodChain.addMethods(Ojay);

// Modify MethodChain to allow CSS selectors
JS.MethodChain.prototype._ = JS.MethodChain.prototype._.wrap(function() {
    var args = Array.from(arguments), _ = args.shift();
    if (typeof args[0] == 'string') return _(Ojay, args[0]);
    else return _.apply(this, args);
});

(function(kernel) {
    kernel.include({
        _: kernel.instanceMethod('_').wrap(function() {
            var args = Array.from(arguments), _ = args.shift();
            if (typeof args[0] == 'string') return _(Ojay, args[0]);
            else return _.apply(this, args);
        })
    });
// ObjectMethods will be renamed to Kernel in JS.Class 2.1
})(JS.ObjectMethods || JS.Kernel);

