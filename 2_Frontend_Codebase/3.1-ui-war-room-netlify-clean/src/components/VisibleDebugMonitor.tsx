/**
 * Visible Debug Monitor - For Comet AI Browser Reconnaissance
 * Shows debug status visibly on screen so Comet can monitor it
 */
import React, { useState, useEffect } from 'react';

interface DebugLog {
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'error' | 'warning';
}

interface VisibleDebugMonitorProps {
  isOpen: boolean;
}

// Global debug logger that components can use
let debugLogs: DebugLog[] = [];
const debugSubscribers: ((logs: DebugLog[]) => void)[] = [];

export const addVisibleDebugLog = (message: string, level: DebugLog['level'] = 'info') => {
  const log: DebugLog = {
    timestamp: new Date().toLocaleTimeString(),
    message,
    level
  };
  
  debugLogs = [...debugLogs.slice(-19), log]; // Keep last 20 logs
  
  // Notify all subscribers
  debugSubscribers.forEach(callback => callback([...debugLogs]));
  
  // Also log to console
  const emoji = level === 'success' ? '✅' : level === 'error' ? '❌' : level === 'warning' ? '⚠️' : '🔍';
  console.log(`${emoji} [VISIBLE DEBUG] ${message}`);
};

export const VisibleDebugMonitor: React.FC<VisibleDebugMonitorProps> = ({ isOpen }) => {
  const [logs, setLogs] = useState<DebugLog[]>(debugLogs);
  
  useEffect(() => {
    // Subscribe to debug log updates
    const updateLogs = (newLogs: DebugLog[]) => setLogs(newLogs);
    debugSubscribers.push(updateLogs);
    
    // Initial log
    addVisibleDebugLog('VisibleDebugMonitor initialized', 'success');
    
    return () => {
      const index = debugSubscribers.indexOf(updateLogs);
      if (index > -1) debugSubscribers.splice(index, 1);
    };
  }, []);
  
  if (!isOpen && logs.length === 0) return null;

  return (
    <div 
      id="visible-debug-monitor"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '400px',
        maxHeight: '300px',
        backgroundColor: '#000000',
        color: '#00ff00',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '12px',
        padding: '15px',
        border: '2px solid #00ff00',
        borderRadius: '8px',
        zIndex: 9999,
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0, 255, 0, 0.3)'
      }}
    >
      <div style={{ 
        marginBottom: '10px', 
        fontWeight: 'bold',
        borderBottom: '1px solid #00ff00',
        paddingBottom: '5px'
      }}>
        🤖 DEBUG MONITOR (Comet AI Visible)
      </div>
      
      <div id="debug-status" style={{ marginBottom: '10px' }}>
        <div>📊 Total Logs: <span id="log-count">{logs.length}</span></div>
        <div>🕒 Last Update: <span id="last-update">{logs.length > 0 ? logs[logs.length - 1].timestamp : 'None'}</span></div>
      </div>
      
      <div style={{ 
        maxHeight: '200px', 
        overflow: 'auto',
        backgroundColor: '#111111',
        padding: '8px',
        borderRadius: '4px'
      }}>
        {logs.length === 0 ? (
          <div style={{ color: '#ff6600' }}>⚠️ NO DEBUG LOGS DETECTED</div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index}
              style={{
                color: log.level === 'success' ? '#00ff00' : 
                       log.level === 'error' ? '#ff0000' :
                       log.level === 'warning' ? '#ffaa00' : '#ffffff',
                marginBottom: '2px',
                fontSize: '11px'
              }}
            >
              [{log.timestamp}] {log.message}
            </div>
          ))
        )}
      </div>
      
      <div style={{ 
        marginTop: '10px',
        fontSize: '10px',
        color: '#888888',
        borderTop: '1px solid #333333',
        paddingTop: '5px'
      }}>
        🎯 Comet AI: Monitor this overlay for debug status
      </div>
    </div>
  );
};