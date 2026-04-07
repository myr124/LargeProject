import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage'; // Create a simple placeholder for this
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Anything inside here requires a login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<HomePage />} />
          {/* Add more private pages like /profile or /settings here */}
        </Route>

        {/* Redirect any unknown path or the root to Dashboard */}
        {/* If not logged in, ProtectedRoute will automatically bounce them to /login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;