// validators.js

function validateCustomer(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required and must be a string');
  } else {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Email is not valid');
    }
  }

  if (data.phone && typeof data.phone !== 'string') {
    errors.push('Phone must be a string if provided');
  }

  return errors.length > 0 ? errors : null;
}

function validateOrder(data) {
  const errors = [];

  if (!data.customerId || typeof data.customerId !== 'string') {
    errors.push('Customer ID is required and must be a string');
  }

  if (!Array.isArray(data.products) || data.products.length === 0) {
    errors.push('Products must be a non-empty array');
  } else {
    data.products.forEach((product, index) => {
      if (!product.name || typeof product.name !== 'string') {
        errors.push(`Product ${index + 1}: Name is required and must be a string`);
      }
      if (typeof product.price !== 'number' || product.price < 0) {
        errors.push(`Product ${index + 1}: Price must be a non-negative number`);
      }
      if (!Number.isInteger(product.quantity) || product.quantity < 1) {
        errors.push(`Product ${index + 1}: Quantity must be an integer >= 1`);
      }
    });
  }

  if (typeof data.amount !== 'number' || data.amount < 0) {
    errors.push('Amount must be a non-negative number');
  }

  if (data.status && !['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(data.status)) {
    errors.push('Status must be one of PLACED, PROCESSING, SHIPPED, DELIVERED, CANCELLED');
  }

  if (data.notes && typeof data.notes !== 'string') {
    errors.push('Notes must be a string if provided');
  }

  if (data.createdAt && isNaN(new Date(data.createdAt).getTime())) {
    errors.push('createdAt must be a valid date if provided');
  }

  return errors.length > 0 ? errors : null;
}


module.exports = {
  validateCustomer,
  validateOrder,
};
