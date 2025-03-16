import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import PropertiesList from './components/PropertyList';
import PropertyDetails from './components/PropertyDetails';
import AddPropertyForm from './components/AddPropertyForm';
import AddUtilityBillForm from './components/AddUtilityBillForm';
import EditPropertyForm from './components/EditPropertyForm';
import EditUtilityBillForm from './components/EditUtilityBillForm';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const ProtectedAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/properties" />;
};

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const displayName = user?.fullName || user?.email || 'Guest';

  console.log('user:', user);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">{ process.env.REACT_APP_SYSTEM_TITLE }</h1>
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              <span>{displayName}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="container mx-auto flex-grow py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/properties" replace />} />
              <Route path="/properties" element={<PrivateRoute><PropertiesList /></PrivateRoute>} />
              <Route path="/properties/new" element={<PrivateRoute><AddPropertyForm /></PrivateRoute>} />
              <Route path="/properties/:id" element={<PrivateRoute><PropertyDetails /></PrivateRoute>} />
              <Route path="/properties/edit/:id" element={<PrivateRoute><EditPropertyForm /></PrivateRoute>} />
              <Route path="/utilities/new" element={<PrivateRoute><AddUtilityBillForm /></PrivateRoute>} />
              <Route path="/utilities/edit/:id" element={<PrivateRoute><EditUtilityBillForm /></PrivateRoute>} />
              <Route path="/login" element={<ProtectedAuthRoute><Login /></ProtectedAuthRoute>} />
              <Route path="/signup" element={<ProtectedAuthRoute><Signup /></ProtectedAuthRoute>} />
            </Routes>
          </main>
          <footer className="mt-auto bg-white border-t py-4">
            <div className="container mx-auto px-4 text-center text-gray-500">
              <p>&copy; {new Date().getFullYear()} { process.env.REACT_APP_SYSTEM_TITLE }</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
