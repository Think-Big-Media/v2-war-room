import React, { useState, useEffect } from 'react';

// FEC API Configuration
const FEC_API_KEY = import.meta.env.VITE_FEC_API_KEY || '3kSPSUh0S5UnrM3XCLYLQcS1H31ILf04n5nqr9He';
const FEC_API_BASE = 'https://api.open.fec.gov/v1';

interface StateData {
  name: string;
  code: string;
  totalContributions: number;
  contributors: number;
  sentiment: number;
  displayValue: string;
  color: string;
}

const LiveDataPoliticalMap: React.FC = () => {
  const [statesData, setStatesData] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [dataMode, setDataMode] = useState<'real' | 'mock'>('real');

  // Initial states with mock data (will be replaced with real data)
  const initialStates: StateData[] = [
    { name: 'Texas', code: 'TX', totalContributions: 0, contributors: 0, sentiment: 7, displayValue: '+7%', color: '#22c55e' },
    { name: 'Florida', code: 'FL', totalContributions: 0, contributors: 0, sentiment: -4, displayValue: '-4%', color: '#ef4444' },
    { name: 'Georgia', code: 'GA', totalContributions: 0, contributors: 0, sentiment: 16, displayValue: '+16%', color: '#22c55e' },
    { name: 'Ohio', code: 'OH', totalContributions: 0, contributors: 0, sentiment: 3, displayValue: '+3%', color: '#22c55e' },
    { name: 'Pennsylvania', code: 'PA', totalContributions: 0, contributors: 0, sentiment: 10, displayValue: '+10%', color: '#22c55e' },
    { name: 'North Carolina', code: 'NC', totalContributions: 0, contributors: 0, sentiment: 6, displayValue: '+6%', color: '#22c55e' },
    { name: 'Michigan', code: 'MI', totalContributions: 0, contributors: 0, sentiment: -16, displayValue: '-16%', color: '#ef4444' },
    { name: 'Arizona', code: 'AZ', totalContributions: 0, contributors: 0, sentiment: 0, displayValue: '0%', color: '#6b7280' },
    { name: 'Wisconsin', code: 'WI', totalContributions: 0, contributors: 0, sentiment: 0, displayValue: '0%', color: '#6b7280' },
    { name: 'Nevada', code: 'NV', totalContributions: 0, contributors: 0, sentiment: 0, displayValue: '0%', color: '#3b82f6' },
    { name: 'California', code: 'CA', totalContributions: 0, contributors: 0, sentiment: 0, displayValue: '0%', color: '#3b82f6' },
    { name: 'New York', code: 'NY', totalContributions: 0, contributors: 0, sentiment: 0, displayValue: '0%', color: '#6b7280' },
  ];

  useEffect(() => {
    if (dataMode === 'real') {
      fetchRealData();
    } else {
      setStatesData(initialStates);
      setLoading(false);
    }
  }, [dataMode]);

  const fetchRealData = async () => {
    setLoading(true);
    console.log('Fetching real FEC data...');
    
    const updatedStates = [...initialStates];
    
    // Fetch data for each state
    for (let i = 0; i < updatedStates.length; i++) {
      const state = updatedStates[i];
      try {
        const response = await fetch(
          `${FEC_API_BASE}/schedules/schedule_a/by_state/?api_key=${FEC_API_KEY}&state=${state.code}&cycle=2024&per_page=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          const total = data.results?.[0]?.total || 0;
          const count = data.results?.[0]?.count || 0;
          
          updatedStates[i] = {
            ...state,
            totalContributions: total,
            contributors: count,
            displayValue: formatMoney(total),
            sentiment: calculateSentiment(total),
            color: getColorForAmount(total)
          };
          
          console.log(`${state.name}: $${total.toLocaleString()}`);
        }
      } catch (error) {
        console.error(`Error fetching data for ${state.name}:`, error);
      }
    }
    
    setStatesData(updatedStates);
    setLoading(false);
  };

  const formatMoney = (amount: number): string => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const calculateSentiment = (amount: number): number => {
    // Convert contribution amount to sentiment score
    if (amount > 100000000) return 50; // Very high
    if (amount > 50000000) return 30;
    if (amount > 20000000) return 15;
    if (amount > 10000000) return 5;
    if (amount > 5000000) return 0;
    return -10; // Low activity
  };

  const getColorForAmount = (amount: number): string => {
    if (amount > 100000000) return '#1e3a8a'; // Dark blue - Very high
    if (amount > 50000000) return '#2563eb'; // Blue - High
    if (amount > 20000000) return '#3b82f6'; // Medium blue
    if (amount > 10000000) return '#60a5fa'; // Light blue
    if (amount > 5000000) return '#93c5fd'; // Very light blue
    if (amount > 0) return '#dbeafe'; // Pale blue
    return '#6b7280'; // Gray - No data
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">Political Activity Map</h3>
          <p className="text-gray-400 text-sm">
            {loading ? 'Loading real FEC data...' : dataMode === 'real' ? 'Live FEC Campaign Finance Data' : 'Mock Data Mode'}
          </p>
        </div>
        
        {/* Data Mode Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setDataMode('real')}
            className={`px-3 py-1 rounded text-sm ${
              dataMode === 'real' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            🚀 Real Data
          </button>
          <button
            onClick={() => setDataMode('mock')}
            className={`px-3 py-1 rounded text-sm ${
              dataMode === 'mock' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            🔧 Mock Data
          </button>
        </div>
      </div>

      {/* Simple US Map using SVG */}
      <div className="relative">
        <svg viewBox="0 0 959 593" className="w-full h-full">
          {/* Background */}
          <rect width="959" height="593" fill="#1f2937"/>
          
          {/* Simplified US states as rectangles in approximate positions */}
          {/* This is a simplified representation - in production you'd use a proper map library */}
          
          {/* West Coast */}
          <rect x="50" y="150" width="80" height="100" fill={statesData.find(s => s.code === 'CA')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80" 
                onMouseEnter={() => setHoveredState('CA')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>California</title>
          </rect>
          
          <rect x="150" y="200" width="60" height="80" fill={statesData.find(s => s.code === 'NV')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('NV')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>Nevada</title>
          </rect>
          
          <rect x="230" y="250" width="60" height="60" fill={statesData.find(s => s.code === 'AZ')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('AZ')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>Arizona</title>
          </rect>
          
          {/* Texas */}
          <rect x="350" y="350" width="120" height="120" fill={statesData.find(s => s.code === 'TX')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('TX')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>Texas</title>
          </rect>
          
          {/* Midwest */}
          <rect x="500" y="150" width="60" height="60" fill={statesData.find(s => s.code === 'WI')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('WI')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>Wisconsin</title>
          </rect>
          
          <rect x="570" y="180" width="70" height="60" fill={statesData.find(s => s.code === 'MI')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('MI')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>Michigan</title>
          </rect>
          
          <rect x="650" y="200" width="60" height="50" fill={statesData.find(s => s.code === 'OH')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('OH')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>Ohio</title>
          </rect>
          
          {/* East Coast */}
          <rect x="720" y="180" width="50" height="40" fill={statesData.find(s => s.code === 'PA')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('PA')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>Pennsylvania</title>
          </rect>
          
          <rect x="780" y="120" width="40" height="50" fill={statesData.find(s => s.code === 'NY')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('NY')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>New York</title>
          </rect>
          
          {/* Southeast */}
          <rect x="680" y="320" width="60" height="40" fill={statesData.find(s => s.code === 'NC')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('NC')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>North Carolina</title>
          </rect>
          
          <rect x="620" y="380" width="50" height="50" fill={statesData.find(s => s.code === 'GA')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('GA')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>Georgia</title>
          </rect>
          
          <rect x="680" y="450" width="100" height="60" fill={statesData.find(s => s.code === 'FL')?.color || '#6b7280'} 
                className="cursor-pointer hover:opacity-80"
                onMouseEnter={() => setHoveredState('FL')}
                onMouseLeave={() => setHoveredState(null)}>
            <title>Florida</title>
          </rect>
          
          {/* State Labels with Values */}
          {statesData.map(state => {
            let x = 0, y = 0;
            switch(state.code) {
              case 'CA': x = 90; y = 200; break;
              case 'TX': x = 410; y = 410; break;
              case 'FL': x = 730; y = 480; break;
              case 'NY': x = 800; y = 145; break;
              case 'PA': x = 745; y = 200; break;
              case 'OH': x = 680; y = 225; break;
              case 'MI': x = 605; y = 210; break;
              case 'GA': x = 645; y = 405; break;
              case 'NC': x = 710; y = 340; break;
              case 'AZ': x = 260; y = 280; break;
              case 'WI': x = 530; y = 180; break;
              case 'NV': x = 180; y = 240; break;
            }
            
            if (x > 0) {
              return (
                <text key={state.code} x={x} y={y} 
                      fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {state.code}
                  <tspan x={x} dy="15" fontSize="10" fill="#94a3b8">
                    {dataMode === 'real' ? state.displayValue : `${state.sentiment > 0 ? '+' : ''}${state.sentiment}%`}
                  </tspan>
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Hover Info Box */}
      {hoveredState && (
        <div className="absolute bottom-4 left-4 bg-gray-800 rounded-lg p-3 shadow-lg">
          <h4 className="text-white font-semibold">
            {statesData.find(s => s.code === hoveredState)?.name}
          </h4>
          {dataMode === 'real' ? (
            <>
              <p className="text-sm text-gray-300">
                Total Contributions: {statesData.find(s => s.code === hoveredState)?.displayValue}
              </p>
              <p className="text-sm text-gray-300">
                Contributors: {statesData.find(s => s.code === hoveredState)?.contributors.toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-300">
              Sentiment: {statesData.find(s => s.code === hoveredState)?.sentiment}%
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-gray-800 rounded-lg p-2">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">
          {dataMode === 'real' ? 'Contribution Levels' : 'Sentiment'}
        </h4>
        {dataMode === 'real' ? (
          <div className="space-y-1 text-xs text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-900 rounded"></div>
              <span>&gt;$100M</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span>$50-100M</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span>$10-50M</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span>&lt;$10M</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-xs text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Positive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span>Neutral</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Negative</span>
            </div>
          </div>
        )}
      </div>

      {/* Top Activity States */}
      <div className="mt-4 bg-gray-800 rounded-lg p-3">
        <h4 className="text-white font-semibold text-sm mb-2">TOP ACTIVITY</h4>
        <div className="space-y-1">
          {statesData
            .filter(s => s.totalContributions > 0)
            .sort((a, b) => b.totalContributions - a.totalContributions)
            .slice(0, 5)
            .map(state => (
              <div key={state.code} className="flex justify-between text-xs">
                <span className="text-gray-400">{state.name}:</span>
                <span className="text-green-400 font-semibold">
                  {dataMode === 'real' ? state.displayValue : `${state.sentiment > 0 ? '+' : ''}${state.sentiment}%`}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LiveDataPoliticalMap;