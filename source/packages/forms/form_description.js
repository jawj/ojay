/**
 * <p>The <tt>FormDescription</tt> class encapsulates sets of rules about how a form is to
 * behave. Each instance holds a set of requirements, which are tested against the form's
 * data each time the form is submitted in order to decide whether to submit it.</p>
 * @constructor
 * @class FormDescription
 * @private
 */
var FormDescription = JS.Class({
    include: JS.Observable,
    
    /**
     * @param {String} id
     */
    initialize: function(id) {
        this.form = Ojay.byId(id);
        if (!this.hasForm()) return;
        
        this.form.on('submit', this.method('handleSubmission'));
        
        this.requirements = {};
        this.dsl = new FormDSL(this);
        this.when = new WhenDSL(this);
    },
    
    /**
     * @returns {Boolean}
     */
    hasForm: function() {
        var node = this.form.node;
        return !!(node && node.tagName.toLowerCase() == 'form');
    },
    
    /**
     * @param {String} name
     * @returns {FormRequirement}
     */
    getRequirement: function(name) {
        return this.requirements[name] || (this.requirements[name] = new FormRequirement(this, name));
    },
    
    /**
     * @param {DomCollection} form
     * @param {Event} evnt
     */
    handleSubmission: function(form, evnt) {
        var valid = this.isValid();
        if (this.ajax || !valid) evnt.stopDefault();
        if (!this.ajax || !valid) return;
        var form = this.form.node;
        Ojay.HTTP[(form.method || 'POST').toUpperCase()](form.action,
                this.data, {onSuccess: this.handleAjaxResponse});
    },
    
    /**
     * @param {HTTP.Response} response
     */
    handleAjaxResponse: function(response) {},
    
    /**
     * @param {String} name
     * @return {DomCollection}
     */
    getInputs: function(name) {
        return this.form.descendants(['input', 'textarea', 'select'].map(function(tagName) {
            return tagName + '[name=' + name + ']';
        }).join(', '));
    },
    
    /**
     * @returns {Object} The data contained in the form. Requires YAHOO.util.Connect
     */
    getData: function() {
        var data = YAHOO.util.Connect.setForm(this.form.node).split('&').reduce(function(memo, pair) {
            var data = pair.split('=').map(decodeURIComponent);
            memo[data[0].trim()] = data[1].trim();
            return memo;
        }, {});
        YAHOO.util.Connect.resetFormState();
        return this.data = data;
    },
    
    /**
     *
     */
    validate: function() {
        var data = this.getData(), key, requirement, errors = [], result;
        for (key in this.requirements) {
            requirement = this.requirements[key];
            result = requirement.test(data[key]);
            if (result !== true) errors = errors.concat(result);
            requirement.setValid(result === true);
        }
        this.errors = errors;
        this.notifyObservers(this);
    },
    
    /**
     * @returns {Boolean}
     */
    isValid: function() {
        this.validate();
        return this.errors.length === 0;
    }
});
