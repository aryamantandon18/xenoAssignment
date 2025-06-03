import { motion } from 'framer-motion';
import { useState } from 'react';
import RuleCondition from './RuleCondition';

const RuleBuilder = ({ rules, setRules, logicOperator, setLogicOperator }) => {
  const [availableFields] = useState([
    { label: 'Total Spent', value: 'totalSpent', type: 'number' },
    { label: 'Visit Count', value: 'visitCount', type: 'number' },
    { label: 'Last Order Date', value: 'lastOrderAt', type: 'date' },
    { label: 'Email', value: 'email', type: 'string' },
    { label: 'Name', value: 'name', type: 'string' },
  ]);

  const [availableOperators] = useState([
    { label: '>', value: '>', types: ['number', 'date'] },
    { label: '<', value: '<', types: ['number', 'date'] },
    { label: '=', value: '=', types: ['number', 'date', 'string'] },
    { label: '!=', value: '!=', types: ['number', 'date', 'string'] },
    { label: '>=', value: '>=', types: ['number', 'date'] },
    { label: '<=', value: '<=', types: ['number', 'date'] },
    { label: 'Contains', value: 'CONTAINS', types: ['string'] },
    { label: 'Not Contains', value: 'NOT_CONTAINS', types: ['string'] },
  ]);

  const addRule = () => {
    setRules([
      ...rules,
      {
        field: availableFields[0].value,
        operator: availableOperators[0].value,
        value: '',
      },
    ]);
  };

  const updateRule = (index, updatedRule) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    setRules(newRules);
  };

  const removeRule = (index) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <label className="block text-sm font-medium text-gray-300">Match</label>
        <select
          value={logicOperator}
          onChange={(e) => setLogicOperator(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-300 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="AND" className="text-gray-700">All conditions (AND)</option>
          <option value="OR" className="text-gray-700">Any condition (OR)</option>
        </select>
      </div>

      <div className="space-y-3">
        {rules.map((rule, index) => (
          <RuleCondition
            key={index}
            rule={rule}
            index={index}
            availableFields={availableFields}
            availableOperators={availableOperators}
            updateRule={updateRule}
            removeRule={removeRule}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addRule}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Condition
      </button>
    </motion.div>
  );
};

export default RuleBuilder;