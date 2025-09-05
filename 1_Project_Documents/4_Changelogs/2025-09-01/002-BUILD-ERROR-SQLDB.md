# BUILD ERROR - SQLDB EXPERIMENT
**Date**: September 1, 2025  
**Time**: 09:45 AM PST
**Status**: 🚨 BUILD FAILURE
**Error Type**: Encore SQL Database Experiment Configuration

---

## ❌ ERROR DETAILS

### Build Error Message
```
Compile app: compile build step initializing
unable to create experiment set error="unknown experiment: encore.dev/experiments/sqldb"

Test: test build step initializing  
unable to create experiment set error="unknown experiment: encore.dev/experiments/sqldb"
```

### What This Means
- The recent code changes may have introduced an experimental Encore feature
- The `sqldb` experiment flag is not recognized
- Build cannot proceed until this is resolved

---

## 🔧 IMMEDIATE FIX REQUIRED

### Potential Causes
1. **Import statement issue**: May have accidentally imported experimental features
2. **Encore version mismatch**: Code expects newer Encore version
3. **Configuration error**: Missing or incorrect experiment flags

### Quick Fix Options

#### Option 1: Remove Experimental Import
Check `backend/campaigns/get_meta_campaigns.ts` for:
```typescript
// Remove any experimental imports like:
import { experimental } from "encore.dev/experiments/sqldb"
```

#### Option 2: Fix Database Import
Ensure using standard imports:
```typescript
// Correct import:
import { SQLDatabase } from "encore.dev/storage/sqldb"

// NOT:
import { something } from "encore.dev/experiments/sqldb"
```

---

## 🚨 ACTION REQUIRED

**DO NOT MERGE** until this is fixed!

The build error must be resolved before the Meta API integration can be deployed.

---

**Status**: Investigating root cause  
**Priority**: CRITICAL - Blocking deployment