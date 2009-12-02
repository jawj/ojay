YAHOO.util.Event.onDOMReady(function() {
    YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
        name: 'Core selector tests',
        
        setUp: function() {
            this.assert = YAHOO.util.Assert;
            this.arrayAssert = YAHOO.util.ArrayAssert;
            this.foo = YAHOO.util.Selector.query('#content #foo')[0];
            this.bar = YAHOO.util.Selector.query('#content #bar')[0];
            this.baz = YAHOO.util.Selector.query('#content #baz')[0];
        },
        
        testReturnsDomCollection: function() {
            this.assert.isTrue(Ojay('*') instanceof Ojay.DomCollection);
        },
        
        testSelectionUsingStrings: function() {
            this.arrayAssert.itemsAreEqual([this.foo], Ojay('#foo'));
            this.arrayAssert.itemsAreEqual([this.foo, this.bar], Ojay('#content #foo, #content #bar'));
            this.arrayAssert.itemsAreEqual([this.baz, this.bar], Ojay('#content #baz', '#content #bar'));
        },
        
        testNoDuplicates: function() {
            this.arrayAssert.itemsAreEqual([this.foo, this.bar, this.baz], Ojay('#content p, #content #bar'));
            this.arrayAssert.itemsAreEqual([this.bar, this.baz], Ojay('#content #bar', '#content .notfirst'));
        },
        
        testWrappingHtmlNodes: function() {
            var collection = Ojay(this.foo);
            this.assert.isTrue(collection instanceof Ojay.DomCollection);
            this.arrayAssert.itemsAreEqual([this.foo], collection);
            collection = Ojay(this.foo, this.baz);
            this.arrayAssert.itemsAreEqual([this.foo, this.baz], collection);
            collection = Ojay(this.foo, [this.baz, document.body]);
            this.assert.areEqual(3, collection.length);
            this.arrayAssert.itemsAreEqual([this.foo, this.baz, document.body], collection);
        },
        
        testWrappingDomCollection: function() {
            var body = Ojay(Ojay(Ojay('body'), 'body'), document.body);
            this.assert.isTrue(body instanceof Ojay.DomCollection);
            this.assert.areEqual(1, body.length);
            this.arrayAssert.itemsAreEqual([document.body], body);
        },
        
        testThrowOutNonHtmlStuff: function() {
            var collection = new Ojay.DomCollection(['something', this.foo, document.body, 12]);
            this.assert.areEqual(2, collection.length);
            this.arrayAssert.itemsAreEqual([this.foo, document.body], collection);
        },
        
        testById: function() {
            this.assert.areEqual(1, Ojay.byId('content').length);
            this.assert.areEqual(0, Ojay.byId('does-not-exist').length);
        },
        
        testDocument: function() {
            this.assert.areEqual(1, Ojay(document).length);
        },
        
        testBooleanAttributeSetting: function() {
            var checkbox = Ojay('form input[type=checkbox]');
            checkbox.set({disabled: true});
            this.assert.isTrue(checkbox.node.disabled);
            checkbox.set({disabled: false});
            this.assert.isFalse(checkbox.node.disabled);
            checkbox.set({checked: true});
            this.assert.isTrue(checkbox.node.checked);
            checkbox.set({checked: false});
            this.assert.isFalse(checkbox.node.checked);
        },
        
        testClassNameAttributeSetting: function() {
            var quux = Ojay('#quux');
            quux.set({className: 'orange'});
            this.assert.areEqual('orange', quux.node.className);
        },
        
        testHtmlForAttributeSetting: function() {
            var eeks = Ojay('input#eeks'), egreck = Ojay('label#egreck');
            egreck.set({htmlFor: 'eeks'});
            this.assert.areEqual('eeks', egreck.node.htmlFor);
            this.assert.areEqual(eeks.node.name, egreck.node.htmlFor);
        },
        
        testChangingAlias: function() {
            Ojay.changeAlias('_');
            this.assert.areEqual(Ojay, _);
            Ojay.changeAlias('__');
            this.assert.areEqual(Ojay, __);
        }
    }));
    
    var logger = new YAHOO.tool.TestLogger();
    YAHOO.tool.TestRunner.run();
    
    Ojay('body').on('click', Ojay.delegateEvent({
        '.delegator': function(el) {
            alert(el.node.tagName);
        }
    }));
    
    Ojay('body').on('click', Ojay.delegateEvent({
        '.delegator-fixed': function(el) {
            alert(el.node.tagName);
        }
    }, true));
    
    Ojay('.red').setStyle({color: 'red'})._('.green').setStyle({color: 'green'});
    
    Ojay('#custom1 span').on('click').trigger('custom:event');
    Ojay('#custom2 span').on('click').trigger('custom:event', {house: 97});
    Ojay('#custom3 span').on('click').trigger('custom:event', {}, false);
    Ojay('#custom4 span').on('click').trigger('custom:event', {house: 13}, false);
    
    Ojay('.custom-event-trigger').on('custom:event', function(source, evnt) {
        var str = source.node.tagName;
        str += ' ' + evnt.getTarget().node.tagName;
        if (evnt.house) str += ' ' + evnt.house;
        alert(str);
    });
    
    Ojay('body').on('custom:event', Ojay.delegateEvent({
        'span': function(target, evnt) {
            alert('Custom event caught by BODY ' + (evnt.house || ''));
        }
    }));
    
    Ojay('body').on('never:happens', function() { alert('You should not be seeing this') });
});
