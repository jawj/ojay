/**
 * <p>The <tt>Tabs</tt> class is used to...</p>
 *
 * <p>See the website for further documentation and graphical examples.</p> 
 *
 * @constructor
 * @class Tab
 */
Ojay.Tabs = new JS.Class(/** @scope Ojay.Tabs.prototype */{
  include: Ojay.Observable,
    
  initialize: function(tabs, options) {
    options = this._options = options || {};
    
    options.toggleSelector = options.toggleSelector || this.klass.TOGGLE_SELECTOR;
    options.togglesClass   = options.togglesClass   || this.klass.TOGGLES_CLASS;
    options.switchTime     = options.switchTime     || this.klass.SWITCH_TIME;
    options.tabsPosition   = options.tabsPosition   || 'before';
    
    this._tabGroup  = Ojay(tabs);
    this._container = this._tabGroup.parents().at(0);
    
    this.addToggles();
    
    this._tabs = this._tabGroup.map(function(container) {
      return new this.klass.Tab(this, Ojay(container));
    }.bind(this));
    
    if (options.width && options.height)
      this._container.setStyle({height: options.height});
    
    this.toggle(0);
  },
  
  addToggles: function(tabs) {
    var self = this;
    this._toggles = [];
    
    var toggles = Ojay(Ojay.HTML.ul({className: this._options.togglesClass},
    function (H) {
      self._tabGroup.children(self._options.toggleSelector)
      .forEach(function(header, i) {
        header.hide();
        var toggle = Ojay(H.li(header.node.innerHTML)).addClass('toggle-' + i);
        if (i === 0) toggle.addClass('first');
        if (i === self._tabGroup.length - 1) toggle.addClass('last');
        self._toggles.push(toggle);
        toggle.on('click', function() { self.toggle(i); });
      });
    }));
    
    if (typeof this._options.width != 'undefined')
      toggles.setStyle({width: this._options.width});
    
    this._tabGroup.parents().at(0).insert(toggles, this._options.tabsPosition);
  },
  
  toggle: function(index, options) {
    options = options || {};
    
    if (index >= this._tabs.length) index = 0;
    if (this._currentTab == index || this._animating) return;
    
    if (typeof this._currentTab == 'undefined') {
      this._currentTab = index;
      this._toggles[index].addClass('current');
      this._tabs[index].show();
    } else {
      this._animating = true;
      this._toggles.forEach(function(toggle) { toggle.removeClass('current'); });
      this._toggles[index].addClass('current');
      this._tabs[this._currentTab].hide()._(function(self) {
        self._currentTab = index;
        self._tabs[index].show()._(function() {
          self._animating = false;
          if (options.silent !== true) self.notifyObservers('tabchange', index);
        });
      }, this);
    }
  },
  
  extend: {
    TOGGLE_SELECTOR: '.toggle',
    TOGGLES_CLASS:   'toggles',
    SWITCH_TIME: 0.2,
    
    Tab: new JS.Class({
      
      initialize: function(group, container) {
        this._container = container, this._group = group;
        
        this._container.hide().setStyle({opacity: 0});
        
        if (this._group._options.height)
          this._container.setStyle({position: 'absolute', top: 0, left: 0});
      },
      
      hide: function() {
        var chain = new JS.MethodChain;
        this._container.animate({opacity: {to: 0}},
          this._group._options.switchTime).hide()
        ._(function(self) { chain.fire(self); }, this)._(this);
        return chain;
      },
      
      show: function() {
        var chain = new JS.MethodChain;
        this._container.show().animate({opacity: {to: 1}},
          this._group._options.switchTime)
        ._(function(self) { chain.fire(self); }, this)._(this);
        return chain;
      }
    })
  }
});
