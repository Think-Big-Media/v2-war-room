/**
 * Enterprise-grade debug trigger hook
 * Separated from components for proper Vite Fast Refresh compatibility
 */
import { useState, useEffect } from 'react';

// CRITICAL FIX: Global state to share between multiple hook instances
let globalDebugState = {
  isOpen: false,
  listeners: new Set<(isOpen: boolean) => void>()
};

const setGlobalDebugState = (isOpen: boolean) => {
  console.log('🌍 [GLOBAL DEBUG] Setting global debug state to:', isOpen);
  globalDebugState.isOpen = isOpen;
  globalDebugState.listeners.forEach(listener => listener(isOpen));
};

// Import visible debug logger (conditional to avoid circular imports)
let addVisibleDebugLog: ((message: string, level?: 'info' | 'success' | 'error' | 'warning') => void) | null = null;

// Try to import the visible debug logger
try {
  const { addVisibleDebugLog: visibleLogger } = require('../components/VisibleDebugMonitor');
  addVisibleDebugLog = visibleLogger;
} catch {
  // Fallback if import fails
  addVisibleDebugLog = null;
}

export const useDebugTrigger = () => {
  console.log('🚨🚨🚨 [HOOK START] useDebugTrigger() function called! 🚨🚨🚨');
  addVisibleDebugLog?.('🚨 useDebugTrigger() function called!', 'success');
  
  // Use global state instead of local state
  const [isDebugOpen, setIsDebugOpen] = useState(globalDebugState.isOpen);
  
  console.log('🔥 [DEBUG HOOK] useDebugTrigger hook initialized, isDebugOpen:', isDebugOpen);
  console.log('🔥 [DEBUG HOOK] Hook file imported successfully from /src/hooks/useDebugTrigger.ts');
  addVisibleDebugLog?.(`Hook initialized: isDebugOpen=${isDebugOpen}`, 'info');
  
  // Subscribe to global state changes
  useEffect(() => {
    const listener = (isOpen: boolean) => {
      console.log('🌍 [GLOBAL DEBUG] Received global state update:', isOpen);
      setIsDebugOpen(isOpen);
    };
    
    globalDebugState.listeners.add(listener);
    
    return () => {
      globalDebugState.listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    console.log('🔥 [DEBUG HOOK] Setting up event listeners for debug triggers');
    console.log('🔥 [DEBUG HOOK] Available triggers: 1) Cmd+Option+D, 2) Double-click bottom-right corner, 3) openDebug() function');
    addVisibleDebugLog?.('Setting up event listeners for debug triggers', 'info');
    
    let clickCount = 0;
    let clickTimer: NodeJS.Timeout;

    const handleDoubleClick = (e: MouseEvent) => {
      // Only trigger in bottom-right 100px square
      if (e.clientX > window.innerWidth - 100 && e.clientY > window.innerHeight - 100) {
        clickCount++;

        if (clickCount === 1) {
          clickTimer = setTimeout(() => {
            clickCount = 0;
          }, 300);
        } else if (clickCount === 2) {
          clearTimeout(clickTimer);
          clickCount = 0;
          console.log('🎯 [DEBUG HOOK] Double-click bottom-right detected! Opening debug sidecar...');
          addVisibleDebugLog?.('🎯 Double-click bottom-right detected!', 'success');
          setGlobalDebugState(true);
        }
      }
    };

    // Also allow Option+Command+D (Cmd+Alt+D on Mac) 
    const handleKeyDown = (e: KeyboardEvent) => {
      // Log all key combinations for debugging
      console.log('🔑 [DEBUG TRIGGER] Keydown:', {
        key: e.key,
        metaKey: e.metaKey,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        combination: `${e.metaKey ? 'Meta+' : ''}${e.altKey ? 'Alt+' : ''}${e.ctrlKey ? 'Ctrl+' : ''}${e.key}`
      });
      
      if (e.metaKey && e.altKey && (e.key === 'D' || e.key === 'd')) {
        console.log('🎯 [DEBUG TRIGGER] Cmd+Option+D detected! Opening debug sidecar...');
        addVisibleDebugLog?.('🎯 Cmd+Option+D detected!', 'success');
        e.preventDefault();
        setGlobalDebugState(true);
      }
    };

    window.addEventListener('click', handleDoubleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleDoubleClick);
      window.removeEventListener('keydown', handleKeyDown);
      if (clickTimer) clearTimeout(clickTimer);
    };
  }, []);
  
  // Track debug state changes
  useEffect(() => {
    console.log('🔥 [DEBUG HOOK] isDebugOpen state changed to:', isDebugOpen);
  }, [isDebugOpen]);

  const openDebug = () => {
    console.log('🎯 [DEBUG HOOK] openDebug() called! Setting global debug state to true');
    addVisibleDebugLog?.('🔥 openDebug() called - setting global state to TRUE', 'success');
    setGlobalDebugState(true);
  };
  
  const closeDebug = () => {
    console.log('🚪 [DEBUG HOOK] closeDebug() called! Setting global debug state to false');
    addVisibleDebugLog?.('🚪 closeDebug() called - setting global state to FALSE', 'warning');
    setGlobalDebugState(false);
  };

  return {
    isDebugOpen,
    openDebug,
    closeDebug,
  };
};