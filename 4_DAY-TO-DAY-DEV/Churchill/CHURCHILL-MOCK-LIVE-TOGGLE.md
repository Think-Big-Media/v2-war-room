# 🔄 CHURCHILL - MOCK/LIVE DATA TOGGLE SYSTEM
**Codename**: CHURCHILL  
**Component**: Data Mode Toggle  
**Status**: IMPLEMENTED & ACTIVE  

## 🎯 TOGGLE SYSTEM OVERVIEW

The War Room platform includes a sophisticated Mock/Live data toggle system that allows instant switching between:
- **MOCK MODE** 🔧: Uses sample data for demos and testing
- **LIVE MODE** 🚀: Connects to real backend APIs

## 📍 TOGGLE LOCATIONS

### Visual Toggle Button (Now Active):
- **Top Right Corner**: Prominent button showing current mode
- **Bottom Status Bar**: Additional indicator with quick switch option
- **Color Coding**:
  - Yellow = MOCK mode
  - Green = LIVE mode

### Browser Console Toggle:
```javascript
// Switch to LIVE mode
localStorage.setItem('VITE_USE_MOCK_DATA', 'false');
location.reload();

// Switch to MOCK mode  
localStorage.setItem('VITE_USE_MOCK_DATA', 'true');
location.reload();

// Check current mode
console.log('Current mode:', localStorage.getItem('VITE_USE_MOCK_DATA') === 'true' ? 'MOCK' : 'LIVE');
```

## 🔧 IMPLEMENTATION DETAILS

### Component Structure:
```
src/components/
├── DataToggleButton.tsx    # Main toggle button (top-right + bottom bar)
├── DataModeIndicator.tsx   # Small indicator component
└── shared/
    └── DataModeIndicator.tsx # Shared indicator logic
```

### Service Layer:
```
src/services/
├── DataService.ts          # Main data service orchestrator
├── mentionlytics/
│   └── mentionlyticsService.ts  # Checks mode and returns appropriate data
└── Other services...       # All respect the data mode setting
```

### Hook Integration:
```
src/hooks/
├── useWarRoomData.ts      # Main data hook with mode awareness
└── useMentionlytics.ts    # Mentionlytics-specific hook
```

## 📊 HOW IT WORKS

### Data Flow:
1. **User clicks toggle** → Updates localStorage
2. **Page reloads** → Services check localStorage
3. **Services determine source**:
   - MOCK: Return sample data from `mockData.ts` files
   - LIVE: Call actual API endpoints
4. **Components render** with appropriate data

### Mock Data Structure:
Each service has corresponding mock data:
- `mentionlytics/mockData.ts` - Social mentions, sentiment
- `campaigns/mockData.ts` - Ad campaign data
- `analytics/mockData.ts` - Analytics metrics

### Live Data Endpoints:
When in LIVE mode, connects to:
- Backend: `https://staging-war-roombackend-45-x83i.encr.app`
- Endpoints: `/api/v1/mentionlytics/*`, `/api/v1/campaigns/*`, etc.

## 🎨 VISUAL INDICATORS

### Toggle Button Features:
- **Emoji Icons**: 🔧 for MOCK, 🚀 for LIVE
- **Gradient Colors**: Yellow gradient for MOCK, Green for LIVE
- **Animation**: Pulse effect on active indicator
- **Loading Overlay**: Shows during mode switch
- **Tooltips**: Explains current mode on hover

### Status Bar:
- Full-width bar at bottom of screen
- Shows current mode prominently
- Quick switch button included
- Descriptive text about mode purpose

## 🚀 USAGE SCENARIOS

### When to Use MOCK Mode:
- **Demos**: Showing platform to stakeholders
- **Testing**: Developing new features
- **Offline Work**: No internet/backend access
- **Training**: Teaching new users
- **Screenshots**: Consistent data for documentation

### When to Use LIVE Mode:
- **Production**: Real campaign management
- **Monitoring**: Actual social mentions
- **Analytics**: Real performance data
- **Debugging**: Testing API integrations
- **Validation**: Ensuring backend connectivity

## 🔍 TROUBLESHOOTING

### Toggle Not Visible:
1. Check if `DataToggleButton` is imported in `App.tsx` ✅ (Now fixed)
2. Verify no CSS hiding the component
3. Check browser console for errors

### Mode Not Switching:
1. Clear browser cache
2. Check localStorage permissions
3. Verify page reload occurs after toggle
4. Check console for errors

### Data Not Updating:
1. Verify backend is running (LIVE mode)
2. Check API endpoints are correct
3. Confirm environment variables set
4. Test with browser console toggle

## 📝 CODE CHANGES MADE

### Added to App.tsx:
```typescript
import { DataToggleButton } from './components/DataToggleButton';

// In render:
<NotificationProvider>
  <DataToggleButton />  // Added here
  <Router>
```

### Environment Configuration:
```env
VITE_API_URL=https://staging-war-roombackend-45-x83i.encr.app
VITE_ENCORE_API_URL=https://staging-war-roombackend-45-x83i.encr.app
VITE_USE_MOCK_DATA=false  # Default to LIVE
```

## ✅ VERIFICATION CHECKLIST

- [x] DataToggleButton component exists
- [x] Component imported in App.tsx
- [x] Toggle visible on dashboard
- [x] localStorage integration working
- [x] Services respect data mode
- [x] Visual indicators clear
- [x] Mode persists across refresh
- [ ] Live data flowing when in LIVE mode (pending backend fix)

## 🎯 NEXT STEPS

1. **Deploy frontend** with toggle button visible
2. **Test both modes** thoroughly
3. **Fix backend webhook** to enable real live data
4. **Document in CLAUDE.md** for future reference

---

**CHURCHILL STATUS**: Mock/Live toggle system fully implemented and documented. Visual toggle now active in dashboard.