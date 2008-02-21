YAHOO.util.Event.onDOMReady(function() {
    YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
        name: 'HtmlBuilder tests',
        
        setUp: function() {
            this.assert = YAHOO.util.Assert;
            this.arrayAssert = YAHOO.util.ArrayAssert;
            this.html = new Ojay.HtmlBuilder();
        },
        
        testProperties: function() {
            var div = this.html.div({id: 'someDiv', className: 'foo', style: {width: '24px', marginTop: '4px'}}, 'A div');
            this.assert.areEqual('someDiv', div.id);
            this.assert.areEqual('foo', div.className);
            this.assert.areEqual('24px', div.style.width);
            this.assert.areEqual('4px', div.style.marginTop);
            this.assert.areEqual('A div', div.innerHTML);
        },
        
        testNestingAndBinding: function() {
            var div = this.html.div(function(html) {
                html.h1('This is the title');
                html.p({className: 'para'}, 'Lorem ipsum dolor sit amet...');
                html.ul(function(html) {
                    ['One', 'Two', 'Three'].forEach(html.method('li'));
                });
            });
            this.assert.isTrue(/<h1>This is the title<\/h1><p class=\"?para\"?>Lorem ipsum dolor sit amet...<\/p><ul><li>One<\/li><li>Two<\/li><li>Three<\/li><\/ul>/i.test(div.innerHTML.toLowerCase().replace(/[\n\r]/g, '')));
        }
    }));
    
    var logger = new YAHOO.tool.TestLogger();
    YAHOO.tool.TestRunner.run();
});
