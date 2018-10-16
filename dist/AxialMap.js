'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AxialMap = function () {
  /**
   * @param {Object} opts
   *
   * @return {void}
   */
  function AxialMap() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, AxialMap);

    this.map = new Map();
    this.maxSize = opts.maxSize || Infinity;
    this.size = 0;
    this.keys = [];
    this.cursor = -1;
  }

  _createClass(AxialMap, [{
    key: 'keyIsValid',
    value: function keyIsValid(key) {
      var isString = typeof key === 'string' || key instanceof String;
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

  }, {
    key: 'add',
    value: function add(key, object) {
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

  }, {
    key: 'fifo',
    value: function fifo() {
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

  }, {
    key: 'firstKey',
    value: function firstKey() {
      return this.keys[0] || null;
    }

    /**
     * Returns the first item in the map.
     *
     * @return {any|null}
     */

  }, {
    key: 'first',
    value: function first() {
      return this.map.has(this.firstKey()) ? this.map.get(this.firstKey()) : null;
    }

    /**
     * Return the (n)th key of the keys array.
     *
     * @param {integer} n
     *
     * @return {string|null}
     */

  }, {
    key: 'nthKey',
    value: function nthKey(n) {
      return this.keys[n - 1] || null;
    }

    /**
     * Returns the (n)th item of the map or null.
     *
     * @param {*} n
     *
     * @return {any|null}
     */

  }, {
    key: 'nth',
    value: function nth(n) {
      return this.map.has(this.nthKey(n)) ? this.map.get(this.nthKey(n)) : null;
    }

    /**
     * Returns the last key of the keys array
     *
     * @return {string|null}
     */

  }, {
    key: 'lastKey',
    value: function lastKey() {
      return this.keys[this.keys.length - 1] || null;
    }

    /**
     * Returns the last item of the map or null.
     *
     * @param {*} n
     *
     * @return {any|null}
     */

  }, {
    key: 'last',
    value: function last() {
      return this.map.has(this.lastKey()) ? this.map.get(this.lastKey()) : null;
    }

    /**
     * Get an item from the map given its key.
     *
     * @param {string} key
     *
     * @return {any|null}
     */

  }, {
    key: 'get',
    value: function get(key) {
      return this.map.has(key) ? this.map.get(key) : null;
    }

    /**
     * Set the cursor to the position of `key` in the keys array.
     *
     * @param {string} key
     *
     * @return {void}
     */

  }, {
    key: 'setCursor',
    value: function setCursor(key) {
      var index = this.keys.indexOf(key);
      this.cursor = index !== -1 ? index : -1;
    }

    /**
     * Returns the item of the map that corresponds to the current cursor location.
     *
     * @return {any|null}
     */

  }, {
    key: 'current',
    value: function current() {
      var key = this.keys[this.cursor];
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

  }, {
    key: 'nextOrLast',
    value: function nextOrLast() {
      this.cursor = this.cursor < this.keys.length - 1 ? this.cursor + 1 : this.cursor;
      return this.current();
    }

    /**
     * Advances the cursor and returns the next item. If the "next" item is out of
     * bounds `null` is returned.
     *
     * @return {any|null}
     */

  }, {
    key: 'next',
    value: function next() {
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

  }, {
    key: 'previousOrFirst',
    value: function previousOrFirst() {
      this.cursor = this.cursor > 0 ? this.cursor - 1 : this.cursor;
      return this.current();
    }

    /**
     * Rolls back the cursor 1 position and returns the next item. If the "previous"
     * item is out of bounds `null` is returned.
     *
     * @return {any|null}
     */

  }, {
    key: 'previous',
    value: function previous() {
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

  }, {
    key: 'slice',
    value: function slice(start) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;

      var key = this.keys[start];
      if (!key) {
        return [];
      }

      this.setCursor(key);
      var output = [[key, this.current()]];
      for (var i = this.cursor + 1; i < end; i += 1) {
        var nextItem = this.next();
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

  }, {
    key: 'splice',
    value: function splice(start) {
      var deleteCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;

      var key = this.keys[start];
      if (!key) {
        return [];
      }

      this.setCursor(key);
      var output = [this.remove(key)];
      for (var i = this.cursor; i < deleteCount; i += 1) {
        var nextItem = this.next();
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

  }, {
    key: 'remove',
    value: function remove(key) {
      if (this.map.has(key)) {
        var element = this.map.get(key);
        this.map.delete(key);
        var index = this.keys.indexOf(key);
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

  }, {
    key: 'each',
    value: function each(callback) {
      if (typeof callback !== 'function') {
        throw new Error('A callback function must be supplied as the only parameter.');
      }

      var iterator = this.map.entries();
      var keyPair = iterator.next();
      var index = 0;
      while (!keyPair.done) {
        callback(keyPair.value[1], keyPair.value[0], index);
        index += 1;
        keyPair = iterator.next();
      }
    }

    /**
     * Reset the AxialMap to it's initial state. The `maxSize` property is maintained.
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.map = new Map();
      this.size = 0;
      this.keys = [];
      this.cursor = -1;
    }
  }]);

  return AxialMap;
}();

module.exports = AxialMap;