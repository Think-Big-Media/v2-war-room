import type React from 'react';
import { useState, useEffect, useRef } from 'react';
// Animation imports removed to prevent flashing
import { useNavigate, useLocation } from 'react-router-dom';
import { informationService } from '../../services/informationService';
import { type InformationItem } from '../../types/information';
import { NAV_LABELS, ROUTES } from '../../constants/NAMING_CONSTANTS';
import {
  getSectionTheme,
  getNavActiveClasses,
  getNavIconActiveClasses,
  getNavHoverClasses,
  getNavIconHoverClasses,
} from '../../utils/sectionTheming';
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

const TopNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [teamAlerts, setTeamAlerts] = useState<InformationItem[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const clickResetTimer = useRef<NodeJS.Timeout | null>(null);

  // Get current section theme
  const currentTheme = getSectionTheme(location.pathname);

  // Load team alerts with proper cleanup
  useEffect(() => {
    let isSubscribed = true;

    const loadTeamAlerts = () => {
      if (isSubscribed) {
        const alerts = informationService.getTeamAlerts();
        setTeamAlerts(alerts);
      }
    };

    loadTeamAlerts();

    // Only refresh if component is still mounted and user is active
    const interval = setInterval(() => {
      if (isSubscribed && !document.hidden) {
        loadTeamAlerts();
      }
    }, 30000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

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

  const navItems = [
    {
      icon: Home,
      label: NAV_LABELS.DASHBOARD,
      path: ROUTES.DASHBOARD,
      route: 'dashboard',
      active: location.pathname === '/' || location.pathname === ROUTES.DASHBOARD,
      theme: getSectionTheme(ROUTES.DASHBOARD),
      accent: 'var(--accent-dashboard)',
    },
    {
      icon: BarChart3,
      label: NAV_LABELS.LIVE_MONITORING,
      path: ROUTES.LIVE_MONITORING,
      route: 'live-monitoring',
      active:
        location.pathname === ROUTES.LIVE_MONITORING ||
        location.pathname === '/real-time-monitoring',
      theme: getSectionTheme(ROUTES.LIVE_MONITORING),
      accent: 'var(--accent-live-monitoring)',
    },
    {
      icon: Target,
      label: NAV_LABELS.WAR_ROOM,
      path: ROUTES.WAR_ROOM,
      route: 'war-room',
      active: location.pathname === ROUTES.WAR_ROOM || location.pathname === '/campaign-control',
      theme: getSectionTheme(ROUTES.WAR_ROOM),
      accent: 'var(--accent-war-room)',
    },
    {
      icon: Brain,
      label: NAV_LABELS.INTELLIGENCE,
      path: ROUTES.INTELLIGENCE,
      route: 'intelligence',
      active:
        location.pathname === ROUTES.INTELLIGENCE || location.pathname === '/intelligence-hub',
      theme: getSectionTheme(ROUTES.INTELLIGENCE),
      accent: 'var(--accent-intelligence)',
    },
    {
      icon: Bell,
      label: NAV_LABELS.ALERT_CENTER,
      path: ROUTES.ALERT_CENTER,
      route: 'alert-center',
      active: location.pathname === '/alert-center',
      theme: getSectionTheme('/alert-center'),
      accent: 'var(--accent-alert-center)',
    },
    {
      icon: Settings,
      label: NAV_LABELS.SETTINGS,
      path: ROUTES.SETTINGS,
      route: 'settings',
      active: location.pathname === '/settings',
      theme: getSectionTheme('/settings'),
      accent: 'var(--accent-settings)',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    const now = Date.now();
    
    console.log('🖱️ [LOGO CLICK DEBUG]', {
      clickCount: clickCount,
      timeSinceLastClick: now - lastClickTime,
      currentPath: location.pathname
    });
    
    // Clear any existing timer
    if (clickResetTimer.current) {
      clearTimeout(clickResetTimer.current);
    }
    
    // Check if this click is within 500ms of the last click (for multi-clicks)
    if (now - lastClickTime < 500 && clickCount > 0) {
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);
      setLastClickTime(now);
      
      console.log('🔢 [MULTI-CLICK]', { newClickCount, willNavigate: newClickCount === 3 });
      
      // Triple-click detected - navigate to platform admin dashboard 
      if (newClickCount === 3) {
        console.log('🔐 [TRIPLE-CLICK] Platform admin dashboard activated');
        console.log('🚀 [NAVIGATION] Attempting to navigate to /platform-admin');
        navigate('/platform-admin');
        console.log('✅ [NAVIGATION] navigate() called successfully');
        setClickCount(0);
        return;
      }
    } else {
      // First click or reset after timeout
      setClickCount(1);
      setLastClickTime(now);
      
      // Navigate to dashboard on first click (after a short delay to allow for potential multi-clicks)
      clickResetTimer.current = setTimeout(() => {
        if (clickCount === 1) {
          navigate('/');
        }
        setClickCount(0);
        setLastClickTime(0);
      }, 600); // Wait 600ms to see if more clicks come
      
      return; // Don't navigate immediately
    }
    
    // Reset click count after 1 second of no more clicks
    clickResetTimer.current = setTimeout(() => {
      setClickCount(0);
      setLastClickTime(0);
    }, 1000);
  };

  const handleNotificationClick = (alert: InformationItem) => {
    informationService.markAsRead(alert.id);
    setShowNotifications(false);
    navigate(alert.deepLink);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    }
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'priority-critical';
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const unreadAlerts = teamAlerts.filter((alert) => alert.status === 'unread');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand - Responsive - Click to go to Dashboard, Triple-click for Admin */}
          <button
            onClick={handleLogoClick}
            className="flex items-center ml-[25px] hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            title="Click to dashboard, triple-click for admin panel"
          >
            {/* Full logo for large screens - increased size */}
            <img
              src="/images/WarRoom_Logo_White.png"
              alt="War Room"
              className="hidden lg:block h-[32px] w-auto"
            />
            {/* Logomark for tablet - increased size */}
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F8686f311497044c0932b7d2247296478%2Ff489a630137d4a28b75e743a04ae8f49?format=webp&width=800"
              alt="War Room"
              className="hidden md:block lg:hidden h-[36px] w-auto"
            />
            {/* Small logo for mobile header - keep same size */}
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F8686f311497044c0932b7d2247296478%2Ff489a630137d4a28b75e743a04ae8f49?format=webp&width=800"
              alt="War Room"
              className="block md:hidden h-[24px] w-auto"
            />
          </button>

          {/* Navigation Items - Responsive */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                aria-current={item.active ? 'page' : undefined}
                data-route={item.route}
                style={
                  {
                    transition: 'all 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    '--item-accent': item.accent,
                  } as React.CSSProperties
                }
                className={`nav-item group px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm flex items-center space-x-1 ${
                  item.active
                    ? getNavActiveClasses(item.theme)
                    : 'text-white/70 hover:text-white hover:bg-white/10 hover:shadow-lg'
                }`}
              >
                {/* Hide icons on tablet, show on large screens */}
                <item.icon
                  className={`icon w-4 h-4 flex-shrink-0 hidden lg:block ${
                    item.active
                      ? getNavIconActiveClasses(item.theme)
                      : getNavIconHoverClasses(item.theme)
                  }`}
                  style={{
                    transition: 'all 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    ...(item.icon === Home
                      ? {
                          // More aggressive positioning - both states need similar adjustments
                          marginTop: '-2px', // Move up 2 pixels for better alignment
                          marginLeft: '-4px', // Move left 4 pixels relative to text
                          marginRight: '1px', // Compensate spacing
                        }
                      : {}),
                  }}
                />
                <span
                  className={`label ${item.active ? 'nav-active-text' : getNavHoverClasses(item.theme)} ${
                    ['REAL-TIME MONITORING', 'CAMPAIGN CONTROL', 'ALERT CENTER'].includes(
                      item.label
                    )
                      ? 'nav-label'
                      : ''
                  }`}
                  style={{
                    transition: 'all 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  {/* Full text for large screens */}
                  <span className="hidden lg:inline">{item.label}</span>
                  {/* Shorter text for tablet */}
                  <span className="lg:hidden">
                    {item.label === NAV_LABELS.LIVE_MONITORING
                      ? 'LIVE'
                      : item.label === NAV_LABELS.ALERT_CENTER
                        ? 'ALERTS'
                        : item.label}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Right Side Actions - Moved 25px left with tighter spacing */}
          <div className="flex items-center space-x-1 md:space-x-1.5 lg:space-x-2 mr-[25px]">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 lg:p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 hover:shadow-md relative"
                style={{
                  transition: 'all 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                {unreadAlerts.length > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 notification-badge rounded-lg flex items-center justify-center transition-colors">
                    <span className="notification-badge-text text-[11px] font-medium">
                      {unreadAlerts.length}
                    </span>
                  </div>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-800 font-semibold">
                        Team Alerts ({unreadAlerts.length})
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate('/alert-center')}
                          className="text-gray-600 hover:text-gray-800 transition-colors text-xs"
                        >
                          View All
                        </button>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {teamAlerts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No team alerts at this time
                        </div>
                      ) : (
                        teamAlerts.slice(0, 5).map((alert) => (
                          <div
                            key={alert.id}
                            onClick={() => handleNotificationClick(alert)}
                            className={`p-3 rounded-lg border hover:bg-gray-200/50 transition-colors cursor-pointer ${
                              alert.status === 'unread'
                                ? 'bg-gray-100/70 border-gray-200/50'
                                : 'bg-gray-50/50 border-gray-200/30'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)}`}>
                                <Bell className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <div className="text-gray-800 font-medium text-sm">
                                    {alert.title}
                                  </div>
                                  {alert.status === 'unread' && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                  )}
                                </div>
                                <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                                  {alert.text}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="text-gray-500 text-xs">
                                    {formatTimestamp(alert.timestamp)}
                                  </div>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-xs ${getPriorityColor(alert.priority)}`}
                                  >
                                    {alert.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <button
              onClick={() => navigate('/settings')}
              className="p-1.5 lg:p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 hover:shadow-md"
              style={{
                transition: 'all 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <User className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {/* Mobile Menu Button - Far Right */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 hover:shadow-md"
              style={{
                transition: 'all 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Proper Implementation */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Dropdown menu panel - attached to navigation */}
            <div className="md:hidden absolute right-0 top-full left-0 z-50">
              <div className="mx-4 mt-2 bg-slate-900 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Menu Items */}
                <div className="p-4 space-y-1">
                  {navItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleNavigation(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-4 rounded-xl font-medium text-left flex items-center space-x-4 text-base transition-all duration-200 ${
                        item.active
                          ? 'text-white font-semibold bg-white/20 border-l-4 border-l-white'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                      style={{ minHeight: '52px' }}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNavigation;
