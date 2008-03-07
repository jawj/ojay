/**
 * <p>The <tt>FormErrors</tt> class provides append-only access to error lists for the
 * purposes of validation. Validation routines cannot modify existing errors or remove
 * them from the list, so existing validation rules cannot be bypassed.</p>
 * @contructor
 * @class FormErrors
 * @private
 */
var FormErrors = JS.Class({
    initialize: function(errors) {
        this.add = function(message) {
            errors.push(message);
        };
    }
});
