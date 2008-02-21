(function(Dom) {
    JS.extend(Ojay, /** @scope Ojay */{
        
        query: YAHOO.util.Selector.query,
        
        /**
         * <p>Returns an Ojay Collection containing zero or one element that matches the ID. Used
         * for situations where IDs contains dots, slashes, etc.</p>
         * @param {String} id
         * @returns {DomCollection}
         */
        byId: function(id) {
            var element = document.getElementById(id);
            return new this.DomCollection(element ? [element] : []);
        },
        
        /**
         * <p>Changes the alias of the <tt>Ojay()</tt> function to the given <tt>alias</tt>.
         * If the alias is already the name of an existing function, that function will be
         * stored and overridden. The next call to <tt>changeAlias</tt> or <tt>surrenderAlias</tt>
         * will restore the original function.</p>
         * @param {String} alias
         */
        changeAlias: function(alias) {
            this.surrenderAlias();
            this.ALIAS = String(alias);
            this.__alias = (typeof window[this.ALIAS] == 'undefined') ? null : window[this.ALIAS];
            window[this.ALIAS] = this;
        },
        
        /**
         * <p>Gives control of the shorthand function back to whichever script implemented
         * it before Ojay. After using this function, use the <tt>Ojay()</tt> function
         * instead of the shorthand.</p>
         * @returns {Boolean} true if the shorthand function was changed, false otherwise
         */
        surrenderAlias: function() {
            if (this.__alias === null) {
                if (this.ALIAS) delete window[this.ALIAS];
                return false;
            }
            window[this.ALIAS] = this.__alias;
            return true;
        },
        
        /**
         * <p>Tells Ojay to trace calls to the methods you name. Only accepts methods on
         * <tt>Ojay.DomCollection.prototype</tt>.</p>
         * @param {String*} The name(s) of methods you want to log
         */
        log: function() {
            Array.from(arguments).forEach(function(method) {
                this[method] = this[method].traced(method + '()');
            }, Ojay.DomCollection.prototype);
        },
        
        /**
         * <p>Returns an object with width and height properties specifying the size of the
         * document.</p>
         * @returns {Object}
         */
        getDocumentSize: function() {
            return {
                width: Dom.getDocumentWidth(),
                height: Dom.getDocumentHeight()
            };
        },
        
        /**
         * <p>Returns an object with left and top properties specifying the scroll offsets
         * document.</p>
         * @returns {Object}
         */
        getScrollOffsets: function() {
            return {
                left: Dom.getDocumentScrollLeft(),
                top: Dom.getDocumentScrollTop()
            };
        },
        
        /**
         * <p>Returns an object with width and height properties specifying the size of the
         * viewport.</p>
         * @returns {Object}
         */
        getViewportSize: function() {
            return {
                width: Dom.getViewportWidth(),
                height: Dom.getViewportHeight()
            };
        }
    });
})(YAHOO.util.Dom);

Ojay.changeAlias('$');
