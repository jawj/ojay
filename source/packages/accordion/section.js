Ojay.Accordion.extend({
    /**
     * @constructor
     * @class Accordion.Section
     */
    Section: new JS.Class({
        extend: /** @scope Accordion.Section */{
            SECTION_CLASS:      'accordion-section',
            COLLAPSER_CLASS:    'collapser',
            DEFAULT_EVENT:      'click'
        },
        
        /**
         * @param {Accordion} accordion
         * @param {DomCollection} element
         * @param {String} collapsible
         * @param {Object} options
         */
        initialize: function(accordion, element, collapsible, options) {
            this._accordion = accordion;
            this._element = element;
            var target = element.descendants(collapsible).at(0);
            this._collapser = Ojay( Ojay.HTML.div({className: this.klass.COLLAPSER_CLASS}) );
            target.insert(this._collapser, 'before');
            this._collapser.insert(target);
            this._open = true;
            this.collapse(false);
            
            options = options || {};
            this._element.addClass(this.klass.SECTION_CLASS);
            this._element.on(options.event || this.klass.DEFAULT_EVENT)._(this).expand();
        },
        
        /**
         * @param {Boolean} animate
         * @returns {Accordion.Section}
         */
        collapse: function(animate) {
            if (!this._open) return this;
            this._collapser.setStyle({overflow: 'hidden'});
            var settings = {};
            settings[this.param] = (animate === false) ? 0 : {to: 0};
            this._open = false;
            this._element.removeClass('expanded').addClass('collapsed');
            if (animate === false) {
                this._collapser.setStyle(settings).setStyle({overflow: 'hidden'});
                return this;
            } else {
                return this._collapser.animate(settings, 0.4)
                        .setStyle({overflow: 'hidden'})
                        ._(this);
            }
        },
        
        /**
         * @param {Boolean} animate
         * @returns {Accordion.Section}
         */
        expand: function(animate) {
            if (this._open) return this;
            this._accordion._expand(this);
            this._collapser.setStyle({overflow: 'hidden'});
            var size = this.getSize();
            var settings = {};
            settings[this.param] = (animate === false) ? size + 'px' : {to: size};
            this._open = true;
            this._element.addClass('expanded').removeClass('collapsed');
            if (animate === false) {
                this._collapser.setStyle(settings).setStyle({overflow: ''});
                return this;
            } else {
                return this._collapser.animate(settings, 0.4)
                        .setStyle({overflow: ''})
                        ._(this);
            }
        }
    })
});

Ojay.Accordion.extend({
    /**
     * @constructor
     * @class Accordion.HorizontalSection
     */
    HorizontalSection:  new JS.Class(Ojay.Accordion.Section, {
        param:  'width',
        
        /**
         * @returns {Number}
         */
        getSize: function() {
            if (!this._open) this._collapser.setStyle({width: ''});
            var size = this._collapser.getRegion().getWidth();
            if (!this._open) this._collapser.setStyle({width: 0});
            return size;
        }
    }),
    
    /**
     * @constructor
     * @class Accordion.VerticalSection
     */
    VerticalSection:    new JS.Class(Ojay.Accordion.Section, {
        param:  'height',
        
        /**
         * @returns {Number}
         */
        getSize: function() {
            if (!this._open) this._collapser.setStyle({height: ''});
            var size = this._collapser.getRegion().getHeight();
            if (!this._open) this._collapser.setStyle({height: 0});
            return size;
        }
    })
});

