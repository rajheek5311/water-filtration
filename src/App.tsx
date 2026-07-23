import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import Toaster from '@/components/Toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import PublicLayout from '@/components/PublicLayout';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import NewTest from '@/pages/NewTest';
import Dashboard from '@/pages/Dashboard';
import Records from '@/pages/Records';
import Compare from '@/pages/Compare';
import Analytics from '@/pages/Analytics';
import Report from '@/pages/Report';
import About from '@/pages/About';
import Contact from '@/pages/Contact';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<Login />} />

              {/* Public pages (sticky navbar + footer) */}
              <Route
                path="/about"
                element={
                  <PublicLayout>
                    <About />
                  </PublicLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicLayout>
                    <Contact />
                  </PublicLayout>
                }
              />

              {/* Protected app pages (sidebar layout) */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/new-test" element={<NewTest />} />
                        <Route path="/new-test/:id" element={<NewTest />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/records" element={<Records />} />
                        <Route path="/compare" element={<Compare />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/report" element={<Report />} />
                        <Route path="*" element={<Navigate to="/home" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
