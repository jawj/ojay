Ojay.Paginator.extend({
    Controls: JS.Class({
        extend: {
            CONTAINER_CLASS:    'paginator-controls',
            PREVIOUS_CLASS:     'previous',
            NEXT_CLASS:         'next',
            PAGE_LINKS_CLASS:   'pages'
        },
        
        /**
         * @param {Paginator}
         */
        initialize: function(paginator) {
            this._paginator = paginator;
            this._elements = {};
        },
        
        /**
         * @returns {DomCollection}
         */
        getHTML: function() {
            if (this._paginator.inState('CREATED')) return null;
            var elements = this._elements, self = this, klass = this.klass, paginator = this._paginator;
            if (elements._container) return elements._container;
            
            elements._container = Ojay( Ojay.HTML.div({className: klass.CONTAINER_CLASS}, function(HTML) {
                
                // Previous button - decrements page
                elements._previous = Ojay( HTML.div({className: klass.PREVIOUS_CLASS}, 'Previous') );
                elements._previous.on('click')._(paginator).decrementPage();
                
                // Page buttons - skip to individual pages
                var div = Ojay( HTML.div({className: klass.PAGE_LINKS_CLASS}, function(HTML) {
                    elements._pages = [];
                    paginator.getPages().times(function(page) {
                        var span = elements._pages[page] = Ojay( HTML.span(page + 1) );
                        span.on('mouseover').addClass('hovered');
                        span.on('mouseout').removeClass('hovered');
                    });
                }) );
                
                // Delegate page click events to the container
                div.on('click', Ojay.delegateEvent({
                    span: function(element, evnt) {
                        paginator.setPage(element.node.innerHTML);
                    }
                }));
                
                // Next button - increments page
                elements._next = Ojay( HTML.div({className: klass.NEXT_CLASS}, 'Next') );
                elements._next.on('click')._(paginator).incrementPage();
                
                // Add hover states to previous and next buttons
                var buttons = [elements._previous, elements._next];
                buttons.forEach(it().on('mouseover').addClass('hovered'));
                buttons.forEach(it().on('mouseout').removeClass('hovered'));
                
                // Monitor page changes to highlight page links
                paginator.on('pagechange', function(paginator, page) {
                    self._highlightPage(page);
                    buttons.forEach(it().removeClass('disabled'));
                });
                var page = paginator.getCurrentPage();
                self._highlightPage(page);
                
                // Disable previous and next buttons at the ends of the run
                paginator.on('firstpage')._(elements._previous).addClass('disabled');
                paginator.on('lastpage')._(elements._next).addClass('disabled');
                if (page == 1) elements._previous.addClass('disabled');
                if (page == paginator.getPages()) elements._next.addClass('disabled');
            }) );
            
            return elements._container;
        },
        
        /**
         * @param {Number}
         */
        _highlightPage: function(page) {
            this._elements._pages.forEach({removeClass: 'selected'});
            this._elements._pages[page - 1].addClass('selected');
        }
    })
});
