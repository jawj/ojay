/**
 * <p>The <tt>Paginator.Controls</tt> class implements a default UI for <tt>Paginator</tt>
 * instances, which includes previous/next links, individual page links, and event listeners
 * that add class names to the elements in the UI in response to state changes in the
 * observed paginator object.</p>
 * @constructor
 * @class Paginator.Controls
 */
Ojay.Paginator.extend(/** @scope Ojay.Paginator */{
    Controls: new JS.Class('Ojay.Paginator.Controls', /** @scope Ojay.Paginator.Controls.prototype */{
        extend: /** @scope Ojay.Paginator.Controls */{
            CONTAINER_CLASS:    'paginator-controls',
            PREVIOUS_CLASS:     'previous',
            NEXT_CLASS:         'next',
            PAGE_LINKS_CLASS:   'pages'
        },
        
        /**
         * <p>To initialize a <tt>Paginator.Controls</tt> instance, pass in the <tt>Paginator</tt>
         * to which you want the generated UI elements to apply.</p>
         * @param {Paginator}
         */
        initialize: function(paginator) {
            this._paginator = paginator;
            this._elements = {};
            this._paginator.on('pagecreate')._(this)._addPage();
            this._paginator.on('pagedestroy')._(this)._removePage();
        },
        
        /**
         * <p>Returns the collection of HTML elements used to implement the UI. When the
         * elements are first generated, all required event handlers (both DOM and
         * Observable-based) are set up.</p>
         * @returns {DomCollection}
         */
        getHTML: function() {
            if (this._paginator.inState('CREATED')) return null;
            var elements = this._elements, klass = this.klass, paginator = this._paginator;
            if (elements._container) return elements._container;
            var self = this;
            
            elements._container = Ojay( Ojay.HTML.div(
                {className: klass.CONTAINER_CLASS}, function(HTML) {
            
                // Previous button - decrements page
                elements._previous = Ojay( HTML.div(
                        {className: klass.PREVIOUS_CLASS},
                        'Previous') );
                
                // Page buttons - skip to individual pages
                elements._pageLinks = Ojay( HTML.div(
                    {className: klass.PAGE_LINKS_CLASS}, function(HTML) {
                    elements._pages = [];
                    paginator.getPages().times(function(page) {
                        var span = elements._pages[page] = self._makeLink(page+1);
                        HTML.concat(span.node);
                    });
                }) );
                
                // Next button - increments page
                elements._next = Ojay( HTML.div(
                        {className: klass.NEXT_CLASS},
                        'Next') );
            }) );
            
            elements._previous.on('click')._(paginator).decrementPage();
            elements._next.on('click')._(paginator).incrementPage();
            
            // Delegate page click events to the container
            elements._pageLinks.on('click', Ojay.delegateEvent({
                span: function(element, evnt) {
                    paginator.setPage(element.node.innerHTML);
                }
            }));
            
            // Add hover states to previous and next buttons
            var buttons = [elements._previous, elements._next];
            buttons.forEach(it().on('mouseover').addClass('hovered'));
            buttons.forEach(it().on('mouseout').removeClass('hovered'));
            
            // Monitor page changes to highlight page links
            paginator.on('pagechange', function(paginator, page) {
                this._highlightPage(page);
                buttons.forEach(it().removeClass('disabled'));
            }, this);
            var page = paginator.getCurrentPage();
            this._highlightPage(page);
            
            // Disable previous and next buttons at the ends of the run
            if (!paginator.isLooped()) {
                paginator.on('firstpage')._(elements._previous).addClass('disabled');
                paginator.on('lastpage')._(elements._next).addClass('disabled');
                if (page == 1) elements._previous.addClass('disabled');
                if (page == paginator.getPages()) elements._next.addClass('disabled');
            }
            
            elements._container.addClass(paginator.getDirection());
            return elements._container;
        },
        
        /**
         * <p>Creates and returns an element to use as a numbered page link.</p>
         * @param {Number} page
         * @returns {DomCollection}
         */
        _makeLink: function(page) {
            var link = Ojay( Ojay.HTML.span(String(page)) );
            link.on('mouseover').addClass('hovered');
            link.on('mouseout').removeClass('hovered');
            return link;
        },
        
        /**
         * <p>Responds to the <tt>pagecreate</tt> event on the associated <tt>Paginator</tt>
         * instance by adding a new page link to the list.</p>
         */
        _addPage: function() {
            var link = this._makeLink(this._paginator.getPages());
            this._elements._pages.push(link);
            this._elements._pageLinks.insert(link, 'bottom');
            this._elements._next.removeClass('disabled');
        },
        
        /**
         * <p>Responds to the <tt>pagedestroy</tt> event on the associated <tt>Paginator</tt>
         * instance removing the final page link from the list.</p>
         */
        _removePage: function() {
            this._elements._pages.pop().remove();
            var pager = this._paginator;
            if (pager.isLooped()) return;
            if (pager.getCurrentPage() == pager.getPages())
                this._elements._next.addClass('disabled');
        },
        
        /**
         * <p>Adds the class 'selected' to the current page number.</p>
         * @param {Number}
         */
        _highlightPage: function(page) {
            var page = this._elements._pages[page - 1];
            this._elements._pages.forEach({removeClass: 'selected'});
            if (page) page.addClass('selected');
        },
        
        /**
         * <p>Returns a reference to the 'previous' button.</p>
         * @returns {DomCollection}
         */
        getPreviousButton: function() {
            if (this._paginator.inState('CREATED')) return null;
            return this._elements._previous;
        },
        
        /**
         * <p>Returns a reference to the 'next' button.</p>
         * @returns {DomCollection}
         */
        getNextButton: function() {
            if (this._paginator.inState('CREATED')) return null;
            return this._elements._next;
        },
        
        /**
         * <p>Returns a reference to the collection of page number links.</p>
         * @returns {DomCollection}
         */
        getPageButtons: function() {
            if (this._paginator.inState('CREATED')) return null;
            return this._elements._pageLinks;
        }
    })
});
