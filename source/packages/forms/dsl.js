/**
 * A DSL for describing form requirements. EXPERIMENTAL. Expected usage:
 *
 *     Ojay.Forms(function() { with(this) {
 *  
 *         form('loginForm')
 *             .requires('username')
 *             .requires('password');
 *         
 *         form('addressForm')
 *             .requires('name')
 *             .requires('line1')
 *             .requires('city').toHaveLength({minimum: 3})
 *             .requires('email').toMatch(EMAIL_FORMAT);
 *         
 *         when('addressForm').isValidated(function(errors) {
 *             // Put errors somewhere
 *         });
 *     }});
 */

// Store to hold sets of form rules, entry per page form.
var forms = {};

/**
 * <p>Returns the <tt>FormDescription</tt> for the given <tt>id</tt>. A new description is
 * created if one does not already exist for the <tt>id</tt>.</p>
 * @param {String} id The HTML id of the form
 * @private
 */
var getForm = function(id) {
    return forms[id] || (forms[id] = new FormDescription(id));
};

/**
 * <p>This is the main DSL object for <tt>Ojay.Forms</tt>. It contains methods that should
 * act as top-level functions in the DSL. Do not put a method in here unless it needs to be
 * a top-level function.</p>
 * @private
 */
var DSL = {
    /**
     * <p>Returns a DSL object for describing the form with the given <tt>id</tt>.</p>
     * @param {String} id The id of the form you want to describe
     * @returns {FormDSL}
     */
    form: function(id) {
        return getForm(id)._dsl || null;
    },
    
    /**
     * <p>Returns a DSL object for describing the form with the given <tt>id</tt>.</p>
     * @param {String} id The id of the form you want to describe
     * @returns {WhenDSL}
     */
    when: function(id) {
        return getForm(id)._when || null;
    },
    
    /**
     * <p>Returns a helper function for use with <tt>when().isValidated()</tt>. The returned
     * function will display the forms elements as a bulleted list inside the element you
     * supply, in a <tt>DIV</tt> with the class name <tt>error-explanation</tt>.</p>
     * @param {String|HTMLElement|DomCollection} element
     * @returns {Function}
     */
    displayErrorsIn: function(element) {
        element = Ojay(element);
        return function(errors) {
            var n = errors.length;
            if (n == 0) return element.setContent('');
            var were = (n == 1) ? 'was' : 'were', s = (n == 1) ? '' : 's';
            element.setContent(Ojay.HTML.div({className: 'error-explanation'}, function(HTML) {
                HTML.p('There ' + were + ' ' + n + ' error' + s + ' with the form:');
                HTML.ul(function(HTML) { errors.forEach(HTML.method('li')); });
            }));
        };
    },
    
    /**
     * <p>Returns a helper function for use with <tt>when().responseArrives()</tt>. The returned
     * function will take the HTTP response body and display it in the specified element.</p>
     * @param {String|HTMLElement|DomCollection} element
     * @returns {Function}
     */
    displayResponseIn: function(element) {
        return it().insertInto(Ojay(element));
    },
    
    EMAIL_FORMAT: Ojay.EMAIL_FORMAT
};

/**
 * <p>The <tt>FormDSL</tt> class creates DSL objects used to describe forms. Every
 * <tt>FormDescription</tt> instance has one of these objects that provides DSL-level
 * access to the description.</p>
 * @constructor
 * @class FormDSL
 * @private
 */
var FormDSL = JS.Class({
    /**
     * @param {FormDescription} form
     */
    initialize: function(form) {
    this.extend({
        /**
         * <p>Returns a <tt>RequirementDSL</tt> object used to specify the requirement.</p>
         * @param {String} name
         * @param {String} displayed
         * @returns {RequirementDSL}
         */
        requires: function(name, displayed) {
            var requirement = form._getRequirement(name);
            if (displayed) form._names[name] = displayed;
            return requirement._dsl;
        },
        
        /**
         * <p>Adds a validator function to the form that allows the user to inspect the data
         * and add new errors.</p>
         * @param {Function} block
         * @returns {FormDSL}
         */
        validates: function(block) {
            form._validators.push(block);
            return this;
        },
        
        /**
         * @param {Object} options
         * @returns {FormDSL}
         */
        submitsUsingAjax: function(options) {
            form._ajax = true;
            return this;
        },
        
        /**
         * @returns {FormDSL}
         */
        highlightsActiveField: function() {
            form._highlightActiveField();
            return this;
        }
        
    }); this.extend({expects: this.requires});
    }
});

var FormDSLMethods = ['requires', 'expects', 'validates', 'submitsUsingAjax'];

