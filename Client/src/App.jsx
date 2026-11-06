import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WorkspacePage from './pages/WorkspacePage';
import DashboardPage from './pages/DashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import { authClient } from './lib/auth';
import './App.css';

export default function App() {
  const [user, setUser] = useState(() => authClient.getUser());

  // Sync / verify current user session
  useEffect(() => {
    authClient.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/verify-email"
          element={
            <VerifyEmailPage />
          }
        />
        <Route
          path="/workspace/:videoId"
          element={
            <WorkspacePage user={user} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              user={user}
              setUser={setUser}
            />
          }
        />
      </Routes>
    </Router>
  );
}
