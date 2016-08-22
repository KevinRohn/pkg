#!/usr/bin/env node

let path = require('path');
let assert = require('assert');
let utils = require('../../utils.js');
let enclose = require('../../').exec;

assert(!module.parent);
assert(__dirname === process.cwd());

let flags = process.argv.slice(2);
let input = './test-x-index.js';
let output = './run-time/test-output.exe';

let left, right;
utils.mkdirp.sync(path.dirname(output));

left = utils.spawn.sync(
  'node', [ path.basename(input) ],
  { cwd: path.dirname(input) }
);

enclose.sync(flags.concat([
  '--output', output, input
]));

right = utils.spawn.sync(
  './' + path.basename(output), [],
  { cwd: path.dirname(output) }
);

// это директории. под
// виндой они case-insensitive
left = left.toLowerCase();
right = right.toLowerCase();

left = left.split('\n');
right = right.split('\n');

assert.equal(left.length, right.length);
assert(left.length > 100);

left.some(function (leftValue, index) {
  let rightValue = right[index];
  if (leftValue.slice(1, 3) === ':\\') {
    assert.equal(rightValue.slice(1, 3), ':\\');
    leftValue = leftValue.slice(0, 3) + 'thebox\\' + leftValue.slice(3);
    assert.equal(leftValue, rightValue);
  } else
  if (leftValue.slice(0, 1) === '/') {
    assert.equal(rightValue.slice(0, 1), '/');
    leftValue = '/thebox' + leftValue;
    assert.equal(leftValue, rightValue);
  } else
  if (leftValue === '') {
    assert.equal(leftValue, rightValue);
  } else
  if (leftValue === 'empty') {
    assert.equal(leftValue, rightValue);
  } else
  if (leftValue === 'string') {
    assert.equal(leftValue, rightValue);
  } else
  if (leftValue === 'object') {
    assert.equal(leftValue, rightValue);
  } else
  if (leftValue === 'function') {
    assert.equal(leftValue, rightValue);
  } else
  if (leftValue === 'true') {
    assert.equal(leftValue, rightValue);
  } else
  if (leftValue === 'false') {
    assert.equal(leftValue, rightValue);
  } else
  if (leftValue === 'null') {
    assert.equal(leftValue, rightValue);
  } else {
    console.log(leftValue, rightValue);
    assert(false);
  }
});

utils.vacuum.sync(path.dirname(output));