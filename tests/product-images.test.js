import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getProductImages, getGalleryIndex } from '../src/functions/productImages.js';

test('products without pictures have an empty gallery', () => {
  assert.deepEqual(getProductImages({}, undefined), []);
  assert.deepEqual(getProductImages({ image_url: null }, []), []);
});
test('malformed gallery entries cannot become clickable pictures', () => {
  const valid = { image_id: 'a', image_url: '/a.jpg' };
  assert.deepEqual(getProductImages({}, [null, {}, { image_url: '' }, { image_url: '   ' }, valid]), [valid]);
});
test('a main image works without product_images rows', () => {
  assert.deepEqual(getProductImages({ image_url: '/main.jpg' }, []), [{ image_id: 'main', image_url: '/main.jpg' }]);
});
test('an existing main image is not duplicated or reordered', () => {
  const gallery = [{ image_id: 'a', image_url: '/main.jpg' }, { image_id: 'b', image_url: '/b.jpg' }];
  assert.deepEqual(getProductImages({ image_url: '/main.jpg' }, gallery), gallery);
});
test('stale, negative and invalid gallery indices reset safely', () => {
  for (const index of [-1, 4, NaN, undefined, 0.5]) assert.equal(getGalleryIndex(index, 2), 0);
  assert.equal(getGalleryIndex(1, 2), 1);
  assert.equal(getGalleryIndex(0, 0), 0);
});
