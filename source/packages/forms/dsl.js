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

var forms = {};

var getForm = function(id) {
    return forms[id] || (forms[id] = new FormDescription(id));
};

var DSL = {
    form: function(id) {
        return getForm(id).dsl || null;
    },
    
    when: function(id) {
        return getForm(id).when || null;
    },
    
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
    
    EMAIL_FORMAT: Ojay.Forms.EMAIL_FORMAT
};

var FormDSL = JS.Class({
    initialize: function(form) {
        this.form = form;
    },
    
    requires: function(name, displayed) {
        var requirement = this.form.getRequirement(name);
        requirement.name = displayed;
        return requirement.dsl;
    }
});

var RequirementDSL = JS.Class({
    initialize: function(requirement) {
        this.requirement = requirement;
    },
    
    toHaveLength: function(options) {
        var min = options.minimum, max = options.maximum;
        this.requirement.add(function(value) {
            if (typeof options == 'number' && value.length != options)
                    return 'must contain exactly ' + options + ' characters';
            if (min !== undefined && value.length < min)
                    return 'must contain at least ' + min + ' characters';
            if (max !== undefined && value.length > max)
                    return 'must contain at most ' + max + ' characters';
            return true;
        });
        return this;
    },
    
    toHaveValue: function(options) {
        var min = options.minimum, max = options.maximum;
        this.requirement.add(function(value) {
            if (!Ojay.Forms.isNumeric(value)) return 'must be a number';
            value = Number(value);
            if (min !== undefined && value < min)
                    return 'must be at least ' + min;
            if (max !== undefined && value > max)
                    return 'must be at most ' + max;
            return true;
        });
        return this;
    },
    
    toMatch: function(format) {
        this.requirement.add(function(value) {
            return format.test(value) || 'is not valid';
        });
        return this;
    },
    
    toBeNumeric: function() {
        this.requirement.add(function(value) {
            return Ojay.Forms.isNumeric(value) || 'is not a number';
        });
        return this;
    },
    
    requires: function(name) {
        return this.requirement.form.dsl.requires(name);
    }
});

var WhenDSL = JS.Class({
    initialize: function(form) {
        this.form = form;
    },
    
    isValidated: function(block, context) {
        this.form.subscribe(function(form) {
            block.call(context || null, form.errors);
        });
    }
});

var FormDescription = JS.Class({
    include: JS.Observable,
    
    initialize: function(id) {
        this.form = Ojay.byId(id);
        if (!this.hasForm()) return;
        
        this.form.on('submit', this.method('handleSubmission'));
        
        this.requirements = {};
        this.dsl = new FormDSL(this);
        this.when = new WhenDSL(this);
    },
    
    hasForm: function() {
        var node = this.form.node;
        return !!(node && node.tagName.toLowerCase() == 'form');
    },
    
    getRequirement: function(name) {
        return this.requirements[name] || (this.requirements[name] = new FormRequirement(this, name));
    },
    
    handleSubmission: function(form, evnt) {
        if (!this.isValid()) evnt.stopDefault();
    },
    
    getData: function() {
        var data = YAHOO.util.Connect.setForm(this.form.node).split('&').reduce(function(memo, pair) {
            var data = pair.split('=').map(decodeURIComponent);
            memo[data[0].trim()] = data[1].trim();
            return memo;
        }, {});
        YAHOO.util.Connect.resetFormState();
        return data;
    },
    
    validate: function() {
        var data = this.getData(), key, requirement, errors = [], result;
        for (key in data) {
            requirement = this.requirements[key];
            if (!requirement) continue;
            result = requirement.test(data[key]);
            if (result !== true) errors = errors.concat(result);
            requirement.setValid(result === true);
        }
        this.errors = errors;
        this.notifyObservers(this);
    },
    
    isValid: function() {
        this.validate();
        return this.errors.length === 0;
    }
});

var isPresent = function(value) {
    return Ojay.Forms.isPresent(value) || 'is required';
};

var FormRequirement = JS.Class({
    initialize: function(form, field) {
        this.form = form;
        this.field = field;
        this.tests = [];
        this.dsl = new RequirementDSL(this);
        
        this.elements = this.form.form.descendants(['input', 'textarea', 'select'].map(function(tagName) {
            return tagName + '[name=' + field + ']';
        }).join(', '));
        
        var id;
        this.label = (id = (this.elements.node || {}).id)
                ? Ojay('label').filter(function(l) { return l.node.htmlFor == id; })
                : null;
    },
    
    getName: function() {
        var name = this.name || (this.label ? this.label.node.innerHTML.stripTags() : this.field);
        return name.charAt(0).toUpperCase() + name.substring(1);
    },
    
    add: function(block) {
        this.tests.push(block);
    },
    
    test: function(value) {
        var errors = [], tests = this.tests.length ? this.tests : [isPresent];
        tests.forEach(function(block) {
            var result = block(value);
            if (result !== true) errors.push(this.getName() + ' ' + result);
        }, this);
        return errors.length ? errors : true;
    }.traced('test()'),
    
    setValid: function(valid) {
        this.elements[valid === true ? 'removeClass' : 'addClass']('invalid');
    }
});
