var isPresent = function(value) {
    return !Ojay.isBlank(value) || ['is required'];
};

/**
 * <p>The <tt>FormRequirement</tt> class encapsulates a set of tests against the value of a single
 * form field. The tests are defined externally and added using the <tt>add()</tt> method. Each
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
        this.form = form;
        this.field = field;
        this.tests = [];
        this.dsl = new RequirementDSL(this);
        
        this.elements = this.form.getInputs(field);
        this.label = this.form.getLabel(field);
    },
    
    /**
     * @param {Function} block
     */
    add: function(block) {
        this.tests.push(block);
    },
    
    /**
     * @param {String} value
     * @returns {Array|Boolean}
     */
    test: function(value, data, errors) {
        var errors = [], tests = this.tests.length ? this.tests : [isPresent], value = value || '';
        tests.forEach(function(block) {
            var result = block(value, data), message, field;
            if (result !== true) {
                message = result[0]; field = result[1] || this.field;
                errors.push(this.form.getName(field) + ' ' + message);
            }
        }, this);
        return errors.length ? errors : true;
    }.traced('test()'),
    
    /**
     * @param {Boolean} valid
     */
    setValid: function(valid) {
        var method = (valid === true) ? 'removeClass' : 'addClass';
        [this.elements, this.label].forEach(it()[method]('invalid'));
    }
});
