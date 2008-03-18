(function(Event) {
    JS.extend(Ojay, /** @scope Ojay */{
        /**
         * <p>Pre-built callback that stops the default browser reaction to an event.</p>
         * @param {DomCollection} element
         * @param {Event} evnt
         */
        stopDefault: function(element, evnt) {
            Event.preventDefault(evnt);
        },
        
        /**
         * <p>Pre-built callback that stops the event bubbling up the DOM tree.</p>
         * @param {DomCollection} element
         * @param {Event} evnt
         */
        stopPropagate: function(element, evnt) {
            Event.stopPropagation(evnt);
        },
        
        /**
         * <p>Pre-built callback that both stops the default behaviour and prevents bubbling.</p>
         * @param {DomCollection} element
         * @param {Event} evnt
         */
        stopEvent: function(element, evnt) {
            Ojay.stopDefault(element, evnt);
            Ojay.stopPropagate(element, evnt);
        },
        
        /**
         * <p>Returns an event callback that checks the event target against each given CSS
         * selector and fires all the applicable callbacks. Based on prior ideas from:</p>
         *
         * <ul>
         *     <li>http://icant.co.uk/sandbox/eventdelegation/</li>
         *     <li>http://www.danwebb.net/2008/2/8/event-delegation-made-easy-in-jquery</li>
         * </ul>
         *
         * @param {Object} map
         * @returns {Function}
         */
        delegateEvent: function(map) {
            return function(element, evnt) {
                var target = evnt.getTarget();
                for (var selector in map) {
                    if (target.matches(selector)) Function.from(map[selector]).call(this, target, evnt);
                }
            };
        },
        
        _getTarget: function() { return Ojay(Event.getTarget(this)); }
    });
    
    Ojay.stopDefault.method     = Ojay.stopDefault.partial(null).methodize();
    Ojay.stopPropagate.method   = Ojay.stopPropagate.partial(null).methodize();
    Ojay.stopEvent.method       = Ojay.stopEvent.partial(null).methodize();
    
    ['onDOMReady', 'onContentReady', 'onAvailable'].forEach(function(method) {
        Ojay[method] = Event[method].bind(Event);
    });
})(YAHOO.util.Event);
