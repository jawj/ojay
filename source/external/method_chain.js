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

JS.MethodChain = (function() {
  
  var klass = function(base) {
    var queue = [], baseObject = base || {};
    
    this.____ = function(method, args) {
      queue.push({func: method, args: args});
    };
    
    this.fire = function(base) {
      var object = base || baseObject, method, property;
      loop: for (var i = 0, n = queue.length; i < n; i++) {
        method = queue[i];
        if (object instanceof klass) {
          object.____(method.func, method.args);
          continue;
        }
        switch (typeof method.func) {
          case 'string':    property = object[method.func];       break;
          case 'function':  property = method.func;               break;
          case 'object':    object = method.func; continue loop;  break;
        }
        object = (typeof property == 'function')
            ? property.apply(object, method.args)
            : property;
      }
      return object;
    };
  };
  
  klass.prototype = {
    _: function() {
      var func = arguments[0], args = [];
      if (!/^(?:function|object)$/.test(typeof func)) return this;
      for (var i = 1, n = arguments.length; i < n; i++)
        args.push(arguments[i]);
      this.____(func, args);
      return this;
    },
    
    toFunction: function() {
      var chain = this;
      return function(object) { return chain.fire(object); };
    }
  };
  
  var reserved = (function() {
    var names = [], key;
    for (key in new klass) names.push(key);
    return new RegExp('^(?:' + names.join('|') + ')$');
  })();
  
  klass.addMethods = function(object) {
    var methods = [], property, i, n,
        self = this.prototype;
    
    for (property in object) {
      if (Number(property) != property) methods.push(property);
    }
    if (object instanceof Array) {
      for (i = 0, n = object.length; i < n; i++) {
        if (typeof object[i] == 'string') methods.push(object[i]);
      }
    }
    for (i = 0, n = methods.length; i < n; i++)
      (function(name) {
        if (reserved.test(name)) return;
        self[name] = function() {
          this.____(name, arguments);
          return this;
        };
      })(methods[i]);
    
    if (object.prototype)
      this.addMethods(object.prototype);
  };
  
  klass.inherited = function() {
    throw new Error('MethodChain cannot be subclassed');
  };
  
  return klass;
})();

var it = its = function() { return new JS.MethodChain; };
