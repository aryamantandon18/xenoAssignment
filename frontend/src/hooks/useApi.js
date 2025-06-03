// import { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// export default function useApi() {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { currentUser } = useAuth();

//   const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   // Request interceptor to add auth token
//   api.interceptors.request.use(
//     async (config) => {
//       if (currentUser) {
//         const token = await currentUser.getIdToken();
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   const request = async (method, url, body = null, config = {}) => {
//     setLoading(true);
//     try {
//       let response;
//       switch (method.toLowerCase()) {
//         case 'get':
//           response = await api.get(url, config);
//           break;
//         case 'post':
//           response = await api.post(url, body, config);
//           break;
//         case 'put':
//           response = await api.put(url, body, config);
//           break;
//         case 'delete':
//           response = await api.delete(url, config);
//           break;
//         default:
//           throw new Error(`Unsupported method: ${method}`);
//       }
//       setData(response.data);
//       return response.data;
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     data,
//     error,
//     loading,
//     request,
//     get: (url, config) => request('get', url, null, config),
//     post: (url, body, config) => request('post', url, body, config),
//     put: (url, body, config) => request('put', url, body, config),
//     delete: (url, config) => request('delete', url, null, config),
//   };
// }