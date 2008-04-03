var Gallery = JS.Class({
    
    initialize: function(id) {
        this.elementID = id;
    },
    
    getInitialState: function() {
        return {
            page: 1,
            popupVisible: true,
            popupID: 0
        };
    },
    
    changeState: function(state) {
        if (state.page !== undefined) this.setPage(state.page);
        if (state.popupVisible !== undefined) this.setBoxState(state.popupVisible);
    },
    
    setup: function() {
        this.element = Ojay('#' + this.elementID);
        var html = Ojay.HTML.div(function(html) {
            this.display = html.div();
            html.ul(function(html) {
                this.prevControl = Ojay(html.li('Previous'));
                this.nextControl = Ojay(html.li('Next'));
            }.bind(this));
            this.checkbox = Ojay(html.input({type: 'checkbox', id: this.elementID + 'radio'}));
            html.label({'htmlFor': this.elementID + 'radio'}, 'Visible?');
        }.bind(this));
        this.element.setContent(html);
        this.registerEventListeners();
        this.state = this.getInitialState();
        this.pages = 'Some pages'.split('');
        this.setPage(this.state.page);
        this.setBoxState(this.state.popupVisible);
    },
    
    registerEventListeners: function() {
        this.prevControl.on('click', this.decrementPage, this);
        this.nextControl.on('click', this.incrementPage, this);
        this.checkbox.on('click', this.toggleBox, this);
    },
    
    decrementPage: function() {
        if (this.state.page > 1)
            this.changeState({page: this.state.page - 1});
    },
    
    incrementPage: function() {
        if (this.state.page < this.pages.length)
            this.changeState({page: this.state.page + 1});
    },
    
    setPage: function(n) {
        this.state.page = Number(n);
        this.display.innerHTML = this.state.page;
    },
    
    toggleBox: function() {
        this.state.popupVisible = !!this.checkbox.node.checked;
        this.changeState({popupVisible: this.state.popupVisible});
    },
    
    setBoxState: function(val) {
        this.checkbox.node.checked = val;
    }
});
