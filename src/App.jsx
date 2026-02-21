import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DonateItem from './pages/DonateItem';
import BrowseItems from './pages/BrowseItems';
import MyRequests from './pages/MyRequests';
import MyDonations from './pages/MyDonations';
import Admin from './pages/Admin';
import Coordinator from './pages/Coordinator';

function AuthenticatedLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Container maxWidth="lg">
                <Dashboard />
              </Container>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/donate"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Container maxWidth="lg">
                <DonateItem />
              </Container>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Container maxWidth="lg">
                <BrowseItems />
              </Container>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-donations"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Container maxWidth="lg">
                <MyDonations />
              </Container>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Container maxWidth="lg">
                <MyRequests />
              </Container>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roleRequired="ADMIN">
            <AuthenticatedLayout>
              <Container maxWidth="lg">
                <Admin />
              </Container>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator"
        element={
          <ProtectedRoute roleRequired="COORDINATOR">
            <AuthenticatedLayout>
              <Container maxWidth="lg">
                <Coordinator />
              </Container>
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
