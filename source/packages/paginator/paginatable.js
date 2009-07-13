Ojay.Paginatable = new JS.Module('Ojay.Paginatable', {
    include: [Ojay.Observable, JS.State],
    
    /**
     * @returns {Object}
     */
    getInitialState: function() {
        return {page: 1};
    },
    
    /**
     * @param {Object} state
     * @param {Function} callback
     * @param {Object} scope
     * @returns {Paginator}
     */
    changeState: function(state, callback, scope) {
        if (state.page !== undefined) this._handleSetPage(state.page, callback, scope);
        return this;
    },
    
    /**
     * <p>Returns the direction of the paginator.</p>
     * @returns {String}
     */
    getDirection: function() {
        return this._options.direction;
    },
    
    /**
     * <p>Returns a boolean to indicate whether the paginator loops.</p>
     * @returns {Boolean}
     */
    isLooped: function() {
        return !!this._options.looped || !!this._options.infinite;
    },
    
    /**
     * <p>Returns an Ojay collection wrapping the wrapper element added to your document to
     * contain the original content element and let it slide.</p>
     * @returns {DomCollection}
     */
    getContainer: function() {
        return this.getHTML();
    },
    
    /**
     * <p>Returns an Ojay collection wrapping the sliding element, i.e. the element you specify
     * when creating the <tt>Paginator</tt> instance.</p>
     * @returns {DomCollection}
     */
    getSubject: function() {
        return this._elements._subject || undefined;
    },
    
    /**
     * <p>Returns a <tt>Region</tt> object representing the area of the document occupied by
     * the <tt>Paginator</tt>'s container element.</p>
     * @returns {Region}
     */
    getRegion: function() {
        if (!this._elements._container) return undefined;
        return this._elements._container.getRegion();
    },
    
    states: {
        READY: {
            /**
             * <p>Sets the current page of the <tt>Paginator</tt> by scrolling the subject
             * element. Will fire a <tt>pagechange</tt> event if the page specified is not
             * equal to the current page.</p>
             * @param {Number} page
             * @param {Function} callback
             * @param {Object} scope
             * @returns {Paginator}
             */
            setPage: function(page, callback, scope) {
                page = Number(page);
                if (this._options.looped && page < 1) page += this._numPages;
                if (this._options.looped && page > this._numPages) page -= this._numPages;
                
                if (!this.isLooped() && (page == this._currentPage || page < 1 || page > this._numPages))
                    return this;
                
                this.changeState({page: page}, callback, scope);
                return this;
            }
        }
    }
});

