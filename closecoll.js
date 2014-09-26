/**
 * A module for a collection class of numbers that allows search by nearest
 * number.
 *
 * @module closecoll
 */
(function(name, context, definition) { 
    if(typeof module !== 'undefined' && module.exports) module.exports = definition();
    else if(typeof define === 'function' && define.amd) define(definition);
    else context[name] = definition();
})('CloseColl', this, function() {
    // utility function for determining data types
    function is(t, o) {
        t = t.toLowerCase();
        var type = Object.prototype.toString.call(o).toLowerCase().slice(8, -1);
        return type == t;
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

    /**
     * Get point closest to given point in array of numbers
     *
     * @method nearest
     * @static
     * @param {Number|Array} p Point(s) to compare
     * @param {Array} a Array of sorted numbers
     * @param {Number} [thresh] Closeness threshold
     * @param {Boolean} [sort] Whether to auto-sort array
     * @return {Number|Array} Point(s) closest to argument(s)
     */
    CloseColl.nearest = function(p, a, thresh, sort) {
        sort = is('undefined', sort) ? true : !!sort; // auto-sort by default
        if(is('array', p)) {
            var coll = [];
            for(var i = 0, l = p.length; i < l; i++) {
                var pt = p[i];
                if(is('number', pt)) coll.push(CloseColl.nearest(pt, a, thresh, false));
            }
            return coll;
        } else if(is('number', p)) {
            thresh = !is('number', thresh) ? 0.5 : Math.abs(thresh);
            if(thresh > 0.5) thresh = 0.5;
            for(var i = 0, l = a.length; i < l; i++) {
                var pt = a[i];
                var low = i == 0 ? pt : pt - ((pt - a[i - 1]) * thresh);
                var high = i >= l - 1 ? pt : (pt + ((a[i + 1] - pt) * thresh));
                if(p >= low && p <= high) return pt;
            }
        }

        return null;
    };

    /**
     * Add a point to the collection
     *
     * @method add
     * @chainable
     * @param {Number|Array} p Point(s) to add to the collection
     */
    CloseColl.prototype.add = function(p) {
        if(is('array', p)) {
            for(var i = 0, l = p.length; i < l; i++) {
                this.add(p[i]);
            }
        } else if(arguments.length > 1) {
            this.add(Array.prototype.slice.call(arguments));
        } else if(is('number', p)) {
            if(this.has(p)) return this;
            this.points.push(p);
            this.points.sort(numericSort);
        }
        return this;
    };

    /**
     * Check if a point exists in the collection
     *
     * @method has
     * @param {Number} p Point to check for
     * @return {Boolean} Whether point exists
     */
    CloseColl.prototype.has = function(p) {
        if(!arguments.length) return false;

        for(var i = 0, l = this.points.length; i < l; i++) {
            var pt = this.points[i];
            if(pt == p) return true;
            if(pt > p) return false;
        }

        return false;
    };

    /**
     * Get the point closest to given point
     *
     * @method get
     * @param {Number} p Point to compare
     * @param {Number} [thresh] Comparison threshold (0-0.5)
     * @return {Number} Point closest to argument
     */
    CloseColl.prototype.get = function(p, thresh) {
        if(!arguments.length) return this.points;
        return CloseColl.nearest(p, this.points, thresh, false);
    };

    /**
     * Get the point at index
     *
     * @method index
     * @param {Number} idx Index
     * @return {Number} Point at index
     */
    CloseColl.prototype.index = function(idx) {
        if(!is('number', idx)) return this.points;
        if(idx < 0 || idx >= this.points.length) return null;
        return this.points[parseInt(idx)];
    };

    return CloseColl;
});
