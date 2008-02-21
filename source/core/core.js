/**
 * <p>Returns an object that wraps a collection of DOM element references by parsing
 * the given query using a CSS selector engine.</p>
 * <p>Aliased as <tt>_()</tt>.</p>
 * @params {String|Array} query A CSS or XPath selector string, or an array of HTMLElements
 * @returns {DomCollection} A collection of DOM nodes matching the query string
 */
var Ojay = function() {
    var elements = [], arg, i, n;
    for (i = 0, n = arguments.length; i < n; i++) {
        arg = arguments[i];
        if (typeof arg == 'string') arg = Ojay.query(arg);
        if (arg.toArray) arg = arg.toArray();
        if (!(arg instanceof Array)) arg = [arg];
        elements = elements.concat(arg);
    }
    return new Ojay.DomCollection(elements.unique());
};
