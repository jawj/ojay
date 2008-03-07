var isPresent = function(value) {
    return !Ojay.isBlank(value) || ['is required'];
};

/**
 * <p>The <tt>FormRequirement</tt> class encapsulates a set of tests against the value of a single
 * form field. The tests are defined externally and added using the <tt>_add()</tt> method. Each
 * test should be a function that takes a value and decides whether or not it is valid. The
 * <tt>FormRequirement</tt> instance can be used to run all the tests against a field.</p>
 * @constructor
 * @class FormRequirement
 * @private
 */
var FormRequirement = JS.Class({
    /**
     * @param {FormDescription} form
     * @param {String} field
     */
    initialize: function(form, field) {
        this._form = form;
        this._field = field;
        this._tests = [];
        this._dsl = new RequirementDSL(this);
        
        this._elements = this._form._getInputs(field);
        this._label = this._form._getLabel(field);
    },
    
    /**
     * @param {Function} block
     */
    _add: function(block) {
        this._tests.push(block);
    },
    
    /**
     * @param {String} value
     * @returns {Array|Boolean}
     */
    _test: function(value, data, errors) {
        var errors = [], tests = this._tests.length ? this._tests : [isPresent], value = value || '';
        tests.forEach(function(block) {
            var result = block(value, data), message, field;
            if (result !== true) {
                message = result[0]; field = result[1] || this._field;
                errors.push(this._form._getName(field) + ' ' + message);
            }
        }, this);
        return errors.length ? errors : true;
    }.traced('test()'),
    
    /**
     * @param {Boolean} valid
     */
    _setValid: function(valid) {
        var method = (valid === true) ? 'removeClass' : 'addClass';
        [this._elements, this._label].forEach(it()[method]('invalid'));
    }
});
