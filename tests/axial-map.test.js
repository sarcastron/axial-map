const AxialMap = require('../src/AxialMap');
const chai = require('chai');
const assert = chai.assert;

let testData = [
  { timestamp: 1539550856, uri: 'https://fillmurray.com/g/200/300' },
  { timestamp: 1539550858, uri: 'https://fillmurray.com/200/300' },
  { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' },
  { timestamp: 1539550863, uri: 'https://fillmurray.com/600/200' },
  { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' },
];
const makeAxialMap = (maxSize = null) => {
  return testData.reduce((acc, item) => {
    acc.add(item.timestamp, item)
    return acc;
  }, new AxialMap(maxSize ? { maxSize } : undefined));
};

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
      const result = testMap.remove(1539550866);
      assert.strictEqual(testMap.size, 1);
      assert.strictEqual(testMap.keys.length, 1);
      assert.deepEqual(testMap.keys, [1539550896]);
      assert.deepEqual([
        1539550866,
        { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' }
      ], result);
    });

    it('Should return `null` when key is not a real key', () => {
      const result = testMap.remove('derp');
      assert.strictEqual(result, null);
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

  describe('- Keys and values', () => {
    let testMap;
    beforeEach(() => {
      testMap = makeAxialMap()
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

  describe('- First, last, an (n)th', () => {
    let testMap;
    beforeEach(() => {
      testMap = makeAxialMap();
    });

    it('Should be able to get the first key and item', () => {
      assert.equal(testMap.firstKey(), 1539550856);
      assert.deepEqual(
        testMap.first(),
        { timestamp: 1539550856, uri: 'https://fillmurray.com/g/200/300' }
      );
    });

    it('Should be able to get the last key and item', () => {
      assert.equal(testMap.lastKey(), 1539550866);
      assert.deepEqual(
        testMap.last(),
        { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' }
      );
    });

    it('Should be able to get the (n)th key and item', () => {
      assert.equal(testMap.nthKey(2), 1539550858);
      assert.deepEqual(
        testMap.nth(2),
        { timestamp: 1539550858, uri: 'https://fillmurray.com/200/300' }
      );
    });
  });

  describe('- Traverse', () => {
    let testMap;
    beforeEach(() => {
      testMap = makeAxialMap();
    });

    it("`next()` should be the first item if cursor isn't set", () => {
      assert.deepEqual(
        testMap.next(),
        { timestamp: 1539550856, uri: 'https://fillmurray.com/g/200/300' }
      );
      assert.equal(testMap.cursor, 0);
    });

    it("`nextOrLast()` should return the last item if there is no next item", () => {
      testMap.setCursor(1539550866);

      assert.deepEqual(
        testMap.nextOrLast(),
        { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' }
      );
      assert.equal(testMap.cursor, 4);
    });

    it("`current()` should be null if the cursor is set to -1", () => {
      assert.equal(testMap.cursor, -1);
      assert.deepEqual(testMap.current(), null);
    });

    it("`current()` should be the item at the cursor", () => {
      testMap.setCursor(1539550863);

      assert.equal(testMap.cursor, 3);
      assert.deepEqual(
        testMap.current(),
        { timestamp: 1539550863, uri: 'https://fillmurray.com/600/200' }
      );
    });

    it("`previous()` should return the previous items", () => {
      testMap.setCursor(1539550863);

      assert.deepEqual(
        testMap.previous(),
        { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' }
      );
      assert.equal(testMap.cursor, 2);
    });

    it("`previous()` should return the previous items", () => {
      testMap.setCursor(testMap.firstKey());

      assert.deepEqual(
        testMap.previous(),
        null
      );
      assert.equal(testMap.cursor, 0);
    });

    it("`previousOrFirst()` should be the 1st item if there is no previous item", () => {
      testMap.setCursor(1539550856);

      assert.deepEqual(
        testMap.previousOrFirst(),
        { timestamp: 1539550856, uri: 'https://fillmurray.com/g/200/300' }
      );
      assert.equal(testMap.cursor, 0);
    });
  });

  describe('- `slice`', () => {
    let testMap;
    beforeEach(() => {
      testMap = makeAxialMap();
    });

    it('`slice` should return empty array if start is out of bounds', () => {
      const result = testMap.slice(2000, 4);
      assert.deepEqual(result, []);
    });

    it('`slice` should return a segment of the map', () => {
      const result = testMap.slice(2, 4);
      assert.equal(result.length, 2);
      assert.deepEqual(result, [
        [
          1539550861,
          { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' },
        ],
        [
          1539550863,
          { timestamp: 1539550863, uri: 'https://fillmurray.com/600/200' },
        ],
      ]);
    });

    it('`slice` should return the rest of the map if the second param is empty', () => {
      const result = testMap.slice(2);
      assert.equal(result.length, 3);
      assert.deepEqual(result, [
        [
          1539550861,
          { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' },
        ],
        [
          1539550863,
          { timestamp: 1539550863, uri: 'https://fillmurray.com/600/200' },
        ],
        [
          1539550866,
          { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' },
        ],
      ]);
    });

    it('`slice` should return the rest of the map if the second param is out of bounds', () => {
      const result = testMap.slice(2, 100);
      assert.equal(result.length, 3);
      assert.deepEqual(result, [
        [
          1539550861,
          { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' },
        ],
        [
          1539550863,
          { timestamp: 1539550863, uri: 'https://fillmurray.com/600/200' },
        ],
        [
          1539550866,
          { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' },
        ],
      ]);
    });
  });

  describe('- `slice`', () => {
    let testMap;
    beforeEach(() => {
      testMap = makeAxialMap();
    });

    it('`splice` should return empty array if start is out of bounds', () => {
      const result = testMap.splice(2000, 4);
      assert.deepEqual(result, []);
    });

    it('`splice` should return a segment of the map', () => {
      const result = testMap.splice(2, 2);
      assert.equal(result.length, 2);
      assert.deepEqual(result, [
        [
          1539550861,
          { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' },
        ],
        [
          1539550863,
          { timestamp: 1539550863, uri: 'https://fillmurray.com/600/200' },
        ],
      ]);
      assert.equal(testMap.size, 3);
    });

    it('`splice` should return the rest of the map if the second param is empty', () => {
      const result = testMap.splice(3);
      assert.equal(result.length, 2);
      assert.deepEqual(result, [
        [
          1539550863,
          { timestamp: 1539550863, uri: 'https://fillmurray.com/600/200' },
        ],
        [
          1539550866,
          { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' },
        ],
      ]);
    });

    it('`splice` should return the rest of the map if the second param is out of bounds', () => {
      const result = testMap.splice(2, 2000);
      assert.equal(result.length, 3);
      assert.deepEqual(result, [
        [
          1539550861,
          { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' },
        ],
        [
          1539550863,
          { timestamp: 1539550863, uri: 'https://fillmurray.com/600/200' },
        ],
        [
          1539550866,
          { "timestamp": 1539550866, "uri": "https://fillmurray.com/640/480" },
        ],
      ]);
      assert.equal(testMap.size, 2);
    });
  });

  describe('- `each`', () => {
    let testMap;
    beforeEach(() => {
      testMap = makeAxialMap(5);
    });

    it('Should call the callback on each item with params `item`, `key`, and `index`', () => {
      let iterations = 0;
      let thirdItemArgs = null;
      testMap.each((item, key, index) => {
        if (index === 2) {
          thirdItemArgs = { item, key, index };
        }
        iterations += 1;
      });

      assert.equal(iterations, 5);
      assert.deepEqual(thirdItemArgs, {
        item: { timestamp: 1539550861, uri: 'https://fillmurray.com/200/200' },
        key: 1539550861,
        index: 2,
      });
    });

    it('Should throw and Error if the argument is not a function', () => {
      assert.throws(
        () => testMap.each('adfassdaf'),
        Error,
        'A callback function must be supplied as the only parameter.'
      );
    });
  });

  describe('- Rotating contents using mazSize', () => {
    let testMap;
    beforeEach(() => {
      testMap = makeAxialMap(5);
    });

    it('Should remove the first item if maxSize is exceeded', () => {
      testMap.add(1539550964, { herp: 'derp' });
      assert.equal(testMap.size, 5);
      assert.deepEqual(
        { timestamp: 1539550858, uri: 'https://fillmurray.com/200/300' },
        testMap.first()
      );
      assert.deepEqual(
        { herp: 'derp' },
        testMap.last()
      );
    });
  });

  describe('- Reset', () => {
    it('Should be able to reset the map', () => {
      const testMap = makeAxialMap();
      testMap.reset();
      assert.equal(testMap.size, 0);
      assert.deepEqual(testMap.first(), null);
      assert.deepEqual(testMap.keys, []);
    });

    it('Should be able to reset the map maintain `mazSize`', () => {
      const testMap = new AxialMap({ maxSize: 20 });
      testMap.add(
        1539550866,
        { timestamp: 1539550866, uri: 'https://fillmurray.com/640/480' }
      );
      testMap.add(
        1539550896,
        { timestamp: 1539550896, uri: 'https://fillmurray.com/g/600/200' }
      );
      testMap.setCursor(1539550896);

      testMap.reset();
      assert.equal(testMap.maxSize, 20);
      assert.equal(testMap.cursor, -1);
      assert.equal(testMap.size, 0);
      assert.deepEqual(testMap.first(), null);
      assert.deepEqual(testMap.keys, []);
    });
  });
});