import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import AppRoutes from './routes';

function App() {
  console.log('🚀 App component rendering');

  return (
    <Router>
      <AuthProvider>
        <OrganizationProvider>
          <AppRoutes />
        </OrganizationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;