/**
 * <p>The <tt>RequirementDSL</tt> class creates DSL objects used to describe form requirements.
 * All <tt>FormRequirement</tt> objects have one of these objects associated with them.</p>
 * @constructor
 * @class RequirementDSL
 * @private
 */
var RequirementDSL = JS.Class({
    /**
     * @param {FormRequirement} requirement
     */
    initialize: function(requirement) {
    this.extend({
        /**
         * <p>Specifies that the given checkbox field must be checked.</p>
         * @returns {RequirementDSL}
         */
        toBeChecked: function() {
            var element = requirement._elements.node;
            if (element.type.toLowerCase() != 'checkbox') throw new Error('Input "' + requirement._field + '" is not a checkbox');
            requirement._add(function(value) {
                return value == element.value || ['must be checked'];
            });
            return this;
        },
        
        /**
         * <p>Specifies that the required field must be a number in order to be considered valid.</p>
         * @returns {RequirementDSL}
         */
        toBeNumeric: function() {
            requirement._add(function(value) {
                return Ojay.isNumeric(value) || ['must be a number'];
            });
            return this;
        },
        
        /**
         * <p>Specifies that the required field must have one of the values in the given list in
         * order to be considered valid.</p>
         * @param {Array} list
         * @returns {RequirementDSL}
         */
        toBeOneOf: function(list) {
            requirement._add(function(value) {
                return list.indexOf(value) != -1 || ['is not valid'];
            });
            return this;
        },
        
        /**
         * <p>Specifies that the required field must confirm the value in another field.</p>
         * @param {String} field
         * @returns {RequirementDSL}
         */
        toConfirm: function(field) {
            requirement._add(function(value, data) {
                return value == data.get(field) || ['must be confirmed', field];
            });
            return this;
        },
        
        /**
         * <p>Specifies that the required field must have a certain length in order to be considered
         * valid. Valid inputs are a number (to specifiy an exact length), or an object with
         * <tt>minimum</tt> and <tt>maximum</tt> fields.</p>
         * @param {Number|Object} options
         * @returns {RequirementDSL}
         */
        toHaveLength: function(options) {
            var min = options.minimum, max = options.maximum;
            requirement._add(function(value) {
                return  (typeof options == 'number' && value.length != options &&
                            ['must contain exactly ' + options + ' characters']) ||
                        (min !== undefined && value.length < min &&
                            ['must contain at least ' + min + ' characters']) ||
                        (max !== undefined && value.length > max &&
                            ['must contain at most ' + max + ' characters']) ||
                        true;
            });
            return this;
        },
        
        /**
         * <p>Specifies that the required field must have a certain value in order to be considered
         * valid. Input should be an object with <tt>minimum</tt> and <tt>maximum</tt> fields.</p>
         * @param {Object} options
         * @returns {RequirementDSL}
         */
        toHaveValue: function(options) {
            var min = options.minimum, max = options.maximum;
            requirement._add(function(value) {
                if (!Ojay.isNumeric(value)) return 'must be a number';
                value = Number(value);
                return  (min !== undefined && value < min &&
                            ['must be at least ' + min]) ||
                        (max !== undefined && value > max &&
                            ['must be at most ' + max]) ||
                        true;
            });
            return this;
        },
        
        /**
         * <p>Specifies that the required field must match a given regex in order to be considered
         * valid.</p>
         * @param {Regexp} format
         * @returns {RequirementDSL}
         */
        toMatch: function(format) {
            requirement._add(function(value) {
                return format.test(value) || ['is not valid'];
            });
            return this;
        }
        
    }); FormDSLMethods.forEach(function(method) {
            this[method] = function() {
                var base = requirement._form._dsl;
                return base[method].apply(base, arguments);
            };
        }, this);
    }
});



/**
 * <p>The <tt>WhenDSL</tt> class creates DSL objects used to describe form requirements. All
 * <tt>FormRequirement</tt> objects have one of these objects associated with them. The WhenDSL
 * is used specifically to describe events linked to forms.</p>
 * @constructor
 * @class WhenDSL
 * @private
 */
var WhenDSL = JS.Class({
    /**
     * @param {FormDescription} form
     */
    initialize: function(form) {
    this.extend({
        /**
         * <p>Allows a hook to be registered to say what should be done with the list of error
         * messages when a particular form is validated.</p>
         * @param {Function} block
         * @param {Object} context
         */
        isValidated: function(block, context) {
            form.subscribe(function(form) {
                block.call(context || null, form._errors._messages());
            });
        },
        
        /**
         * @param {Function} block
         * @param {Object} context
         */
        responseArrives: function(block, context) {
            if (!form._ajax) return;
            block = Function.from(block);
            if (context) block = block.bind(context);
            form._handleAjaxResponse = block;
        }
    });
    }
});
