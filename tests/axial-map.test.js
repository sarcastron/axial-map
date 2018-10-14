const AxialMap = require('../src/axial-map');
const chai = require('chai');
const assert = chai.assert;

describe('Axial Map | Instantiation', () => {
  it('`maxSize` property defaults to `Infinity`.', () => {
    const testMap = new AxialMap();
    assert.strictEqual(testMap.maxSize, Infinity);
  });

  it('Should be able to be set with `maxSize` property.', () => {
    const testMap = new AxialMap({ maxSize: 20 });
    assert.strictEqual(testMap.maxSize, 20);
  });
});