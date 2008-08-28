/**
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
     */
    _expand: function(section) {
        if (this._currentSection) this._currentSection.collapse();
        this._currentSection = section;
    },
    
    /**
     * @returns {Array}
     */
    getSections: function() {
        return this._sections.slice();
    }
});

