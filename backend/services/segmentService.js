exports.evaluateCustomerAgainstSegment = (customer, segment) => {
  const { rules, logicOperator = 'AND' } = segment;
  
  // Convert string values to numbers for numeric comparisons
  const processedRules = rules.map(rule => {
    const numericFields = ['totalSpent', 'visitCount', 'age', 'purchaseCount'];
    const shouldConvertToNumber = numericFields.includes(rule.field) && 
                                ['>', '<', '>=', '<=', '=', '!='].includes(rule.operator);
    
    return {
      ...rule,
      value: shouldConvertToNumber ? Number(rule.value) : rule.value
    };
  });

  const evaluateRule = (rule) => {
    const { field, operator, value } = rule;
    const customerValue = customer[field];
    
    // Handle null/undefined customer values
    if (customerValue === null || customerValue === undefined) {
      return false;
    }

    switch (operator) {
      case '>': return Number(customerValue) > Number(value);
      case '<': return Number(customerValue) < Number(value);
      case '>=': return Number(customerValue) >= Number(value);
      case '<=': return Number(customerValue) <= Number(value);
      case '=': 
      case '==': // Added support for double equals
        return String(customerValue) === String(value);
      case '!=': 
        return String(customerValue) !== String(value);
      case 'IN': 
        return Array.isArray(value) && value.includes(customerValue);
      case 'NOT_IN': 
        return Array.isArray(value) && !value.includes(customerValue);
      case 'CONTAINS': 
        return String(customerValue).toLowerCase()
          .includes(String(value).toLowerCase());
      case 'NOT_CONTAINS':
        return !String(customerValue).toLowerCase()
          .includes(String(value).toLowerCase());
      default: 
        throw new Error(`Unsupported operator: ${operator}`);
    }
  };

  // Apply the logical operator
  if (logicOperator.toUpperCase() === 'AND') {
    return processedRules.every(evaluateRule);
  } else if (logicOperator.toUpperCase() === 'OR') {
    return processedRules.some(evaluateRule);
  } else {
    throw new Error(`Unsupported logical operator: ${logicOperator}`);
  }
};