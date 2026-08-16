// utils/validateProduct.js

export function validateProduct(form) {
  const messages = [];

  // Name
  if (!form.name || typeof form.name !== 'string' || form.name.trim() === '') {
    messages.push('Product name is required and must be a non‑empty string.');
  } else if (form.name.trim().length < 2) {
    messages.push('Product name must be at least 2 characters.');
  }

  // Category ID – basic UUID check (allow any valid UUID, but not empty)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!form.category_id || !uuidRegex.test(form.category_id)) {
    messages.push('A valid category must be selected.');
  }

  // Description (optional, but if provided, shouldn't be just whitespace)
  if (form.description && typeof form.description === 'string' && form.description.trim() === '') {
    messages.push('Description cannot be only whitespace.');
  }

  // Price – must be a valid number >= 0
  if (form.price === '' || form.price === null || form.price === undefined) {
    messages.push('Price is required.');
  } else {
    const price = Number(form.price);
    if (isNaN(price) || price < 0) {
      messages.push('Price must be a non‑negative number.');
    }
  }

  // Stock – if provided, must be a non‑negative integer
  if (form.stock !== '' && form.stock !== null && form.stock !== undefined) {
    const stock = Number(form.stock);
    if (isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
      messages.push('Stock must be a non‑negative integer.');
    }
  }

  // Image URL – if provided, must be a valid URL (optional)
  if (form.image_url && typeof form.image_url === 'string' && form.image_url.trim() !== '') {
    try {
      new URL(form.image_url);
    } catch (_) {
      messages.push('Image URL is not a valid web address.');
    }
  }

  // is_active – must be a boolean (if present, but checkbox ensures it's a boolean)
  // No further check needed

  return {
    valid: messages.length === 0,
    messages
  };
}