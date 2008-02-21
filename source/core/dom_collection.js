(function(Dom) {
    /**
     * <p>Wraps collections of DOM element references with an API for manipulation of page
     * elements. Includes methods for getting/setting class names and style attributes,
     * traversing the DOM, and setting up event handlers.</p>
     * @constructor
     * @class DomCollection
     */
    Ojay.DomCollection = JS.Class(/** @scope Ojay.DomCollection.prototype */{
        
        /**
         * @param {Array} collection An array of HTMLElement references
         * @returns {DomCollection} A reference to the DomCollection instance
         */
        initialize: function(collection) {
            this.length = 0;
            for (var i = 0, n = collection.length, nodeType, push = [].push; i < n; i++) {
                nodeType = collection[i].nodeType;
                if (nodeType === Ojay.HTML.ELEMENT_NODE ||
                    nodeType === Ojay.HTML.DOCUMENT_NODE ||
                    collection[i] == window)
                    push.call(this, collection[i]);
            }
            this.node = this[0];
            return this;
        },
        
        /**
         * <p>Returns the elements of the collection as a native Array type.</p>
         * @returns {Array}
         */
        toArray: function() {
            var results = [], i, n = this.length;
            for (i = 0; i < n; i++) results.push(this[i]);
            return results;
        },
        
        /**
         * <p> Returns a <tt>DomCollection</tt> wrapping the <tt>n</tt>th element in the current
         * collection.</p>
         * @param {Number} n
         * @returns {DomCollection}
         */
        at: function(n) {
            return new this.klass([this[Number(n).round()]]);
        },
        
        /**
         * <p>Registers event listeners on all the members of the collection. You must supply at
         * least the name of the event to listen for, and you can supply a callback function and
         * (optionally) its scope as well. This method returns a <tt>MethodChain</tt> so you can
         * write more sentence-like code without needing to write explicit callback functions. Some
         * examples:</p>
         *
         * <pre><code>    Ojay('p').on('click').setStyle({textDecoration: 'underline'});
         *     
         *     Ojay('p').on('mouseout').hide().parents().setStyle( ... );
         *     
         *     Ojay('li').on('click')._('h1#title').setStyle({color: '#f00'});</code></pre>
         *
         * <p>When using chaining like this, the method chain is fired only on the element that
         * triggers each event, not on the whole collection you called <tt>on()</tt> on.</p>
         *
         * <p>When using explicit callback functions, the callback receives on <tt>Ojay</tt> object
         * wrapping the element that triggered the event, and the event object as arguments. If you
         * supply your own scope parameter, <tt>this</tt> refers to your supplied object inside the
         * callback.</p>
         *
         * <pre><code>    Ojay('div').on('click', function(element, ev) {
         *         // 'this' does not refer to anything useful
         *     });
         *     
         *     Ojay('p').on('mouseout', function(element, ev) {
         *         // 'this' refers to the object 'someObject'
         *     }, someObject);</code></pre>
         *
         * <p>Even when you supply an explicit function, <tt>on()</tt> returns a <tt>MethodChain</tt>
         * so you can use the chaining feature as well. You can store a reference to this collector
         * so you can modify the event handler at a later time, <em>without actually creating any new
         * handlers</em>:</p>
         *
         * <pre><code>    var chain = Ojay('a.external').on('click');
         *
         *     // somewhere else...
         *     chain.addClass('clicked');</code></pre>
         *
         * <p>Any <tt>a.external</tt> will then gain the class name when it is clicked.</p>
         *
         * <p>There is one final subtlety: if you supply a second argument that is NOT a function, it
         * will be used as the base object for any chain firings. e.g.:</p>
         *
         * <pre><code>    // When these &lt;p&gt;s are clicked, the &lt;h1&gt; changes
         *     Ojay('p.changer').on('click', Ojay('h1')).setStyle({textTransform: 'uppercase'})</code></pre>
         *
         *
         * <p>Ojay gives you easy control of how the browser should respond to events. Inside your
         * callback function, you can prevent the event's default behaviour and stop it bubbling up
         * the DOM like so:</p>
         *
         * <pre><ocde>    Ojay('a').on('click', function(element, ev) {
         *         ev.stopDefault();
         *         // ... your custom behaviour
         *     });</code></pre>
         *
         * <p><tt>stopDefault</tt> stops the browser running the default behaviour for the event, e.g.
         * loading a new page when a link is clicked. The method <tt>stopPropagate</tt> stops the
         * event bubbling, and <tt>stopEvent</tt> does both. If all your callback does is call one
         * of these methods, you can use on of Ojay's pre-stored callbacks instead:</p>
         *
         * <pre><code>    Ojay('a').on('click', Ojay.stopDefault).setStyle({textDecoration: 'underline'});</code></pre>
         *
         * <p>You can use <tt>stopDefault</tt>, <tt>stopPropagate</tt> and <tt>stopEvent</tt> in this
         * manner. Using these is recommended over writing your own callbacks to do this, as creating
         * new identical functions wastes memory.</p>
         *
         * @param {String} eventName The name of the event to listen for
         * @param {Function} callback An optional callback function
         * @param {Object} scope An object to act as the execution scope for the callback (optional)
         * @returns {MethodChain}
         */
        on: function(eventName, callback, scope) {
            var collector = new JS.MethodChain();
            if (callback && typeof callback != 'function') scope = callback;
            YAHOO.util.Event.addListener(this, eventName, function(evnt) {
                var wrapper = Ojay(this);
                evnt.stopDefault   = Ojay.stopDefault.method;
                evnt.stopPropagate = Ojay.stopPropagate.method;
                evnt.stopEvent     = Ojay.stopEvent.method;
                evnt.getTarget     = Ojay._getTarget;
                if (typeof callback == 'function') callback.call(scope || null, wrapper, evnt);
                collector.fire(scope || wrapper);
            });
            return collector;
        },
        
        /**
         * <p>Runs an animation on all the elements in the collection. The method expects you to supply
         * at last an object specifying CSS properties to animate, and the duration of the animation.</p>
         *
         * <pre><code>   Ojay('#some-list li').animate({marginLeft: {to: 200}}, 1.5)</code></pre>
         *
         * <p>Functions can be used for any of these values to apply a different animation to each element
         * in the collection. Each function is passed the element's position in the collection (<tt>i</tt>)
         * and the element itself (<tt>el</tt>), and is evaluated just before the animation begins. <tt>el</tt>
         * is actually a <tt>DomCollection</tt> wrapping a single element. For example, to animate some
         * list elements out by a staggered amount, do:</p>
         *
         * <pre><code>   Ojay('#some-list li').animate({
         *        marginLeft: {
         *            to: function(i, el) { return 40 * i; }
         *        }
         *    }, 2.0);</code></pre>
         *
         * <p>The functions can appear at any level of the <tt>parameters</tt> object, so you could write
         * the above as:</p>
         *
         * <pre><code>   Ojay('#some-list li').animate(function(i, el) {
         *        return {
         *            marginLeft: {to: 40 * i}
         *        };
         *    }, 2.0);</code></pre>
         *
         * <p>or</p>
         *
         * <pre><code>   Ojay('#some-list li').animate({
         *        marginLeft: function(i, el) {
         *            return {to: 40 * i};
         *        }
         *    }, 2.0);</code></pre>
         *
         * <p>This allows for highly flexible animation definitions. You can also specify a function as
         * the <tt>duration</tt> parameter, so that each element takes a different time to animate:</p>
         *
         * <pre><code>   Ojay('#some-list li').animate({marginLeft: {to: 200}},
         *            function(i) { return 0.5 + 2.0 * (i/5).sin().abs(); });</code></pre>
         *
         * <p>The final parameter, <tt>options</tt>, allows you to specify various optional arguments to
         * control the animation. They are:</p>
         *
         * <p><tt>easing</tt>: The easing function name (from <tt>YAHOO.util.Easing</tt>) to control the
         * flow of the animation. Default is <tt>'easeBoth'</tt>.</p>
         *
         * <p>An example:</p>
         *
         * <pre><code>   Ojay('#some-list li').animate({marginLeft: {to: 40}}, 5.0, {easing: 'elasticOut'});</code></pre>
         *
         * @param {Object|Function} parameters
         * @param {Number|Function} duration
         * @param {Object} options
         * @returns {MethodChain}
         */
        animate: function(parameters, duration, options) {
            var animation = new Ojay.Animation(this, parameters, duration, options);
            animation.run();
            return animation.chain;
        },
        
        /**
         * <p>Adds the given string as a class name to all the elements in the collection and returns
         * a reference to the collection for chaining.</p>
         * @param {String} className A string of space-separated class names
         * @returns {DomCollection}
         */
        addClass: function(className) {
            Dom.addClass(this, String(className));
            return this;
        },
        
        /**
         * <p>Removes the given class name(s) from all the elements in the collection and returns a
         * reference to the collection for chaining.</p>
         * @param {String} className A string of space-separated class names
         * @returns {DomCollection}
         */
        removeClass: function(className) {
            Dom.removeClass(this, String(className));
            return this;
        },
        
        /**
         * <p>Replaces oldClass with newClass for every element in the collection and returns a
         * reference to the collection for chaining.</p>
         * @param {String} oldClass The class name to remove
         * @param {String} newClass The class name to add
         * @returns {DomCollection}
         */
        replaceClass: function(oldClass, newClass) {
            Dom.replaceClass(this, String(oldClass), String(newClass));
            return this;
        },
        
        /**
         * <p>Sets the class name of all the elements in the collection to the given value and
         * returns a reference to the collection for chaining.</p>
         * @param {String} className A string of space-separated class names
         * @returns {DomCollection}
         */
        setClass: function(className) {
            for (var i = 0, n = this.length; i < n; i++)
                this[i].className = String(className);
            return this;
        },
        
        /**
         * <p>Returns true iff the first member of the collection has the given class name.</p>
         * @param {String} className The class name to test for
         * @returns {Boolean}
         */
        hasClass: function(className) {
            if (!this.node) return undefined;
            return Dom.hasClass(this.node, String(className));
        },
        
        /**
         * <p>Returns the value of the named style property for the first element in the collection.</p>
         * @param {String} name The name of the style value to get (camelCased)
         */
        getStyle: function(name) {
            if (!this.node) return undefined;
            return Dom.getStyle(this.node, String(name));
        },
        
        /**
         * <p>Sets the style of all the elements in the collection using a series of key/value pairs.
         * Keys correspond to CSS style property names, and should be camel-cased where they would
         * be hyphentated in style sheets. Returns the <tt>DomCollection</tt> instance for chaining.
         * You need to use a string key for <tt>'float'</tt> as it's a reserved word in JavaScript.</p>
         *
         * <pre><code>    Ojay('p').setStyle({color: '#f00', fontSize: '14px', 'float': 'left'});</code></pre>
         *
         * @param {Object} options A series of key/value pairs
         * @returns {DomCollection} A reference to the DomCollection instance
         */
        setStyle: function(options) {
            var value, isIE = !!YAHOO.env.ua.ie;
            for (var property in options) {
                if (isIE && property == 'opacity') {
                    value = Number(options[property]);
                    if (value === 0) options[property] = 0.01;
                    if (value === 1) {
                        Dom.setStyle(this, 'filter', '');
                        continue;
                    }
                }
                Dom.setStyle(this, property, options[property]);
            }
            return this;
        },
        
        /**
         * <p>Sets the given HTML attributes of all the elements in the collection, and returns the
         * collection for chaining. Remember to use <tt>className</tt> for classes, and <tt>htmlFor</tt>
         * for label attributes.</p>
         *
         * <pre><code>    Ojay('img').setAttributes({src: 'images/tom.png'});</code></pre>
         *
         * @param Object options
         * @returns DomCollection
         */
        setAttributes: function(options) {
            for (var i = 0, n = this.length; i < n; i++) {
                for (var key in options)
                    this[i][key] = options[key];
            }
            return this;
        },
        
        /**
         * <p>Hides every element in the collection and returns the collection.</p>
         * @returns {DomCollection}
         */
        hide: function() {
            this.setStyle({display: 'none'});
            return this;
        },
        
        /**
         * <p>Shows/unhides every element in the collection and returns the collection.</p>
         * @returns {DomCollection}
         */
        show: function() {
            this.setStyle({display: ''});
            return this;
        },
        
        /**
         * <p>If <tt>html</tt> is a string, sets the <tt>innerHTML</tt> of every element in the
         * collection to the given string value. If <tt>html</tt> is an <tt>HTMLElement</tt>, inserts
         * the element into the first item in the collection (inserting DOM nodes multiple times just
         * moves them from place to place).</p>
         * @param {String|HTMLElement} html A string of HTML to fill the elements
         * @returns {DomCollection}
         */
        setContent: function(html) {
            if (!this.node) return this;
            if (html && html.nodeType === Ojay.HTML.ELEMENT_NODE) {
                this.node.innerHTML = '';
                this.node.appendChild(html);
            } else {
                this.toArray().forEach(function(element) {
                    element.innerHTML = String(html);
                });
            }
            return this;
        },
        
        /**
         * <p>Inserts the given <tt>html</tt> (a <tt>String</tt> or an <tt>HTMLElement</tt>) into every
         * element in the collection at the given <tt>position</tt>. <tt>position</tt> can be one of
         * <tt>'top'</tt>, <tt>'bottom'</tt>, <tt>'before'</tt> or <tt>'after'</tt>, and it defaults to
         * <tt>'bottom'</tt>. Returns the <tt>DomCollection</tt> for chaining.</p>
         *
         * <pre><code>    Ojay('#someDiv').insert('&lt;p&gt;Inserted after the DIV&lt;/p&gt;', 'after');
         *     
         *     Ojay('ul li').insert(Ojay.HTML.span({className: 'foo'}, 'Item: '), 'top');</code></pre>
         *
         * @param {String|HTMLElement} html The HTML to insert
         * @param {String} position The position at which to insert it (default is <tt>bottom</tt>)
         * @returns {DomCollection}
         */
        insert: function(html, position) {
            if (position == 'replace') return this.setContent(html);
            var insertion = new Ojay.DomInsertion(this.toArray(), html, position);
            return this;
        },
        
        /**
         * <p>Removes all the elements in the collection from the document, and returns the collection.</p>
         * @returns {DomCollection}
         */
        remove: function() {
            this.toArray().forEach(function(element) {
                if (element.parentNode)
                    element.parentNode.removeChild(element);
            });
            return this;
        },
        
        /**
         * <p>Provides a nicer syntax for executing statements asynchronously using
         * <tt>setTimeout()</tt>. It frees you from having to worry about function binding and
         * scope, and lets you specify times in seconds rather than milliseconds. Works by
         * returning a <tt>MethodChain</tt> object that implements all the methods of
         * <tt>DomCollection</tt>. For more information, consult the <tt>MethodChain</tt>
         * documentation.</p>
         *
         * <p>For added flexibilily, you can pass a function instead of a number so that each
         * element waits a different amount of time before firing the chain. For example:</p>
         *
         * <pre><code>    Ojay('li').wait(function(i) { return 0.2 * i; }).setStyle({color: 'red'});</code></pre>
         *
         * @param {Number|Function} time The number of seconds to delay before execution
         * @returns {MethodChain}
         */
        wait: function(time) {
            var collector = new JS.MethodChain();
            switch (typeof time) {
                case "number":
                    setTimeout(collector.fire.bind(collector, this), Number(time) * 1000);
                    break;
                case "function":
                    this.forEach(function(element, i) {
                        setTimeout(collector.fire.bind(collector, element), time(i, element) * 1000);
                    });
                    break;
            }
            return collector;
        },
        
        /**
         * <p>Returns true iff the first element in the collection matches the given CSS or
         * XPath selector.</p>
         * @param {String} selector A CSS or XPath selector string
         * @returns {Boolean}
         */
        matches: function(selector) {
            if (!this.node) return undefined;
            return YAHOO.util.Selector.test(this.node, selector);
        },
        
        /**
         * <p>Returns a new <tt>DomCollection</tt> containing the elements of the collection
         * that match the selector if one is given.</p>
         * @param {String} selector An optional CSS or XPath expression
         * @returns {DomCollection}
         */
        query: function(selector, array) {
            var collection = array ? Ojay(array) : this;
            if (!selector) return new this.klass(collection.toArray());
            collection = collection.filter({matches: selector});
            return new this.klass(collection.toArray());
        },
        
        /**
         * <p>Returns a new <tt>DomCollection</tt> of the unique parent nodes of all the elements
         * in the collection. If a selector string is supplied, only elements that match the
         * selector are included.</p>
         * @param {String} selector An optional CSS or XPath expression
         * @returns {DomCollection}
         */
        parents: function(selector) {
            var parents = this.map('node.parentNode');
            return this.query(selector, parents.unique());
        },
        
        /**
         * <p>Returns a new <tt>DomCollection</tt> of the unique ancestor nodes of all the elements
         * in the collection. If a selector string is supplied, only elements that match the
         * selection are included.</p>
         * @param {String} selector An optional CSS or XPath expression
         * @returns {DomCollection}
         */
        ancestors: function(selector) {
            var ancestors = [];
            this.toArray().forEach(function(element) {
                while ((element.tagName.toLowerCase() != 'body') && (element = element.parentNode)) {
                    if (ancestors.indexOf(element) == -1)
                        ancestors.push(element);
                }
            });
            return this.query(selector, ancestors);
        },
        
        /**
         * <p>Returns a new <tt>DomCollection</tt> of the unique child nodes of all the elements
         * in the collection. If a selector string is supplied, only elements that match the
         * selection are included.</p>
         * @param {String} selector An optional CSS or XPath expression
         * @returns {DomCollection}
         */
        children: function(selector) {
            var children = [];
            this.toArray().forEach(function(element) {
                var additions = Dom.getChildren(element), arg;
                while (arg = additions.shift()) {
                    if (children.indexOf(arg) == -1)
                        children.push(arg);
                }
            });
            return this.query(selector, children);
        },
        
        /**
         * <p>Returns a new <tt>DomCollection</tt> of the unique descendant nodes of all the elements
         * in the collection. If a selector string is supplied, only elements that match the
         * selection are included.</p>
         * @param {String} selector An optional CSS or XPath expression
         * @returns {DomCollection}
         */
        descendants: function(selector) {
            selector = selector || '*';
            var descendants = [];
            this.toArray().forEach(function(element) {
                var additions = Ojay.query(selector, element), arg;
                while (arg = additions.shift()) {
                    if (descendants.indexOf(arg) == -1)
                        descendants.push(arg);
                }
            });
            return new this.klass(descendants);
        },
        
        /**
         * <p>Returns a new <tt>DomCollection</tt> of the unique siblings of all the elements in the
         * collection. The returned collection does not include elements present in the original
         * collection. If a selector string is supplied, only elements that match the selection are
         * included.</p>
         * @param {String} selector An optional CSS or XPath expression
         * @returns {DomCollection}
         */
        siblings: function(selector) {
            var these = this.toArray(), siblings = [];
            these.forEach(function(element) {
                var additions = Ojay(element).parents().children(selector).toArray(), arg;
                while (arg = additions.shift()) {
                    if ((these.indexOf(arg) == -1) && (siblings.indexOf(arg) == -1))
                        siblings.push(arg);
                }
            });
            return new this.klass(siblings);
        },
        
        /**
         * <p>Returns a <tt>Region</tt> object representing the rectangle occupied by the the first
         * element in the collection.</p>
         * @returns {Region}
         */
        getRegion: function() {
            if (!this.node) return undefined;
            return new Ojay.Region(Dom.getRegion(this.node));
        },
        
        /**
         * <p>Returns the total width of the region occupied by the element, including padding
         * and borders. Values returned are in pixels.</p>
         * @returns {Number}
         */
        getWidth: function() {
            if (!this.node) return undefined;
            return this.getRegion().getWidth();
        },
        
        /**
         * <p>Returns the total height of the region occupied by the element, including padding
         * and borders. Values returned are in pixels.</p>
         * @returns {Number}
         */
        getHeight: function() {
            if (!this.node) return undefined;
            return this.getRegion().getHeight();
        },
        
        /**
         * <p>Returns the position of the top edge of the first element in the collection relative
         * to the viewport, in pixels.</p>
         * @returns {Number}
         */
        getTop: function() {
            if (!this.node) return undefined;
            return this.getRegion().top;
        },
        
        /**
         * <p>Returns the position of the bottom edge of the first element in the collection relative
         * to the viewport, in pixels.</p>
         * @returns {Number}
         */
        getBottom: function() {
            if (!this.node) return undefined;
            return this.getRegion().bottom;
        },
        
        /**
         * <p>Returns the position of the left edge of the first element in the collection relative
         * to the viewport, in pixels.</p>
         * @returns {Number}
         */
        getLeft: function() {
            if (!this.node) return undefined;
            return this.getRegion().left;
        },
        
        /**
         * <p>Returns the position of the right edge of the first element in the collection relative
         * to the viewport, in pixels.</p>
         * @returns {Number}
         */
        getRight: function() {
            if (!this.node) return undefined;
            return this.getRegion().right;
        },
        
        /**
         * <p>Returns the position of the center of the element as an object with <tt>left</tt> and
         * <tt>top</tt> properties. Values returned are in pixels.</p>
         */
        getCenter: function() {
            if (!this.node) return undefined;
            return this.getRegion().getCenter();
        },
        
        /**
         * <p>Returns true iff the first element in the collection intersects the area of the element
         * given as an argument.</p>
         * @param {String|HTMLElement|DomCollection} element
         * @returns {Boolean}
         */
        areaIntersects: function(element) {
            if (!this.node) return undefined;
            var node = Ojay(element);
            return this.getRegion().intersects(node.getRegion());
        },
        
        /**
         * <p>Returns a <tt>Region</tt> representing the overlapping region of the first element in the
         * collection and the argument.</p>
         * @param {String|HTMLElement|DomCollection} element
         * @returns {Region} or null if there is no overlap
         */
        intersection: function(element) {
            if (!this.node) return undefined;
            var node = Ojay(element);
            var A = this.getRegion(), B = node.getRegion();
            return A.intersects(B) ? A.intersection(B) : null;
        },
        
        /**
         * <p>Returns true iff the first element in the collection completely contains the area of the
         * element given as an argument.</p>
         * @param {String|HTMLElement|DomCollection} element
         * @returns {Boolean}
         */
        areaContains: function(element) {
            if (!this.node) return undefined;
            var node = Ojay(element);
            return this.getRegion().contains(node.getRegion());
        }
    });
})(YAHOO.util.Dom);

(function() {
    for (var method in Ojay.ARRAY_METHODS)
        (function(name) {
            var noConvert = /^(?:indexOf|lastIndexOf|unique)$/.test(name);
            Ojay.DomCollection.instanceMethod(name, function() {
                var array = noConvert
                        ? this.toArray()
                        : [].map.call(this, function(el) { return Ojay(el); });
                var result = array[name].apply(array, arguments);
                if (name == 'filter')
                    result = Ojay(result.map(function(el) { return el.node; }));
                return result;
            });
        })(method);
})();

Ojay.fn = Ojay.DomCollection.prototype;
