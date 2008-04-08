/**
 * <p>The <tt>FormDescription</tt> class encapsulates sets of rules about how a form is to
 * behave. Each instance holds a set of requirements, which are tested against the form's
 * data each time the form is submitted in order to decide whether to allow submission to
 * the server.</p>
 * @constructor
 * @class FormDescription
 * @private
 */
var FormDescription = JS.Class(/** @scope FormDescription.prototype */{
    include: JS.Observable,
    
    /**
     * @param {String} id
     */
    initialize: function(id) {
        this._formID = id;
        this._attach();
        if (!this._hasForm()) return;
        
        this._requirements = {};
        this._validators = [];
        this._dsl = new FormDSL(this);
        this._when = new WhenDSL(this);
        
        this._inputs = {};
        this._labels = {};
        this._names = {};
    },
    
    /**
     * <p>Finds the form element in the document and hijacks its submit event.</p>
     */
    _attach: function() {
        if (this._form && this._form.matches('body *')) return;
        this._form = Ojay.byId(this._formID);
        if (!this._hasForm()) return;
        this._form.on('submit', this.method('_handleSubmission'));
    },
    
    /**
     * <p>Returns <tt>true</tt> iff the description object has an associated <tt>form</tt>
     * element in the current document.</p>
     * @returns {Boolean}
     */
    _hasForm: function() {
        var node = this._form.node;
        return !!(node && node.tagName.toLowerCase() == 'form');
    },
    
    /**
     * <p>Returns the <tt>FormRequirement</tt> object for the named field. If no existing
     * requirement object is found for the field, a new one is created for it.</p>
     * @param {String} name
     * @returns {FormRequirement}
     */
    _getRequirement: function(name) {
        return this._requirements[name] || (this._requirements[name] = new FormRequirement(this, name));
    },
    
    /**
     * <p>Processing form submission events by validating the form and stopping the event
     * from proceeding if the form is invalid in any way.</p>
     * @param {DomCollection} form
     * @param {Event} evnt
     */
    _handleSubmission: function(form, evnt) {
        var valid = this._isValid();
        if (this._ajax || !valid) evnt.stopDefault();
        if (!this._ajax || !valid) return;
        var form = this._form.node;
        Ojay.HTTP[(form.method || 'POST').toUpperCase()](form.action,
                this._data, {onSuccess: this._handleAjaxResponse});
    },
    
    /**
     * <p>Placeholder method for handling Ajax response from the server. The DSL overwrites
     * this method if the developer specifies their own response handler.</p>
     * @param {HTTP.Response} response
     */
    _handleAjaxResponse: function(response) {},
    
    /**
     * <p>Returns an Ojay collection representing all the inputs in the form with the given
     * <tt>name</tt>.</p>
     * @param {String} name
     * @return {DomCollection}
     */
    _getInputs: function(name) {
        return this._inputs[name] || ( this._inputs[name] = this._form.descendants(['input', 'textarea', 'select'].map(function(tagName) {
            return tagName + (name ? '[name=' + name + ']' : '');
        }).join(', ')) );
    },
    
    /**
     * <p>Returns an Ojay collection for the <tt>label</tt> tag for a specified <tt>name</tt>
     * or element referece.</p>
     * @param {String|HTMLElement|DomCollection} name
     * @returns {DomCollection}
     */
    _getLabel: function(name) {
        if (name.node) name = name.node;
        if (name.name) name = name.name;
        return this._labels[name] || ( this._labels[name] = Ojay.Forms.getLabel(this._getInputs(name)) );
    },
    
    /**
     * <p>Returns a human-readable name for the given field. The the developer has not specified
     * a name, it is inferred from the field's label, or from the field's name itself if no label
     * is found.</p>
     * @param {String} name
     * @returns {String}
     */
    _getName: function(field) {
        if (this._names[field]) return this._names[field];
        var label = this._getLabel(field);
        var name = ((label.node || {}).innerHTML || field).stripTags();
        
        name = name.replace(/(\w)[_-](\w)/g, '$1 $2')
                .replace(/([a-z])([A-Z])/g, function(match, a, b) {
                    return a + ' ' + b.toLowerCase();
                });
        
        return this._names[field] = name.charAt(0).toUpperCase() + name.substring(1);
    },
    
    /**
     * <p>Returns the data in the form using <tt>YAHOO.util.Connect</tt>.</p>
     * @returns {Object}
     */
    _getData: function() {
        return this._data = Ojay.Forms.getData(this._form);
    },
    
    /**
     * <p>Validates the form by applying the set of requirements to the form's current data and
     * building up a collection of errors, and notifies any observers that validation has taken
     * place.</p>
     */
    _validate: function() {
        this._errors = new FormErrors(this);
        var data = new FormData(this._getData()), key;
        
        for (key in this._requirements)
            this._requirements[key]._test(data.get(key), data);
        
        this._validators.forEach(function(validate) { validate(data, this._errors); }, this);
        
        var fields = this._errors._fields();
        for (key in this._inputs)
            [this._getInputs(key), this._getLabel(key)].forEach(
                it()[fields.indexOf(key) == -1 ? 'removeClass' : 'addClass']('invalid'));
        
        this.notifyObservers(this);
    },
    
    /**
     * <p>Returns <tt>true</tt> iff the form's current data is valid according to the set
     * of stored requirements.</p>
     * @returns {Boolean}
     */
    _isValid: function() {
        this._validate();
        return this._errors._count() === 0;
    },
    
    /**
     * <p>Causes the form's inputs and labels to add/remove the class name 'focused' in response
     * to user interaction, to allow you to highlight the active field with CSS.</p>
     */
    _highlightActiveField: function() {
        this._getInputs('').forEach(function(input) {
            input.on('focus').addClass('focused')._(this)._getLabel(input).addClass('focused');
            input.on('blur').removeClass('focused')._(this)._getLabel(input).removeClass('focused');
        }, this);
    }
});
