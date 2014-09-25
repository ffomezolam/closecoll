/**
 * A module for a collection class of numbers that allows search by nearest
 * number.
 *
 * Disclaimer: Not sure if this is really the best way to implement this
 *
 * @module closecoll
 */
(function(name, context, definition) { 
    if(typeof module !== 'undefined' && module.exports) module.exports = definition();
    else if(typeof define === 'function' && define.amd) define(definition);
    else context[name] = definition();
})('CloseColl', this, function() {
    function isArray(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    }

    function numericSort(a, b) {
        return a - b;
    }

    /**
     * The CloseColl class
     *
     * @class CloseColl
     * @constructor
     */
    function CloseColl() {
        this.points = [];
    }

    CloseColl.prototype = {
        /**
         * Add a point to the collection
         *
         * @method add
         * @chainable
         * @param {Number|Array} p Point(s) to add to the collection
         */
        add: function(p) {
            if(isArray(p)) {
                for(var i = 0, l = p.length; i < l; i++) {
                    this.add(p[i]);
                }
            } else if(arguments.length > 1) {
                this.add(Array.prototype.slice.call(arguments));
            } else if(typeof p == 'number') {
                if(this.has(p)) return this;
                this.points.push(p);
                this.points.sort(numericSort);
            }
            return this;
        },

        /**
         * Check if a point exists in the collection
         *
         * @method has
         * @param {Number} p Point to check for
         * @return {Boolean} Whether point exists
         */
        has: function(p) {
            if(!arguments.length) return false;
            return !!this.get(p, 0);
        },

        /**
         * Get the point closest to given point
         *
         * @method get
         * @param {Number} p Point to compare
         * @param {Number} [thresh] Comparison threshold (0-0.5)
         * @return {Number} Point closest to argument
         */
        get: function(p, thresh) {
            if(!arguments.length) return this.points;
            if(isArray(p)) {
                var collection = [];
                for(var i = 0, l = p.length; i < l; i++) {
                    var item = p[i];
                    if(typeof item == 'number') {
                        collection.push(this.get(item, thresh));
                    }
                }
                return collection;
            } else if(typeof p == 'number') {
                thresh = thresh || 0;
                if(thresh > 0.5) thresh = 0.5;
                for(var i = 0, l = this.points.length; i < l; i++) {
                    var point = this.points[i];
                    var low = i <= 0 ? point : point - ((point - this.points[i - 1]) * thresh);
                    var high = i >= l - 1 ? point : point + ((this.points[i + 1] - point) * thresh);
                    if(p >= low && p <= high) return point;
                }
            }
            return null;
        },

        /**
         * Get the point at index
         *
         * @method index
         * @param {Number} idx Index
         * @return {Number} Point at index
         */
        index: function(idx) {
            if(typeof idx != 'number') return this.points;
            if(idx < 0 || idx >= this.points.length) return null;
            return this.points[parseInt(idx)];
        }
    };

    return CloseColl;
});
