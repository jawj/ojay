/**
 * <p>The <tt>Forms.RadioButtons</tt> class can be used to 'hijack' sets of radio buttons to
 * make them easier to style using CSS. The radio inputs themselves become hidden (they are positioned
 * off-screen rather than hidden using <tt>display</tt> or <tt>visibility</tt>) and their labels
 * have their class names changed to mirror changes to the inputs as the user interacts with the form.</p>
 *
 * <p>This class is designed as a light-weight and unobtrusive replacement for <tt>YAHOO.util.ButtonGroup</tt>
 * for the simple case where you want to style your form inputs and retain programmatic access to them.
 * It encourages accessible markup through use of <tt>label</tt> elements, and does not alter the HTML
 * structure of your form in any way.</p>
 *
 * @constructor
 * @class Forms.RadioButtons
 */
Ojay.Forms.RadioButtons = JS.Class({
    /**
     * @param {String|HTMLElement|DomCollection} inputs
     */
    initialize: function(inputs) {
        this._items = Ojay(inputs).map(function(input) { return new this.klass.Item(this, input); }, this);
        if (this._items.map('_input.node.name').unique().length > 1)
            throw new Error('Attempt to create a RadioButtons object with radios of different names');
        this._checkedItem = this._items.filter('checked')[0] || null;
    },
    
    /**
     * <p>This method is used to make sure that only one input appears checked at any time. Items
     * must notify their group when they become checked so the group can uncheck the previously
     * checked item.</p>
     * @param {Forms.RadioButtons.Item} item
     */
    check: function(item) {
        var current = this._checkedItem;
        if (current && current != item) current.setChecked(false);
        this._checkedItem = item;
    },
    
    /**
     * <p>Returns the <tt>Item</tt> in the <tt>RadioButtons</tt> group with the given id or value.</p>
     * @param {String|Number} id
     * @returns {Forms.RadioButtons.Item}
     */
    getInput: function(id) {
        return this._items.filter(function(item) {
            return item._input.node.id == id || item._input.node.value == id;
        })[0];
    },
    
    /**
     * <p>Returns the current value of the radio button group.</p>
     * @returns {String}
     */
    getValue: function() {
        var item = this._items.filter('_input.node.checked')[0];
        return item ? item._input.node.value : null;
    },
    
    extend: {
        /**
         * @constructor
         * @class Forms.RadioButtons.Item
         */
        Item: JS.Class({
            include: ButtonStates,
            
            /**
             * @param {Forms.RadioButtons} group
             * @param {DomCollection} input
             */
            initialize: function(group, input) {
                if (!input || !input.node || input.node.type != 'radio')
                    throw new TypeError('Attempt to create a RadioButtons object with non-radio element');
                this._group = group;
                this._input = input;
                this.setupButton();
            }
        })
    }
});