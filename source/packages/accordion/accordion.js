/**
 * <p><tt>Accordion</tt> implements the well-known accordion menu widget. It allows for both
 * horizontal and vertical collapse directions, and allows the animation to be configured. Like
 * all Ojay widgets, it comes with a set of events that you can use to couple an accordion
 * instance to other parts of your application.</p>
 *
 * <p>Creating an accordion is straightforward. Start with a list of elements, each of which
 * should contain an element that you want to collapse. For example:</p>
 *
 * <pre><code>    <div class="section">
 *         <h3>Section 1</h3>
 *         <p>Lorem ipsum...</p>
 *     </div>
 *     <div class="section">
 *         <h3>Section 2</h3>
 *         <p>Dolor sit amet...</p>
 *     </div>
 *     <div class="section">
 *         <h3>Section 3</h3>
 *         <p>Quaniam omnes...</p>
 *     </div></code></pre>
 *
 * <p>In this example, the paragraphs will collapse and the headings will be the menu tabs.
 * The following script sets up the menu:</p>
 *
 * <pre><code>    var acc = new Ojay.Accordion('horizontal',
 *             '.section', 'p');</code></pre>
 *
 * <p>This will make a few changes to the markup, which you'll need to be aware of in order
 * to apply CSS. After the script runs, the document will look like this:</p>
 *
 * <pre><code>    <div class="section accordion-section">
 *         <h3>Section 1</h3>
 *     </div>
 *     <div class="accordion-collapsible">
 *         <p>Lorem ipsum...</p>
 *     </div>
 *     <div class="section accordion-section">
 *         <h3>Section 2</h3>
 *     </div>
 *     <div class="accordion-collapsible">
 *         <p>Dolor sit amet...</p>
 *     </div>
 *     <div class="section accordion-section">
 *         <h3>Section 3</h3>
 *     </div>
 *     <div class="accordion-collapsible">
 *         <p>Quaniam omnes...</p>
 *     </div></code></pre>
 *
 * <p>The original sections get an additional class to indicate that they're part of an
 * <tt>Accordion</tt> instance, and the collapsible elements get placed inside a new wrapper
 * element, outside their original parent. This seems a little odd but is required to work
 * around a layout bug in WebKit.</p>
        
 * @constructor
 * @class Accordion
 */
Ojay.Accordion = new JS.Class(/** @scope Ojay.Accordion.prototype */{
    include: Ojay.Observable,
    
    extend: /** @scope Ojay.Accordion */{
        DIRECTIONS: {
            horizontal:     'HorizontalSection',
            vertical:       'VerticalSection'
        }
    },
    
    /**
     * @param {String} direction
     * @param {HTMLElement|String} sections
     * @param {String} collapsible
     * @param {Object} options
     */
    initialize: function(direction, sections, collapsible, options) {
        this._options = options || {};
        var SectionClass = this.klass[this.klass.DIRECTIONS[direction]];
        this._sections = Ojay(sections).map(function(section) {
            return new SectionClass(this, section, collapsible, this._options);
        }, this);
    },
    
    /**
     * @param {Accordion.Section} section
     * @param {Boolean} animate
     */
    _expand: function(section, animate) {
        if (this._currentSection) this._currentSection.collapse(animate);
        this._currentSection = section;
    },
    
    /**
     * @returns {Array}
     */
    getSections: function() {
        return this._sections.slice();
    }
});

