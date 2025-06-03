import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import RuleBuilder from './RuleBuilder';

const SegmentForm = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      rules: [],
      logicOperator: 'AND'
    }
  });
  
  const [rules, setRules] = useState(initialData?.rules || []);
  const [logicOperator, setLogicOperator] = useState(initialData?.logicOperator || 'AND');

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      rules,
      logicOperator
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6"> {/* Increased spacing */}
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Segment Name *
          </label>
          <input
            {...register('name', { 
              required: 'Segment name is required',
              maxLength: {
                value: 60,
                message: 'Name should not exceed 60 characters'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 p-2"
            placeholder="e.g. High-Value Customers, Inactive Users"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Enhanced Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
            <span className="text-xs text-gray-500 ml-1">(optional)</span>
          </label>
          <textarea
            {...register('description', {
              maxLength: {
                value: 250,
                message: 'Description should not exceed 250 characters'
              }
            })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 p-2"
            placeholder="Describe the purpose of this segment (e.g. 'Customers who spent over $100 in the last 30 days')"
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Help your team understand who belongs in this segment
              </p>
            )}
          </div>
        </div>
      </div>

      <RuleBuilder 
        rules={rules} 
        setRules={setRules} 
        logicOperator={logicOperator}
        setLogicOperator={setLogicOperator}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Segment' : 'Create Segment'}
        </Button>
      </div>
    </form>
  );
};

export default SegmentForm;