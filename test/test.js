var should = require("should");

describe('CloseColl', function() {
    var Closest = require('../closecoll.js');
    var closest = new Closest();
    describe('add()', function() {
        it('should increase the length of the array', function() {
            closest.add(1, 5, 9);
            closest.points.length.should.equal(3);
            closest.add([10,15]);
            closest.points.length.should.equal(5);
            closest.add(20);
            closest.points.length.should.equal(6);
        });
    });
    describe('has()', function() {
        it('should recognize existing points', function() {
            closest.has(5).should.be.ok;
            closest.has(6).should.not.be.ok;
        });
    });
    describe('get()', function() {
        it('should return the closest point based on the given threshold', function() {
            closest.get(8, 0.5).should.equal(9);
            closest.get(1, 0).should.equal(1);
            should.not.exist(closest.get(12, 0));
            closest.get(12, 0.5).should.equal(10);
        });
    });
});
