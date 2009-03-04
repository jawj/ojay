YAHOO.util.Event.onDOMReady(function() {
    YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
        name: 'Insertion tests',
        
        setUp: function() {
            this.assert = YAHOO.util.Assert;
            this.arrayAssert = YAHOO.util.ArrayAssert;
            this.html = new Ojay.HtmlBuilder();
        },
        
        testSetContent: function() {
            var content = '<p>I didn\'t know you could do this with strings.</p><ul><li>Neither</li><li>Did</li><li>I</li></ul>';
            Ojay('.setcontent').setContent(content);
            this.assert.areEqual(content.toLowerCase().replace(/[\n\r]/g, ''), Ojay('.setcontent')[0].innerHTML.toLowerCase().replace(/[\n\r]/g, ''));
            this.assert.areEqual(content.toLowerCase().replace(/[\n\r]/g, ''), Ojay('.setcontent')[1].innerHTML.toLowerCase().replace(/[\n\r]/g, ''));
            var div = this.html.div(function(html) {
                html.p('Well I never');
                html.ul(function(html) {
                    ['One', 'Two', 'Three'].forEach(html.li);
                });
            });
            Ojay('.setcontent').setContent(div);
            var newContent = '<div>' + div.innerHTML + '</div>'.toLowerCase().replace(/[\n\r]/g, '');
            this.assert.areEqual(newContent.toLowerCase().replace(/[\n\r]/g, ''), Ojay('.setcontent')[0].innerHTML.toLowerCase().replace(/[\n\r]/g, ''));
            this.assert.areEqual(content.toLowerCase().replace(/[\n\r]/g, ''), Ojay('.setcontent')[1].innerHTML.toLowerCase().replace(/[\n\r]/g, ''));
        },
        
        testElementInsertion: function() {
            Ojay('#acceptselements').insert(this.html.div('Inserted at bottom of container'));
            Ojay('#acceptselements .secondpara').insert(this.html.a({href: 'index.html'}, 'Inserted at top of Bar'), 'top');
            Ojay('#acceptselements .firstpara').insert(this.html.div('Inserted before Foo'), 'before');
            Ojay('#acceptselements').insert(this.html.div('Inserted after container'), 'after');
        },
        
        testMultipleElementInsertion: function() {
            Ojay('#theList li').insert(Ojay.HTML.span({style: {color: '#f00'}}, 'Inserted! ', function(html) {
                html.a({href: 'http://google.com'}, 'Link');
            }), 'after');
            Ojay('#theList span').on('mouseover').setStyle({color: '#333'});
        },
        
        testStringInsertion: function() {
            Ojay('#acceptstext').insert('<div>Inserted at bottom of container</div>');
            Ojay('#acceptstext .secondpara').insert('<a href="index.html">Inserted at top of Bar</a>', 'top');
            Ojay('#acceptstext .firstpara').insert('<div>Inserted before Foo</div>', 'before');
            Ojay('#acceptstext').insert('<div>Inserted after container</div>', 'after');
        },
        
        // Some elements need special handling in IE
        testStringInsertionWithSpecialElements: function() {
            Ojay('#select').insert('<option value="1">First insertion</option><option value="2">Second insertion</option>');
            Ojay('#select').insert('<div>Inserted after SELECT 1</div><div>Inserted after SELECT 2</div>', 'after');
            Ojay('#select').insert('<div>Inserted before SELECT 1</div><div>Inserted before SELECT 2</div>', 'before');
            Ojay('#select').insert('<option value="">Please choose your insertion...</option>', 'top');
            
            Ojay('#th').insert('<th>Before heading</th>', 'before');
            Ojay('#th').insert('<th>After heading</th>', 'after');
            Ojay('#th').insert("It's the ", 'top');
        }
    }));
    
    var logger = new YAHOO.tool.TestLogger();
    YAHOO.tool.TestRunner.run();
});
