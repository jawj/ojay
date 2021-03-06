/**
 * <p>Returns an object that wraps a collection of DOM element references by parsing
 * the given query using a CSS selector engine.</p>
 *
 * <p>Aliased as <tt>$()</tt>.</p>
 *
 * @params {String|Array} query
 * @returns {DomCollection}
 */
var Ojay = function() {
    var elements = [], arg, i, n;
    for (i = 0, n = arguments.length; i < n; i++) {
        arg = arguments[i];
        if (typeof arg == 'string') arg = Ojay.cssEngine.query(arg);
        if (arg.toArray) arg = arg.toArray();
        if (!(arg instanceof Array)) arg = [arg];
        elements = elements.concat(arg);
    }
    return new Ojay.DomCollection(elements.unique());
};

Ojay.VERSION = '<%= version %>';

Array.from = JS.array;

Function.prototype.bind = function() {
    return JS.bind.apply(JS, [this].concat(JS.array(arguments)));
};

