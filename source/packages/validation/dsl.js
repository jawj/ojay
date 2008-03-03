/**
 * A DSL for describing form requirements. EXPERIMENTAL. Expected usage:
 *
 *     Ojay.Validation(function() { with(this) {
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
 *         when('addressForm').isInvalid(function(errors) {
 *             // Put errors somewhere
 *         });
 *     }});
 */

forms = {};

var getForm = function(id) {
    return forms[id] || (forms[id] = new FormDescription(id));
};

var DSL = {
    form: function(id) {
        return getForm(id).dsl || null;
    },
    
    when: function(id) {
        return getForm(id).when || null;
    }
};

var FormDSL = JS.Class({
    initialize: function(form) {
        this.form = form;
    },
    
    requires: function(name) {
        var requirements = this.form.requirements;
        return requirements[name] || (requirements[name] = new FormRequirement(this.form, name));
    }
});

var WhenDSL = JS.Class({
    initialize: function(form) {
        this.form = form;
    },
    
    isInvalid: function(block, context) {
        // TODO
    }
});

var FormDescription = JS.Class({
    initialize: function(id) {
        this.form = Ojay.byId(id);
        if (!this.hasForm()) return;
        
        this.form.on('submit', this.method('handleSubmission'));
        
        this.dsl = new FormDSL(this);
        this.when = new WhenDSL(this);
        this.requirements = {};
    },
    
    hasForm: function() {
        var node = this.form.node;
        return !!(node && node.tagName.toLowerCase() == 'form');
    },
    
    handleSubmission: function(form, evnt) {
        // TODO
    }
});

var FormRequirement = JS.Class({
    initialize: function(form, field) {
        this.form = form;
        this.field = field;
    },
    
    toHaveLength: function(options) {
        // TODO
        return this;
    },
    
    toMatch: function(format) {
        // TODO
        return this;
    },
    
    requires: function(name) {
        return this.form.dsl.requires(name);
    }
});
