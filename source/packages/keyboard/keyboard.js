/**
 *
 */
var Keyboard = Ojay.Keyboard = JS.Singleton({
    
    /**
     * @param {HTMLElement|String} node
     * @param {String} keys
     * @param {Function} callback
     * @param {Object} scope
     * @returns {Rule}
     */
    listen: function(node, keys, callback, scope) {
        var rule = new Rule(node, keys, callback, scope);
        rule.enable();
        return rule;
    },
    
    /**
     * @param {String} keys
     * @returns {Boolean}
     */
    isPressed: function(keys) {
        return codesFromKeys(keys).every(Monitor.method('_isPressed'));
    }
});
