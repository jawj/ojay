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
    options.togglesClass = options.togglesClass || this.klass.TOGGLES_CLASS;
    options.switchTime = options.switchTime || this.klass.SWITCH_TIME;
    options.tabsPosition = options.tabsPosition || 'before';
    
    this.container = Ojay(tabs).parents().at(0);
    
    this.addToggles(tabs);
    
    this.tabs = Ojay(tabs).map(function(container) {
      return new this.klass.Tab(this, Ojay(container));
    }.bind(this));
    
    if (options.width && options.height)
      this.container.setStyle({height: options.height});
    
    this.toggle(0);
  },
  
  addToggles: function(tabs) {
    var self = this;
    this.toggles = [];
    
    var toggles = Ojay(Ojay.HTML.ul({className: this._options.togglesClass},
    function (H) {
      Ojay(tabs).children(self._options.toggleSelector)
      .forEach(function(header, i) {
        header.hide();
        var toggle = Ojay(H.li(header.node.innerHTML)).addClass('toggle-' + i);
        if (i === 0) toggle.addClass('first');
        if (i === tabs.length - 1) toggle.addClass('last');
        self.toggles.push(toggle);
        toggle.on('click', function() { self.toggle(i); });
      });
    }));
    
    if (typeof this._options.width != 'undefined')
      toggles.setStyle({width: this._options.width});
    
    Ojay(tabs).parents().at(0).insert(toggles, this._options.tabsPosition);
  },
  
  toggle: function(index, options) {
    options = options || {};
    
    if (index >= this.tabs.length) index = 0;
    if (this.currentTab == index || this.animating) return;
    
    if (typeof this.currentTab == 'undefined') {
      this.currentTab = index;
      this.toggles[index].addClass('current');
      this.tabs[index].show();
    } else {
      this.animating = true;
      this.toggles.forEach(function(toggle) { toggle.removeClass('current'); });
      this.toggles[index].addClass('current');
      this.tabs[this.currentTab].hide()._(function(self) {
        self.currentTab = index;
        self.tabs[index].show()._(function() {
          self.animating = false;
          if (options.silent !== true) self.notifyObservers('tabchange', index);
        });
      }, this);
    }
  },
  
  extend: {
    TOGGLE_SELECTOR: '.toggle',
    TOGGLES_CLASS:   'tab-toggles',
    SWITCH_TIME: 0.2,
    
    Tab: new JS.Class({
      
      initialize: function(group, container) {
        this.container = container, this.group = group;
        
        this.container.hide().setStyle({opacity: 0});
        
        if (this.group._options.height)
          this.container.setStyle({position: 'absolute', top: 0, left: 0});
      },
      
      hide: function() {
        var chain = new JS.MethodChain;
        this.container.animate({opacity: {to: 0}},
          this.group._options.switchTime).hide()
        ._(function(self) { chain.fire(self); }, this)._(this);
        return chain;
      },
      
      show: function() {
        var chain = new JS.MethodChain;
        this.container.show().animate({opacity: {to: 1}},
          this.group._options.switchTime)
        ._(function(self) { chain.fire(self); }, this)._(this);
        return chain;
      }
    })
  }
});
