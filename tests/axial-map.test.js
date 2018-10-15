const AxialMap = require('../src/axial-map');
const chai = require('chai');
const assert = chai.assert;

let testData = [
  { timestamp: 1539550856, uri: 'https://fillmurray.com/g/200/300' },
  { timestamp: 1539550858, uri: 'https://fillmurray.com/200/300' },
  { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' },
  { timestamp: 1539550863, uri: 'https://fillmurray.com/600/200' },
  { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' },
];

describe('Axial Map', () => {
  describe('- Instantiation', () => {
    it('`maxSize` property defaults to `Infinity`.', () => {
      const testMap = new AxialMap();
      assert.strictEqual(testMap.maxSize, Infinity);
    });

    it('Should be able to be set with `maxSize` property.', () => {
      const testMap = new AxialMap({ maxSize: 20 });
      assert.strictEqual(testMap.maxSize, 20);
    });
  });

  describe('- Add and remove items', () => {
    const testMap = new AxialMap();
    it('Should be able to add an item.', () => {
      testMap.add(
        1539550866,
        { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' }
      );
      testMap.add(
        1539550896,
        { timestamp: 1539550896, uri: 'https://fillmurray.com/g/600/200' }
      );

      assert.strictEqual(testMap.size, 2);
      assert.strictEqual(testMap.keys.length, 2);
      assert.deepEqual(testMap.keys, [1539550866, 1539550896]);
    });

    it('Should be able to remove an item.', () => {
      testMap.remove(1539550866);
      assert.strictEqual(testMap.size, 1);
      assert.strictEqual(testMap.keys.length, 1);
      assert.deepEqual(testMap.keys, [1539550896]);
    });

    it('Should be throw an error if an key is not a integer or string', () => {
      assert.throws(
        () => testMap.add(['Invalid key'], { herp: 'derp' }),
        Error,
        'Key must be an integer or a string.'
      );

      assert.throws(
        () => testMap.add({ a: true }, { herp: 'derp' }),
        Error,
        'Key must be an integer or a string.'
      );

      assert.throws(
        () => testMap.add(1234.5, { herp: 'derp' }),
        Error,
        'Key must be an integer or a string.'
      );
    });
  });

  describe('- Keys and Values', () => {
    let map;
    beforeEach(() => {
      testMap = testData.reduce((acc, item) => {
        acc.add(item.timestamp, item)
        return acc;
      }, new AxialMap());
    });

    it('Should have the correct size.', () => {
      assert.strictEqual(testMap.size, 5);
    });

    it('Should have the correct keys', () => {
      assert.deepEqual(
        testMap.keys,
        [1539550856, 1539550858, 1539550861, 1539550863, 1539550866]
      );
      assert.deepEqual(
        Array.from(testMap.map.keys()),
        [1539550856, 1539550858, 1539550861, 1539550863, 1539550866]
      );
    });

    it('Should have the correct values', () => {
      assert.deepEqual(Array.from(testMap.map.values()), testData);
    });

    it('Should be able to get an item by key', () => {
      assert.deepEqual(
        testMap.get(1539550861),
        { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' }
      );
    });
  });
});