import type React from 'react';
import { useState, useEffect, useRef } from 'react';
// Animation imports removed to prevent flashing
import { useNavigate, useLocation } from 'react-router-dom';
// Import fix for Netlify build compatibility
import { informationService } from '../../services/informationService';
import { type InformationItem } from '../../types/information';
import { NAV_LABELS, ROUTES } from '../../constants/NAMING_CONSTANTS';
import {
  getSectionTheme,
  getNavActiveClasses,
  getNavHoverClasses,
} from '../../styles/theme';
import {
  Home,
  Target,
  Calendar,
  Zap,
  BarChart3,
  Settings,
  Search,
  Bell,
  User,
  Brain,
  Menu,
  X,
  TrendingUp,
  Activity,
} from 'lucide-react';

// Mock data for fallback when MOCK mode is enabled
const mockTeamAlerts: InformationItem[] = [
  {
    id: '1',
    category: 'team-alerts',
    title: 'System update complete',
    text: 'System update complete',
    timestamp: new Date().toISOString(),
    priority: 'medium',
    deepLink: '/dashboard',
    actionable: false,
    status: 'unread',
    metadata: { tags: ['system'] }
  },
  {
    id: '2',
    category: 'team-alerts', 
    title: 'New campaign metrics available',
    text: 'New campaign metrics available',
    timestamp: new Date().toISOString(),
    priority: 'medium',
    deepLink: '/analytics',
    actionable: false,
    status: 'unread',
    metadata: { tags: ['analytics'] }
  }
];

