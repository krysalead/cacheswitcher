var assert = require('assert');
var UnderTest = require('../index');
describe('memory cache', function () {
    it('returns a value set', async function () {
        var underTest = UnderTest('memory');
        var value = 'My value';
        var key = 'my.key';
        await underTest.set(key, value);
        var result = await underTest.get(key);
        assert.equal(value, result);
    });

    it('doesnot return a value when not set', async function () {
        var underTest = UnderTest('memory');
        var result = await underTest.get('not.my.key');
        assert.equal(result, null);
    });

    it('doesnot return a value when unset', async function () {
        var underTest = UnderTest('memory');
        var value = 'My value';
        var key = 'my.temporary.key';
        await underTest.set(key, value);
        await underTest.unset(key, value);
        var result = await underTest.get(key);
        assert.equal(result, null);
    });
});

describe('redis cache', function () {
    it('return a value set in the cache', async function () {
        var underTest = UnderTest('redis',{server:'172.16.238.61',port:6379});
        var value = 'My value';
        var key = 'my.key';
        await underTest.set(key, value);
        var result = await underTest.get(key);
        assert.equal(result, value);
        underTest.close();
    });

    it('doesnot return a value when not set', async function () {
        var underTest = UnderTest('redis',{server:'172.16.238.61',port:6379});
        var result = await underTest.get('not.my.key');
        assert.equal(result, null);
        underTest.close();
    });

    it('doesnot return a value when unset', async function () {
        var underTest = UnderTest('redis',{server:'172.16.238.61',port:6379});
        var value = 'My value';
        var key = 'my.temporary.key';
        await underTest.set(key, value);
        await underTest.unset(key, value);
        var result = await underTest.get(key);
        assert.equal(result, null);
        underTest.close();
    });
});