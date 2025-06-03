import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import { getSegments } from '../../services/segmentService';
import Loader from '../common/Loader';

const CampaignForm = ({ onSubmit, initialData, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || {
      title: '',
      message: '',
      segmentId: ''
    }
  });
  
  const [segments, setSegments] = useState([]);
  const [segmentsLoading, setSegmentsLoading] = useState(true);
  const [characterCount, setCharacterCount] = useState(initialData?.message?.length || 0);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        setSegmentsLoading(true);
        const response = await getSegments();
        setSegments(response?.data?.data?.segments || []);
      } catch (err) {
        console.error('Failed to load segments:', err);
      } finally {
        setSegmentsLoading(false);
      }
    };
    fetchSegments();
  }, []);

  const handleMessageChange = (e) => {
    setCharacterCount(e.target.value.length);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Campaign Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Campaign Title *
          </label>
          <input
            {...register('title', { 
              required: 'Campaign title is required',
              maxLength: {
                value: 80,
                message: 'Title should not exceed 80 characters'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 p-2.5"
            placeholder="e.g. Summer Sale Announcement, New Product Launch"
          />
          <div className="flex justify-between mt-1">
            {errors.title ? (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Give your campaign a clear, descriptive name
              </p>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message Content *
          </label>
          <textarea
            {...register('message', { 
              required: 'Message content is required',
              maxLength: {
                value: 1000,
                message: 'Message should not exceed 1000 characters'
              },
              minLength: {
                value: 20,
                message: 'Message should be at least 20 characters'
              }
            })}
            rows={6}
            onChange={handleMessageChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 p-2.5"
            placeholder={`Write your campaign message here...\n\nExample:\n"Hi [First Name],\n\nWe're excited to announce our summer sale with up to 30% off selected items! Use code SUMMER30 at checkout. Offer valid until August 31st."`}
          />
          <div className="flex justify-between mt-1">
            {errors.message ? (
              <p className="text-sm text-red-600">{errors.message.message}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Personalize with variables like [First Name], [Last Order Date]
              </p>
            )}
            <span className={`text-xs ${characterCount > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
              {characterCount}/1000
            </span>
          </div>
        </div>

        {/* Target Segment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Audience *
          </label>
          {segmentsLoading ? (
            <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse">
              Loading available segments...
            </div>
          ) : segments.length === 0 ? (
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-yellow-700 dark:text-yellow-300">
              No segments available. Please create a segment first.
            </div>
          ) : (
            <>
              <select
                {...register('segmentId', { required: 'Please select a target audience' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 p-2.5"
              >
                <option value="">Select a target audience segment</option>
                {segments.map((segment) => (
                  <option key={segment._id} value={segment._id}>
                    {segment.name} ({segment.estimatedSize} customers)
                  </option>
                ))}
              </select>
              {errors.segmentId && (
                <p className="mt-1 text-sm text-red-600">{errors.segmentId.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                This campaign will be sent to all customers matching this segment
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || segmentsLoading || segments.length === 0}
        >
          {isSubmitting ? (
            <Loader size="small" variant="white" />
          ) : initialData ? (
            'Update Campaign'
          ) : (
            'Create Campaign'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CampaignForm;