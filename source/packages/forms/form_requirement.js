var isPresent = function(value) {
    return !Ojay.isBlank(value) || 'is required';
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
        
        this.label = this.elements.ancestors('label');
        if (this.label.node) return;
        var id = (this.elements.node || {}).id;
        var labels = [].filter.call(document.getElementsByTagName('label'), function(label) { return id && label.htmlFor == id; });
        this.label = labels.length ? new Ojay.DomCollection(labels) : null;
    },
    
    /**
     * @returns {String}
     */
    getName: function() {
        var name = this.name || (this.label ? this.label.node.innerHTML.stripTags() : this.field);
        return name.charAt(0).toUpperCase() + name.substring(1);
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
    test: function(value) {
        var errors = [], tests = this.tests.length ? this.tests : [isPresent], value = value || '';
        tests.forEach(function(block) {
            var result = block(value);
            if (result !== true) errors.push(this.getName() + ' ' + result);
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
