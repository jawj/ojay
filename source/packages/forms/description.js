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
        this._form = Ojay.byId(id);
        if (!this._hasForm()) return;
        
        this._form.on('submit', this.method('_handleSubmission'));
        
        this._requirements = {};
        this._validators = [];
        this._dsl = new FormDSL(this);
        this._when = new WhenDSL(this);
        
        this._inputs = {};
        this._labels = {};
        this._names = {};
    },
    
    /**
     * @returns {Boolean}
     */
    _hasForm: function() {
        var node = this._form.node;
        return !!(node && node.tagName.toLowerCase() == 'form');
    },
    
    /**
     * @param {String} name
     * @returns {FormRequirement}
     */
    _getRequirement: function(name) {
        return this._requirements[name] || (this._requirements[name] = new FormRequirement(this, name));
    },
    
    /**
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
     * @param {HTTP.Response} response
     */
    _handleAjaxResponse: function(response) {},
    
    /**
     * @param {String} name
     * @return {DomCollection}
     */
    _getInputs: function(name) {
        return this._inputs[name] || ( this._inputs[name] = this._form.descendants(['input', 'textarea', 'select'].map(function(tagName) {
            return tagName + (name ? '[name=' + name + ']' : '');
        }).join(', ')) );
    },
    
    /**
     * @param {String} name
     * @returns {DomCollection}
     */
    _getLabel: function(name) {
        if ((name.node || {}).name) name = name.node.name;
        return this._labels[name] || ( this._labels[name] = Ojay.Forms.getLabel(this._getInputs(name)) );
    },
    
    /**
     * @param {String} name
     * @returns {String}
     */
    _getName: function(field) {
        if (this._names[field]) return this._names[field];
        var label = this._getLabel(field);
        var name = ((label.node || {}).innerHTML || field).stripTags();
        return this._names[field] = name.charAt(0).toUpperCase() + name.substring(1);
    },
    
    /**
     * @returns {Object} The data contained in the form. Requires YAHOO.util.Connect
     */
    _getData: function() {
        var data = YAHOO.util.Connect.setForm(this._form.node).split('&').reduce(function(memo, pair) {
            var data = pair.split('=').map(decodeURIComponent);
            memo[data[0].trim()] = data[1].trim();
            return memo;
        }, {});
        YAHOO.util.Connect.resetFormState();
        return this._data = data;
    },
    
    /**
     *
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
     * @returns {Boolean}
     */
    _isValid: function() {
        this._validate();
        return this._errors._count() === 0;
    },
    
    /**
     *
     */
    _highlightActiveField: function() {
        this._getInputs('').forEach(function(input) {
            input.on('focus').addClass('focused')._(this)._getLabel(input).addClass('focused');
            input.on('blur').removeClass('focused')._(this)._getLabel(input).removeClass('focused');
        }, this);
    }
});
