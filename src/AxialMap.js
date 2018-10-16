class AxialMap {
  /**
   * @param {Object} opts
   *
   * @return {void}
   */
  constructor(opts = {}) {
    this.map = new Map();
    this.maxSize = opts.maxSize || Infinity;
    this.size = 0;
    this.keys = [];
    this.cursor = -1;
  }

  keyIsValid(key) {
    var isString = (typeof key === 'string' || key instanceof String);
    if (!isString && !Number.isInteger(key)) {
      throw new Error('Key must be an integer or a string.');
    }
  }

  /**
   * @param  {string|integer} key
   * @param  {any} object
   *
   * @return {void}
   */
  add(key, object) {
    this.keyIsValid(key);
    // Don't push a new element to the keys stack if it's an update.
    if (this.keys.indexOf(key) === -1) {
      this.keys.push(key);
    }

    this.map.set(key, object);
    this.size = this.map.size;
    this.fifo();
  }

  /**
   * First in first out. Remove the oldest item from the map and the keys array
   *
   * @return {void}
   */
  fifo() {
    if (this.map.size > this.maxSize) {
      this.remove(this.firstKey());
    }
    this.size = this.map.size;
  }

  /**
   * Returns the first key of the keys array or null.
   *
   * @return {string|null}
   */
  firstKey() {
    return this.keys[0] || null;
  }

  /**
   * Returns the first item in the map.
   *
   * @return {any|null}
   */
  first() {
    return this.map.has(this.firstKey()) ? this.map.get(this.firstKey()) : null;
  }

  /**
   * Return the (n)th key of the keys array.
   *
   * @param {integer} n
   *
   * @return {string|null}
   */
  nthKey(n) {
    return this.keys[n - 1] || null;
  }

  /**
   * Returns the (n)th item of the map or null.
   *
   * @param {*} n
   *
   * @return {any|null}
   */
  nth(n) {
    return this.map.has(this.nthKey(n)) ? this.map.get(this.nthKey(n)) : null;
  }

  /**
   * Returns the last key of the keys array
   *
   * @return {string|null}
   */
  lastKey() {
    return this.keys[this.keys.length - 1] || null;
  }

  /**
   * Returns the last item of the map or null.
   *
   * @param {*} n
   *
   * @return {any|null}
   */
  last() {
    return this.map.has(this.lastKey()) ? this.map.get(this.lastKey()) : null;
  }

  /**
   * Get an item from the map given its key.
   *
   * @param {string} key
   *
   * @return {any|null}
   */
  get(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }

  /**
   * Set the cursor to the position of `key` in the keys array.
   *
   * @param {string} key
   *
   * @return {void}
   */
  setCursor(key) {
    const index = this.keys.indexOf(key);
    this.cursor = index !== -1 ? index : -1;
  }

  /**
   * Returns the item of the map that corresponds to the current cursor location.
   *
   * @return {any|null}
   */
  current() {
    const key = this.keys[this.cursor];
    return key !== undefined ? this.get(key) : null;
  }

  /**
   * Advances the cursor from its current position and returns the item of the map
   * that corresponds with the new cursor position. If the cursor would advance out
   * of bounds, then the current position (the last position) is maintained and
   * that item is returned.
   *
   * `null` is returned if the map is empty.
   *
   * @return {any|null}
   */
  nextOrLast() {
    this.cursor = this.cursor < this.keys.length - 1 ? this.cursor + 1 : this.cursor;
    return this.current();
  }

  /**
   * Advances the cursor and returns the next item. If the "next" item is out of
   * bounds `null` is returned.
   *
   * @return {any|null}
   */
  next() {
    if (!this.keys[this.cursor + 1]) {
      return null;
    }
    this.cursor += 1;
    return this.current();
  }

  /**
   * Rolls back the cursor 1 position from its current position and returns the
   * item of the map that corresponds with the new cursor position. If the cursor
   * would roll back out of bounds, then the current position (the first position)
   * is maintained and that item is returned.
   *
   * `null` is returned if the map is empty.
   *
   * @return {any|null}
   */
  previousOrFirst() {
    this.cursor = this.cursor > 0 ? this.cursor - 1 : this.cursor;
    return this.current();
  }

  /**
   * Rolls back the cursor 1 position and returns the next item. If the "previous"
   * item is out of bounds `null` is returned.
   *
   * @return {any|null}
   */
  previous() {
    if (!this.keys[this.cursor - 1]) {
      return null;
    }
    this.cursor -= 1;
    return this.current();
  }

  /**
   * Copies a selection of the map and returns a multidimensional array containing
   * keys and items from `start` to `end` exclusive.
   *
   * @param {integer} start
   * @param {integer} end
   *
   * @return {Array}
   */
  slice(start, end = Infinity) {
    const key = this.keys[start];
    if (!key) {
      return [];
    }

    this.setCursor(key);
    const output = [[key, this.current()]];
    for (let i = this.cursor + 1; i < end; i += 1) {
      const nextItem = this.next();
      if (!nextItem) {
        break;
      }
      output.push([this.keys[this.cursor], nextItem]);
    }

    return output;
  }

  /**
   * Removes a group of items from `start` to `end` exclusive. The removed items
   * are returned as a multidimensional array containing keys and items.
   *
   * @param {integer} start
   * @param {integer} deleteCount
   */
  splice(start, deleteCount = Infinity) {
    const key = this.keys[start];
    if (!key) {
      return [];
    }

    this.setCursor(key);
    const output = [this.remove(key)];
    for (let i = this.cursor; i < deleteCount; i += 1) {
      const nextItem = this.next();
      if (!nextItem) {
        break;
      }
      output.push(this.remove(this.keys[this.cursor]));
    }

    return output;
  }

  /**
   * Removes and returns an element from the map given its key.
   *
   * @param {string|integer} key
   *
   * @return {Array|null}
   */
  remove(key) {
    if (this.map.has(key)) {
      const element = this.map.get(key);
      this.map.delete(key);
      const index = this.keys.indexOf(key);
      if (index > -1) {
        this.keys.splice(index, 1);
        this.size = this.map.size;
      }
      // check the cursor
      if (this.keys[this.cursor] && this.cursor > -1) {
        this.cursor -= 1;
      }

      return [key, element];
    }
    return null;
  }

  /**
   * Will iterate over each item in the map invoking the provided callback. The
   * callback is provided three arguments. The element itself, the key, and the
   * iteration number (index).
   *
   * @param {function} callback
   *
   * @return {void}
   */
  each(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function must be supplied as the only parameter.');
    }

    const iterator = this.map.entries();
    let keyPair = iterator.next();
    let index = 0;
    while (!keyPair.done) {
      callback(keyPair.value[1], keyPair.value[0], index);
      index += 1;
      keyPair = iterator.next();
    }
  }

  /**
   * Reset the AxialMap to it's initial state. The `maxSize` property is maintained.
   */
  reset() {
    this.map = new Map();
    this.size = 0;
    this.keys = [];
    this.cursor = -1;
  }
}

module.exports = AxialMap;
