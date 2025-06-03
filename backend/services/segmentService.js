const operatorMap = {
  '>': '$gt',
  '<': '$lt',
  '>=': '$gte',
  '<=': '$lte',
  '=': '$eq',
  '!=': '$ne',
  'IN': '$in',
  'NOT_IN': '$nin',
  'CONTAINS': '$regex',
  'NOT_CONTAINS': '$not',
};

// Build MongoDB query from segment rules
exports.buildMongoQueryFromRules = (rules, logicOperator = 'AND') => {
  const conditions = rules.map(rule => {
    const { field, operator, value } = rule;
    
    // Handle special cases
    if (operator === 'CONTAINS' || operator === 'NOT_CONTAINS') {
      return {
        [field]: {
          [operatorMap[operator]]: new RegExp(value, 'i'),
        },
      };
    }
    
    // Handle date fields
    if (field.includes('At') || field === 'createdAt' || field === 'updatedAt') {
      const dateValue = new Date(value);
      return {
        [field]: {
          [operatorMap[operator]]: dateValue,
        },
      };
    }
    
    // Standard field handling
    return {
      [field]: {
        [operatorMap[operator]]: value,
      },
    };
  });

  return logicOperator === 'AND' 
    ? { $and: conditions } 
    : { $or: conditions };
};

// Evaluate customer against segment rules
exports.evaluateCustomerAgainstSegment = (customer, segment) => {
  const { rules, logicOperator } = segment;
  
  return rules[logicOperator.toLowerCase()]((rule) => {
    const { field, operator, value } = rule;
    const customerValue = customer[field];
    
    switch (operator) {
      case '>': return customerValue > value;
      case '<': return customerValue < value;
      case '>=': return customerValue >= value;
      case '<=': return customerValue <= value;
      case '=': return customerValue === value;
      case '!=': return customerValue !== value;
      case 'IN': return value.includes(customerValue);
      case 'NOT_IN': return !value.includes(customerValue);
      case 'CONTAINS': 
        return String(customerValue).toLowerCase().includes(String(value).toLowerCase());
      case 'NOT_CONTAINS':
        return !String(customerValue).toLowerCase().includes(String(value).toLowerCase());
      default: return false;
    }
  });
};