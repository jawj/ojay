YAHOO.util.Event.onDOMReady(function() {
    YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
        name: 'Core selector tests',
        
        setUp: function() {
            this.assert = YAHOO.util.Assert;
            this.arrayAssert = YAHOO.util.ArrayAssert;
            this.foo = Ojay.query('#content #foo')[0];
            this.bar = Ojay.query('#content #bar')[0];
            this.baz = Ojay.query('#content #baz')[0];
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
            this.arrayAssert.itemsAreEqual([this.bar, this.foo, this.baz], Ojay('#content #bar, #content p'));
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
});
