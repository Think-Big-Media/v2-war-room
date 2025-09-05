# 🎨 WAR ROOM 3.1 FRONTEND CODEBASE
**Status**: Active Development  
**Platform**: React + Vite + TailwindCSS  
**Deployment**: Netlify  

---

## 📂 CURRENT ACTIVE REPOSITORIES

### **3.1-ui-war-room-netlify-clean** ⭐ **[CURRENT]**
- **Status**: Latest working version (September 4, 2025)
- **Features**: Complete UI with authentication, dashboard, debug sidecar
- **Deployment**: Ready for Netlify deployment
- **Notes**: This is the main development repository

### **3.1-ui-war-room-netlify**
- **Status**: Previous version (September 2, 2025)
- **Notes**: Backup version, use -clean version instead

---

## 📋 ARCHIVED VERSIONS

Located in `_archive/`:
- **2.9-ui-war-room**: Earlier version
- **3.0-ui-war-room**: Previous major version
- **BACKUP-3.0-ui-war-room-20250831-200740**: Timestamped backup

**Note**: All archived versions have node_modules removed for storage optimization.

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### Using 3.1-ui-war-room-netlify-clean:
```bash
cd 3.1-ui-war-room-netlify-clean
npm install
npm run build
# Deploy to Netlify
```

### Environment Variables Required:
```
VITE_ENCORE_API_URL=https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev
VITE_USE_MOCK_DATA=false
```

---

## 🔗 BACKEND CONNECTION

- **Backend URL**: https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev
- **API Prefix**: `/api/v1/`
- **Authentication**: JWT tokens with refresh mechanism

---

**Last Updated**: September 5, 2025  
**Current Working Directory**: `3.1-ui-war-room-netlify-clean`