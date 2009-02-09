YAHOO.util.Event.onDOMReady(function() {
    YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
        name: 'Region tests',
        
        setUp: function() {
            this.assert = YAHOO.util.Assert;
            this.arrayAssert = YAHOO.util.ArrayAssert;
        },
        
        testNoPaddingOrBorders: function() {
            this.assert.areEqual(100, Ojay('#divA').getWidth());
            this.assert.areEqual(200, Ojay('#divA').getHeight());
        },
        
        testPaddingAndBorders: function() {
            this.assert.areEqual(2*4 + 2*16 + 50, Ojay('#divB').getWidth());
            this.assert.areEqual(2*4 + 24 + 8 + 30, Ojay('#divB').getHeight());
        },
        
        testIntersectionTesting: function() {
            this.assert.isTrue(Ojay('#divC').areaIntersects('#divD'));
            this.assert.isFalse(Ojay('#divC').areaIntersects('#divB'));
            this.assert.isTrue(Ojay('#divE').areaIntersects('#divF'));
        },
        
        testIntersectionCalculation: function() {
            var region = Ojay('#divE').intersection('#divF');
            this.assert.areSame(100, region.getWidth());
            this.assert.areSame(100, region.getHeight());
        },
        
        testContainment: function() {
            this.assert.isTrue(Ojay('#divE').areaContains('#divG'));
            this.assert.isFalse(Ojay('#divE').areaContains('#divF'));
            this.assert.isFalse(Ojay('#divE').areaContains('#divB'));
        },
        
        testContainmentOfNonPositionedElement: function() {
            this.assert.isTrue(Ojay('#divC').areaContains('#divC p'));
        }
    }));
    
    var logger = new YAHOO.tool.TestLogger();
    YAHOO.tool.TestRunner.run();
});
