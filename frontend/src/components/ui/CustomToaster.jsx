import { Toaster } from 'react-hot-toast';

const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: '#22c55e', // Tailwind green-500 (more vibrant)
            color: '#f0fdf4', // green-50
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderLeft: '4px solid #15803d', // green-700
          },
          iconTheme: {
            primary: '#f0fdf4', // green-50
            secondary: '#15803d', // green-700
          },
        },
        error: {
          style: {
            background: '#ef4444', // red-500 (more vibrant)
            color: '#fef2f2', // red-50
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderLeft: '4px solid #b91c1c', // red-700
          },
          iconTheme: {
            primary: '#fef2f2', // red-50
            secondary: '#b91c1c', // red-700
          },
        },
        loading: {
          style: {
            background: '#3b82f6', // blue-500
            color: '#eff6ff', // blue-50
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          iconTheme: {
            primary: '#eff6ff', // blue-50
            secondary: '#1d4ed8', // blue-700
          },
        },
        style: {
          background: '#1e293b', // slate-800 (darker for better contrast)
          color: '#f8fafc', // slate-50
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderLeft: '4px solid #0f172a', // slate-900
        },
      }}
    />
  );
};

export default CustomToaster;