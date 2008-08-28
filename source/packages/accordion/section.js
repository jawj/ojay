Ojay.Accordion.extend({
    /**
     * @constructor
     * @class Accordion.Section
     */
    Section: new JS.Class({
        extend: /** @scope Accordion.Section */{
            SECTION_CLASS:      'accordion-section',
            COLLAPSER_CLASS:    'collapser',
            DEFAULT_EVENT:      'click',
            DEFAULT_DURATION:   0.4,
            DEFAULT_EASING:     'easeBoth'
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
            
            options = options || {};
            this._duration = options.duration || this.klass.DEFAULT_DURATION;
            this._easing = options.easing || this.klass.DEFAULT_EASING;
            
            this._element.addClass(this.klass.SECTION_CLASS);
            this._element.on(options.event || this.klass.DEFAULT_EVENT)._(this).expand();
            
            if (options.collapseOnClick)
                this._element.on('click', function() {
                    if (this._open) this.collapse();
                }, this);
            
            this._open = true;
            this.collapse(false);
        },
        
        /**
         * @returns {DomCollection}
         */
        getContainer: function() {
            return this._element;
        },
        
        /**
         * @returns {DomCollection}
         */
        getCollapser: function() {
            return this._collapser;
        },
        
        /**
         * @param {Boolean} animate
         * @returns {Accordion.Section}
         */
        collapse: function(animate) {
            if (!this._open) return this;
            this._collapser.setStyle({overflow: 'hidden'});
            this._element.removeClass('expanded').addClass('collapsed');
            
            var settings = {};
            settings[this.param] = (animate === false) ? 0 : {to: 0};
            
            var acc = this._accordion;
            if (animate !== false ) acc.notifyObservers('sectioncollapse',
                    acc._sections.indexOf(this), this);
            
            if (animate === false) {
                this._collapser.setStyle(settings).setStyle({overflow: 'hidden'});
                this._open = false;
                return this;
            } else {
                return this._collapser.animate(settings, this._duration, {easing: this._easing})
                .setStyle({overflow: 'hidden'})
                ._(function(self) { self._open = false; }, this)
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
            this._element.addClass('expanded').removeClass('collapsed');
            
            var size = this.getSize();
            var settings = {};
            settings[this.param] = (animate === false) ? size + 'px' : {to: size};
            
            var acc = this._accordion;
            if (animate !== false ) acc.notifyObservers('sectionexpand',
                    acc._sections.indexOf(this), this);
            
            if (animate === false) {
                this._collapser.setStyle(settings).setStyle({overflow: ''});
                this._open = true;
                return this;
            } else {
                return this._collapser.animate(settings, this._duration, {easing: this._easing})
                .setStyle({overflow: ''})
                ._(function(self) { self._open = true; }, this)
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
            var sections = this._accordion.getSections();
            var sizes = sections.map(function(section) {
                var collapser = section._collapser, size = collapser.getRegion().getWidth();
                collapser.setStyle({width: section == this ? '' : 0});
                return size;
            }, this);
            var size = this._collapser.getRegion().getWidth();
            sections.forEach(function(section, i) {
                section._collapser.setStyle({width: sizes[i] + 'px'});
            });
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

