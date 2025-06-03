import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { motion } from 'framer-motion';

// Pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Customers from './pages/customers/Customers';
import Segments from './pages/segments/Segments';
import Campaigns from './pages/campaigns/Campaigns';
import NotFound from './pages/404';

// Components
import Layout from './components/ui/Layout';
import CustomToaster from './components/ui/CustomToaster';
import SegmentCreate from './pages/segments/SegmentCreate';
import SegmentDetail from './pages/segments/segmentDetail';
import CampaignCreate from './pages/campaigns/CampaignCreate'
import CampaignDetail from './pages/campaigns/CampaignDetail';

const App = () => {
  return (
    <Router>
      <AuthProvider>
         <CustomToaster/>
        <Routes>
          Public Routes
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          Protected Routes
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Dashboard />
                  </motion.div>
                 </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Customers />
                  </motion.div>
                 </ProtectedRoute>
              }
            />
            <Route
              path="/segments"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Segments />
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route path="/segments/new" 
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{opacity:0}}
                    animate={{opacity: 1}}
                    exit={{ opacity: 0}}
                  >
                    <SegmentCreate/>
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route path="/segments/:id" 
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{opacity:0}}
                    animate={{opacity: 1}}
                    exit={{ opacity: 0}}
                  >
                    <SegmentDetail/>
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Campaigns />
                  </motion.div>
                </ProtectedRoute>
              }
            />
          <Route
              path="/campaigns/new"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CampaignCreate/>
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/:id"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CampaignDetail/>
                  </motion.div>
                </ProtectedRoute>
              }
            />

          </Route>
      

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;