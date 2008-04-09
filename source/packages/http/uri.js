/**
 * @constructor
 * @class URI
 */
Ojay.URI = JS.Class({
    extend: {
        /**
         * @param {String} string
         * @returns {URI}
         */
        parse: function(string) {
            if (string instanceof this) return string;
            var uri = new this;
            
            string = String(string).trim()
                .replace(/^\w+:\/+/, function(match) { uri.protocol = match; return ''; })
                .replace(/^[^\/]+/, function(match) { uri.domain = match; return ''; })
                .replace(/^[^\?]+/, function(match) { uri.path = match; return ''; })
                .replace(/#.*$/, function(match) { uri.hash = match.slice(1); return ''; });
            
            if (/^\?/.test(string)) string.slice(1).split('&').forEach(function(pair) {
                var bits = pair.split('=').map(decodeURIComponent).map('trim');
                uri.params[bits[0]] = bits[1] || '';
            });
            return uri;
        },
        
        /**
         * @param {String|URI} a
         * @param {String|URI} b
         * @returns {Boolean}
         */
        compare: function(a,b) {
            return this.parse(a).equals(b);
        }
    },
    
    /**
     */
    initialize: function() {
        this.params = {};
    },
    
    /**
     * @returns {String}
     */
    toString: function() {
        var string = (this.protocol||'') + (this.domain||'') + (this.path||''), params = [];
        for (var key in this.params)
            params.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.params[key]));
        if (params.length) string += '?' + params.join('&');
        if (this.hash) string += '#' + this.hash;
        return string;
    },
    
    /**
     * @param {String|URI} uri
     * @returns {Boolean}
     */
    equals: function(uri) {
        uri = this.klass.parse(uri);
        if (this.domain != uri.domain || this.protocol != uri.protocol ||
                this.path != uri.path || this.hash != uri.hash) return false;
        if (!this.paramsEqual(uri)) return false;
        return true;
    },
    
    /**
     * @param {String|URI} uri
     * @returns {Boolean}
     */
    paramsEqual: function(uri) {
        uri = this.klass.parse(uri);
        for (var key in this.params) { if (this.params[key] != uri.params[key]) return false; }
        for (key in uri.params) { if (this.params[key] != uri.params[key]) return false; }
        return true;
    }
});

JS.extend(String.prototype, {
    parseURI:   Ojay.URI.method('parse').methodize(),
    equalsURI:  Ojay.URI.method('compare').methodize()
});
