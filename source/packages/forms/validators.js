JS.extend(Ojay, /** @scope Ojay */ {
    /**
     * @param {String} value
     * @returns {Boolean}
     */
    isBlank: function(value) {
        return value ? false : (String(value).trim() == '');
    },
    
    /**
     * @param {String} value
     * @returns {Boolean}
     */
    isNumeric: function(value) {
        return this.NUMBER_FORMAT.test(String(value));
    },
    
    /**
     * @param {String} value
     * @returns {Boolean}
     */
    isEmailAddress: function(value) {
        return this.EMAIL_FORMAT.test(String(value));
    },
    
    /**
     * <p>JSON number definition from http://json.org</p>
     */
    NUMBER_FORMAT: /^\-?(0|[1-9]\d*)(\.\d+)?(e[\+\-]?\d+)?$/i,
    
    /**
     * <p>Format for valid email addresses from http://www.regular-expressions.info/email.html</p>
     */
    EMAIL_FORMAT: /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/i
});

Ojay.Forms = function(description) {
    description.call(DSL);
};

Ojay.Forms.getLabel = function(input) {
    input = Ojay(input);
    if (!input.node) return null;
    var label = input.ancestors('label');
    if (label.node) return label.at(0);
    var id = input.node.id;
    label = [].filter.call(document.getElementsByTagName('label'), function(label) { return id && label.htmlFor == id; });
    return Ojay(label.slice(0,1));
};
