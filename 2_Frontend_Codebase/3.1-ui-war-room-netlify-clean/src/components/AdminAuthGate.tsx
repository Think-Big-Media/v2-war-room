import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { safeGetItem, safeSetJSON, isLocalStorageAvailable } from '../utils/localStorage';

interface AdminAuthGateProps {
  children: React.ReactNode;
  onAuthChange: (authenticated: boolean) => void;
}

// Simple admin password - in production, this would be environment-based
const ADMIN_PASSWORD = 'war-room-admin-2024';
const AUTH_SESSION_KEY = 'war-room-admin-session';
const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours

interface AuthSession {
  timestamp: number;
  expires: number;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ children, onAuthChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Notify parent of auth changes
  useEffect(() => {
    onAuthChange(isAuthenticated);
  }, [isAuthenticated, onAuthChange]);

  const checkExistingSession = () => {
    if (!isLocalStorageAvailable()) return;
    
    try {
      const sessionData = safeGetItem(AUTH_SESSION_KEY);
      if (!sessionData) return;
      
      const session: AuthSession = JSON.parse(sessionData);
      const now = Date.now();
      
      if (now < session.expires) {
        console.log('🔐 [ADMIN-AUTH] Valid session found, auto-authenticating');
        setIsAuthenticated(true);
        return;
      }
      
      // Session expired, clean up
      console.log('🔐 [ADMIN-AUTH] Session expired, clearing');
      if (isLocalStorageAvailable()) {
        safeSetJSON(AUTH_SESSION_KEY, null);
      }
    } catch (error) {
      console.warn('🔐 [ADMIN-AUTH] Session check failed:', error);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Rate limiting - block after 3 failed attempts
    if (attempts >= 3) {
      setError('Too many failed attempts. Refresh page to try again.');
      setIsBlocked(true);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      // Success - create session
      const now = Date.now();
      const session: AuthSession = {
        timestamp: now,
        expires: now + SESSION_DURATION
      };

      if (isLocalStorageAvailable()) {
        safeSetJSON(AUTH_SESSION_KEY, session);
      }

      setIsAuthenticated(true);
      setPassword('');
      setAttempts(0);
      console.log('🔐 [ADMIN-AUTH] Authentication successful');
    } else {
      // Failure - increment attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(`Incorrect password (${newAttempts}/3 attempts)`);
      setPassword('');
      
      if (newAttempts >= 3) {
        setIsBlocked(true);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError('');
    setAttempts(0);
    setIsBlocked(false);
    
    // Clear session
    if (isLocalStorageAvailable()) {
      safeSetJSON(AUTH_SESSION_KEY, null);
    }
    
    console.log('🔐 [ADMIN-AUTH] User logged out');
  };

  if (isAuthenticated) {
    return (
      <div className="relative">
        {/* Logout button in top-right */}
        <button
          onClick={handleLogout}
          className="fixed top-4 right-4 z-50 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors flex items-center gap-2"
          title="Logout Admin Session"
        >
          <Shield className="w-4 h-4" />
          Logout
        </button>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Enter password to access admin dashboard</p>
          </div>

          {/* Security Warning */}
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Restricted Area - Authorized Personnel Only</span>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isBlocked}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  disabled={isBlocked}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!password || isBlocked}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {isBlocked ? 'Access Blocked' : 'Access Admin Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Session expires after 2 hours of inactivity
          </div>
        </div>
      </motion.div>
    </div>
  );
};