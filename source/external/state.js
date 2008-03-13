/**
 * Copyright (c) 2007-2008 James Coglan
 * http://jsclass.jcoglan.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

JS.State = (function(Class) {
  
  var stub = function() { return this; };
  
  var buildStubs = function(stubs, collection, states) {
    var state, method;
    for (state in states) {
      collection[state] = {};
      for (method in states[state]) stubs[method] = stub;
  } };
  
  var buildStateCollection = function(addMethod, proto, superproto, states) {
    var stubs = {}, collection = {}, superstates = superproto.states || {};
    buildStubs(stubs, collection, states);
    buildStubs(stubs, collection, superstates);
    var state, klass;
    for (state in collection) {
      klass = (superstates[state]||{}).klass;
      klass = klass ? Class(klass, states[state]) : Class(states[state]);
      klass.include(stubs, false);
      collection[state] = new klass;
    }
    return addMethod.call(Class, proto, superproto, 'states', collection);
  };
  
  Class.addMethod = (function(wrapped) {
    return function(object, superObject, name, block) {
      if (name != 'states' || typeof block != 'object') return wrapped.apply(Class, arguments);
      return buildStateCollection(wrapped, object, superObject, block);
    };
  })(Class.addMethod);
  
  var addStateMethods = function(state, klass) {
    for (var method in state)
      (function(methodName) {
        klass.instanceMethod(methodName, function() {
          var func = (this._state || {})[methodName];
          return func ? func.apply(this, arguments): this;
        }, false);
      })(method);
  };
  
  return JS.Module({
    _getState: function(state) {
      return  (typeof state == 'object' && state) ||
              (typeof state == 'string' && ((this.states || {})[state] || {})) ||
              {};
    },
    
    setState: function(state) {
      this._state = this._getState(state);
      addStateMethods(this._state, this.klass);
    },
    
    inState: function() {
      for (var i = 0, n = arguments.length; i < n; i++) {
        if (this._state == this._getState(arguments[i])) return true;
      }
      return false;
    }
  });
})(JS.Class);
