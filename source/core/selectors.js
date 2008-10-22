/**
 * @overview
 * <p>This file contains adapter objects that allow Ojay to use a variety of CSS selector
 * backends. Given that CSS engines are now being released as standalone libraries, it
 * makes sense to let people choose which one they want to use.</p>
 * 
 * <p>Ojay includes support for <tt>YAHOO.util.Selector</tt>, <tt>Sizzle</tt> and
 * <tt>peppy</tt> engines, but it is trivial to add support for others.</p>
 */
Ojay.Selectors = {
    Yahoo: {
        /**
         * @param {String} selector
         * @param {HTMLElement} context
         * @returns {Array}
         */
        query: function(selector, context) {
            return document.querySelectorAll
                    ? Array.from((context || document).querySelectorAll(selector))
                    : YAHOO.util.Selector.query(selector, context);
        },
        
        /**
         * @param {HTMLElement} node
         * @param {String} selector
         * @returns {Boolean}
         */
        test: function(node, selector) {
            return YAHOO.util.Selector.test(node, selector);
        }
    },
    
    Sizzle: {
        /**
         * @param {String} selector
         * @param {HTMLElement} context
         * @returns {Array}
         */
        query: function(selector, context) {
            return Sizzle(selector, context);
        },
        
        /**
         * @param {HTMLElement} node
         * @param {String} selector
         * @returns {Boolean}
         */
        test: function(node, selector) {
            return Sizzle.filter(selector, [node]).length === 1;
        }
    },
    
    Peppy: {
        /**
         * @param {String} selector
         * @param {HTMLElement} context
         * @returns {Array}
         */
        query: function(selector, context) {
            return peppy.query(selector, context);
        },
        
        /**
         * @param {HTMLElement} node
         * @param {String} selector
         * @returns {Boolean}
         */
        test: function(node, selector) {
            var results = peppy.query(selector, node, true);
            return results.indexOf(node) != -1;
        }
    }
};

// Default choice is YUI
Ojay.cssEngine = Ojay.Selectors.Yahoo;