const TopNavigation: React.FC = () => {
  // 🔍 DIAGNOSTIC: Component mounted
  console.log('🔍 [DIAGNOSTIC] TopNavigation component mounted');
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [dataMode, setDataMode] = useState<'MOCK' | 'LIVE'>('LIVE'); // Admin data toggle
  const logoClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const notificationsRef = useRef<HTMLDivElement>(null);

  // MOCK/LIVE data strategy - BOTH always available
  const teamAlerts = dataMode === 'MOCK' ? mockTeamAlerts : informationService.getTeamAlerts();

  const navItems = [
    {
      icon: Home,
      label: NAV_LABELS.DASHBOARD,
      path: ROUTES.DASHBOARD,
      route: 'dashboard',
      active: location.pathname === ROUTES.DASHBOARD || location.pathname === '/',
    },
    {
      icon: BarChart3,
      label: NAV_LABELS.ANALYTICS,
      path: ROUTES.REAL_TIME_MONITORING,
      route: 'analytics',
      active: location.pathname === ROUTES.REAL_TIME_MONITORING,
    },
    {
      icon: Target,
      label: NAV_LABELS.COMMAND_CENTER,
      path: ROUTES.COMMAND_CENTER,
      route: 'command',
      active: location.pathname === ROUTES.COMMAND_CENTER,
    },
    {
      icon: Brain,
      label: NAV_LABELS.INTELLIGENCE_HUB,
      path: ROUTES.INTELLIGENCE_HUB,
      route: 'intelligence',
      active: location.pathname === ROUTES.INTELLIGENCE_HUB,
    },
    {
      icon: Bell,
      label: NAV_LABELS.ALERT_CENTER,
      path: ROUTES.ALERT_CENTER,
      route: 'alerts',
      active: location.pathname === ROUTES.ALERT_CENTER,
    },
    {
      icon: Settings,
      label: NAV_LABELS.SETTINGS,
      path: ROUTES.SETTINGS,
      route: 'settings',
      active: location.pathname === ROUTES.SETTINGS,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Triple-click admin activation handler
  const handleLogoClick = (e: React.MouseEvent) => {
    console.log('🔍 [DIAGNOSTIC] Logo clicked! Current count:', logoClickCount + 1);
    e.preventDefault();
    
    setLogoClickCount(prev => prev + 1);

    if (logoClickTimeoutRef.current) {
      clearTimeout(logoClickTimeoutRef.current);
    }

    logoClickTimeoutRef.current = setTimeout(() => {
      console.log('🔍 [DIAGNOSTIC] Processing click sequence. Final count:', logoClickCount + 1);
      
      if (logoClickCount + 1 >= 3) {
        // Triple-click detected - activate admin mode
        setIsAdminMode(true);
        console.log('🔧 [SUCCESS] Admin mode activated via triple-click logo!');
        console.log('🔍 [DIAGNOSTIC] Dispatching debug-sidecar-toggle event...');
        
        // Dispatch event to activate DebugSidecar
        const event = new CustomEvent('debug-sidecar-toggle', { detail: { isOpen: true } });
        window.dispatchEvent(event);
        console.log('🔍 [DIAGNOSTIC] Event dispatched successfully');
      } else if (logoClickCount + 1 === 1) {
        // Single click - normal navigation
        console.log('🔍 [DIAGNOSTIC] Single click detected, navigating to dashboard');
        handleNavigation(ROUTES.DASHBOARD);
      }
      
      setLogoClickCount(0);
    }, 400); // 400ms timeout for triple-click detection
  };

  // Listen for data mode changes from admin panel
  useEffect(() => {
    const handleDataModeChange = (e: CustomEvent) => {
      console.log('🔍 [DIAGNOSTIC] Data mode change received:', e.detail);
      if (e.detail?.mode) {
        setDataMode(e.detail.mode);
      }
    };

    window.addEventListener('data-mode-change', handleDataModeChange as EventListener);
    
    return () => {
      window.removeEventListener('data-mode-change', handleDataModeChange as EventListener);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (logoClickTimeoutRef.current) {
        clearTimeout(logoClickTimeoutRef.current);
      }
    };
  }, []);

  const handleNotificationClick = (alert: InformationItem) => {
    setShowNotifications(false);
    navigate(alert.deepLink);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const unreadAlerts = teamAlerts.filter((alert) => alert.status === 'unread');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand - Responsive - Triple-click activates admin mode */}
          <button
            onClick={handleLogoClick}
            className="flex items-center ml-[25px] hover:opacity-80 transition-opacity duration-200 cursor-pointer"
          >
            {isAdminMode ? (
              <span className="text-red-400 font-bold text-lg">Admin Dashboard ({dataMode})</span>
            ) : (
              <>
                {/* Full logo for large screens */}
                <img
                  src="/images/WarRoom_Logo_White.png"
                  alt="War Room"
                  className="hidden lg:block h-[26px] w-auto object-contain"
                  style={{ minWidth: '80px', maxWidth: '120px' }}
                />
                {/* Logomark for tablet */}
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F8686f311497044c0932b7d2247296478%2Ff489a630137d4a28b75e743a04ae8f49?format=webp&width=800"
                  alt="War Room"
                  className="hidden md:block lg:hidden h-[28px] w-auto object-contain"
                  style={{ aspectRatio: '1/1' }}
                />
                {/* Small logo for mobile header */}
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F8686f311497044c0932b7d2247296478%2Ff489a630137d4a28b75e743a04ae8f49?format=webp&width=800"
                  alt="War Room"
                  className="block md:hidden h-[24px] w-auto"
                  style={{ aspectRatio: '1/1' }}
                />
              </>
            )}
          </button>

          {/* Navigation Items - Responsive */}
          <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center px-2 lg:px-3 xl:px-4 py-2 rounded-lg text-sm lg:text-base font-medium
                  transition-all duration-200 hover:bg-white/10 hover:backdrop-blur-sm
                  ${item.active ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white'}
                `}
              >
                <item.icon className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Data Mode Toggle - VISIBLE ADMIN CONTROL */}
            <button
              onClick={() => setDataMode(dataMode === 'MOCK' ? 'LIVE' : 'MOCK')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                dataMode === 'MOCK' 
                  ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30' 
                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
              }`}
              title={`Currently using ${dataMode} data. Click to switch to ${dataMode === 'MOCK' ? 'LIVE' : 'MOCK'}`}
            >
              {dataMode}
            </button>

            {/* Admin Mode Indicator (when triple-click activated) */}
            {isAdminMode && (
              <div className="hidden md:flex items-center px-2 py-1 bg-red-500/20 rounded text-xs text-red-300">
                ADMIN
              </div>
            )}

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-xl z-50">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white font-medium">Team Alerts ({dataMode} Data)</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {teamAlerts.length > 0 ? (
                      teamAlerts.map((alert) => (
                        <button
                          key={alert.id}
                          onClick={() => handleNotificationClick(alert)}
                          className="w-full p-3 text-left hover:bg-white/5 border-b border-gray-800 last:border-0"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-white text-sm">{alert.title}</p>
                              <p className="text-gray-400 text-xs mt-1">{alert.text}</p>
                            </div>
                            {alert.status === 'unread' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        No alerts
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-black/40 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleNavigation(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    flex items-center w-full px-3 py-2 rounded-lg text-base font-medium
                    transition-all duration-200
                    ${item.active ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavigation;