YAHOO.util.Event.onDOMReady(function() {
    YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
        name: 'DOM traversal tests',
        
        setUp: function() {
            this.assert = YAHOO.util.Assert;
            this.arrayAssert = YAHOO.util.ArrayAssert;
        },
        
        testParents: function() {
            this.arrayAssert.itemsAreSame([document.body], Ojay('#content').parents());
            this.arrayAssert.itemsAreSame([document.body], Ojay('#content #foo, #content #bar').parents().parents());
            this.arrayAssert.itemsAreSame(Ojay('#content #bar div.contains-blockquote'), Ojay('#content blockquote').parents());
        },
        
        testAncestors: function() {
            var actual = Ojay('#content blockquote, #content a#om_link').ancestors();
            var expected = Ojay('#content .contains-blockquote', '#content #bar', '#content', 'body', '#content #fizzbuzz', '#content div.wizzbang', '#content #baz');
            this.arrayAssert.itemsAreEqual(expected, actual);
            
            actual = Ojay('#content blockquote, #content a#om_link').ancestors('#content div[id]');
            expected = Ojay('#content #bar, #content #fizzbuzz, #content #baz');
            this.arrayAssert.itemsAreEqual(expected, actual);
        },
        
        testChildren: function() {
            var actual = Ojay('#content #foo, #content #bar, #content #baz').children();
            var expected = Ojay('#content #first-p, #content p.something, #content ul#first-ul, #content .contains-blockquote, #content .wizzbang');
            this.arrayAssert.itemsAreEqual(expected, actual);
            
            actual = Ojay('#content #foo, #content #bar, #content #baz').children('p');
            expected = Ojay('#content #first-p, #content p.something');
            this.arrayAssert.itemsAreEqual(expected, actual);
        },
        
        testDescendants: function() {
            var actual = Ojay('#content #foo, #content #bar, #content #baz').descendants();
            var expected = Ojay('#content #foo *, #content #bar *, #content #baz *');
            this.arrayAssert.itemsAreEqual(expected, actual);
            
            actual = Ojay('#content #foo, #content #bar, #content #baz').children('p');
            expected = Ojay('#content #first-p, #content p.something');
            this.arrayAssert.itemsAreEqual(expected, actual);
        },
        
        testSiblings: function() {
            var actual = Ojay('#content li#theitem').siblings();
            var expected = Ojay('#content #thelist li[id!=theitem]');
            this.arrayAssert.itemsAreEqual(expected, actual);
            
            actual = Ojay('#content li#theitem').siblings('.ojay');
            expected = Ojay('#content #thelist li.ojay');
            this.arrayAssert.itemsAreEqual(expected, actual);
        }
    }));
    
    var logger = new YAHOO.tool.TestLogger();
    YAHOO.tool.TestRunner.run();
});