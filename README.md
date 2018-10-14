# Axial Map

A wrapper for a JS native Map object to make traversing them a bit easier.

## Why?

This is an effort to combine the features of a native Javascript `Map` object with a double-linked list. Data within the structure can be accessed using a key like any normal JS object but can also maintain an order and be traversed using `next()` and `previous()` methods. A cursor can be set to prevent the need to loop through an entire object.

In addition to the traversability of the object a user can directly set the cursor to a specific key. Other convenience methods like `slice()`, `splice()`, and `each()` have been added.

## Rotating object store

The Axial Map can also be instantiated with a `maxSize` property. When the map is "full" and a new element is added to the map, the map will use an internal `fifo()` method (First In First Out) to remove the oldest element in the map. This is useful for keeping an ordered rotating map of data.
