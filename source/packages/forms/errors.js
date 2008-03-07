/**
 * <p>The <tt>FormErrors</tt> class provides append-only access to error lists for the
 * purposes of validation. Validation routines cannot modify existing errors or remove
 * them from the list, so existing validation rules cannot be bypassed.</p>
 *
 * @contructor
 * @class FormErrors
 * @private
 */
var FormErrors = JS.Class({
    initialize: function(form) {
        var errors = {}, base = [];
        
        this.register = function(field) {
            errors[field] = errors[field] || [];
        };
        
        this.add = function(field, message) {
            this.register(field);
            errors[field].push(message);
        };
       
        this.addToBase = function(message) {
            base.push(message);
        };
       
        this._count = function() {
            var n = base.length;
            for (var field in errors) n += errors[field].length;
            return n;
        };
       
        this._messages = function() {
            var messages = base.slice(), name;
            for (var field in errors) {
                name = form._getName(field);
                errors[field].forEach(function(message) {
                    messages.push(name + ' ' + message);
                });
            }
            return messages;
        };
        
        this._fields = function() {
            var fields = [];
            for (var field in errors) fields.push(field);
            return fields;
        };
    }
});
