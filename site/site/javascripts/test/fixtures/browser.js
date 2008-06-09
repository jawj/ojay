var URLBrowser = new JS.Class({
    
    initialize: function(element) {
        this.elementID = element;
    },
    
    getInitialState: function() {
        return {
            url: 'http://othermedia.com'
        };
    },
    
    changeState: function(state) {
        this.setURL(state.url);
    },
    
    setup: function() {
        this.iframe = Ojay( Ojay.HTML.div() );
        this.iframe.setAttributes({width: 800, height: 400});
        this.element = Ojay( this.elementID );
        this.element.insert(this.iframe.node, 'after');
        this.element.on('click', Ojay.delegateEvent({
            a: function(element, evnt) {
                evnt.stopEvent();
                this.changeState({url: element.node.href});
            }
        }), this);
    },
    
    setURL: function(url) {
        this.iframe.setContent(Ojay.HTML.a({href: url}, url));
    }
});
