/**
 * <p>The <tt>FormData</tt> class provides read-only access to data objects for the
 * purposes of validation. Validation routines cannot modify form data through this
 * class.</p>
 * @contructor
 * @class FormData
 * @private
 */
var FormData = JS.Class({
    initialize: function(data) {
        this.get = function(field) {
            return data[field] === undefined ? null : data[field];
        };
    }
});
