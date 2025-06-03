import { motion } from 'framer-motion';
import { XIcon } from '@heroicons/react/outline';

const RuleCondition = ({
  rule,
  index,
  availableFields,
  availableOperators,
  updateRule,
  removeRule,
}) => {
  const currentField = availableFields.find(f => f.value === rule.field);
  const filteredOperators = availableOperators.filter(op => 
    op.types.includes(currentField?.type)
  );

  const handleFieldChange = (e) => {
    const newField = availableFields.find(f => f.value === e.target.value);
    updateRule(index, {
      field: e.target.value,
      operator: filteredOperators[0]?.value || '',
      value: ''
    });
  };

  const handleOperatorChange = (e) => {
    updateRule(index, {
      ...rule,
      operator: e.target.value,
      value: ''
    });
  };

  const handleValueChange = (e) => {
    updateRule(index, {
      ...rule,
      value: e.target.value
    });
  };

  return (
    <motion.div 
      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
        <div className="md:col-span-4">
          <select
            value={rule.field}
            onChange={handleFieldChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 text-sm"
          >
            {availableFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={rule.operator}
            onChange={handleOperatorChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 text-sm"
          >
            {filteredOperators.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <input
            type={currentField?.type === 'date' ? 'date' : 'text'}
            value={rule.value}
            onChange={handleValueChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 text-sm"
            placeholder={`Enter ${currentField?.label.toLowerCase()}`}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeRule(index)}
        className="text-gray-400 hover:text-red-500 transition-colors p-1"
        aria-label="Remove condition"
      >
        <XIcon className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

export default RuleCondition;