Ojay.Validation = function(description) {
    description.call(DSL);
};

JS.extend(Ojay.Validation, /** @scope Ojay.Validation */ {
    isPresent: function(value) {
        return String(value).trim() != '';
    },
    
    isNumber: function(value) {
        return this.NUMBER_FORMAT.test(String(value));
    },
    
    /**
     * <p>JSON number definition from http://json.org</p>
     */
    NUMBER_FORMAT:  /^\-?(0|[1-9]\d*)(\.\d+)?(e[\+\-]?\d+)?$/i
});
