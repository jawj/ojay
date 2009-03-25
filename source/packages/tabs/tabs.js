/**
 * @constructor
 * @class Tabs
 */
Ojay.Tabs = new JS.Class(/** @scope Ojay.Tabs.prototype */{
    include: [Ojay.Observable, JS.State],
      
    /**
     * @param {String} tabs
     * @param {Object} options
     */
    initialize: function(tabs, options) {
        this._tabGroup = tabs;
        this._options  = options || {};
        this.setState('CREATED');
    },
    
    /**
     * @returns {Tabs}
     */
    
    
    /**
     * @returns {Object}
     */
    getInitialState: function() {
        return {tab: 1};
    },
    
    /**
     * @param {Object} state
     * @returns {Tabs}
     */
    changeState: function(state) {
        if (state.tab !== undefined) this._handleSetPage(state.tab);
        return this;
    },
    
    states: {
        CREATED: {
            setup: function() {
                var options = this._options;
                options.toggleSelector = options.toggleSelector || this.klass.TOGGLE_SELECTOR;
                options.togglesClass   = options.togglesClass   || this.klass.TOGGLES_CLASS;
                options.switchTime     = options.switchTime     || this.klass.SWITCH_TIME;
                options.tabsPosition   = options.tabsPosition   || this.klass.INSERT_POSITION;
                
                this._tabGroup  = Ojay(this._tabGroup);
                this._container = this._tabGroup.parents().at(0);
                
                this._addToggles();
                
                this._tabs = this._tabGroup.map(function(container) {
                    return new this.klass.Tab(this, container);
                }, this);
                
                if (options.width && options.height)
                    this._container.setStyle({height: options.height});
                
                this.setState('READY');
                var state = this.getInitialState();
                this._handleSetPage(state.tab);
                return this;
            },
            
            /**
             * <p>Insert the toggle control group before or after the tabs' containing
             * element.</p>
             */
            _addToggles: function() {
                this._toggles = [];
                var self = this, options = self._options;
                var toggles = Ojay( Ojay.HTML.ul({className: options.togglesClass}, function (HTML) {
                    self._tabGroup.children(options.toggleSelector).forEach(function(header, i) {
                        header.hide();
                        var toggle = Ojay( HTML.li(header.node.innerHTML) ).addClass('toggle-' + i);
                        if (i === 0) toggle.addClass('first');
                        if (i === self._tabGroup.length - 1) toggle.addClass('last');
                        self._toggles.push(toggle);
                        toggle.on('click')._(self).setPage(i+1);
                    });
                }) );
                
                if (typeof this._options.width != 'undefined')
                    toggles.setStyle({width: this._options.width});
                
                this._tabGroup.parents().at(0).insert(toggles, this._options.tabsPosition);
            }
        },
        
        READY: {
            /**
             * @param {Number} page
             * @param {Object} options
             * @returns {Tabs}
             */
            setPage: function(page, options) {
                this.changeState({tab: page});
                if ((options || {}).silent !== false) this.notifyObservers('pagechange', page);
                return this;
            },
            
            /**
             * <p>Switch to the tab with the index provided as the first argument.
             * Passing in the <tt>silent</tt> option will stop the <tt>pagechange</tt>
             * event from being published.</p>
             *
             * @param {Number} index
             */
            _handleSetPage: function(index) {
                index  -= 1;
                
                if (index >= this._tabs.length) index = 0;
                if (this._currentTab == index) return;
                
                if (typeof this._currentTab == 'undefined') {
                    this._currentTab = index;
                    this._toggles[index].addClass('current');
                    this._tabs[index].show();
                } else {
                    this._toggles.forEach({removeClass: 'current'});
                    this._toggles[index].addClass('current');
                    this.setState('ANIMATING');
                    this._tabs[this._currentTab].hide()._(function(self) {
                        self._currentTab = index;
                        self._tabs[index].show()
                        ._(self).setState('READY');
                    }, this);
                }
            }
        },
        
        ANIMATING: {}
    },
    
    extend: /** @scope Ojay.Tabs */{
        TOGGLE_SELECTOR:  '.toggle',
        TOGGLES_CLASS:    'toggles',
        SWITCH_TIME:      0.2,
        INSERT_POSITION:  'before',
        
        /**
         * @constructor
         * @class Tab
         */
        Tab: new JS.Class(/** @scope Ojay.Tabs.Tab.prototype */{
            /**
             * @param {Ojay.Tab} group
             * @param {HTMLElement} container
             */
            initialize: function(group, container) {
                this._container = container, this._group = group;
                
                this._container.hide().setStyle({opacity: 0});
                
                if (this._group._options.height)
                    this._container.setStyle({position: 'absolute', top: 0, left: 0});
            },
            
            /**
             * @returns {JS.MethodChain}
             */
            hide: function() {
                return this._container.animate({opacity: {to: 0}},
                        this._group._options.switchTime)
                        .hide()
                        ._(this);
            },
            
            /**
             * @returns {JS.MethodChain}
             */
            show: function() {
                return this._container.show().animate({opacity: {to: 1}},
                        this._group._options.switchTime)
                        ._(this);
            }
        })
    }
});

