import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import Workers from './pages/Workers.jsx';
import Vendors from './pages/Vendors.jsx';
import Inventory from './pages/Inventory.jsx';
import ErrorBoundary from './components/ErrorBoundary.’jsx;

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
