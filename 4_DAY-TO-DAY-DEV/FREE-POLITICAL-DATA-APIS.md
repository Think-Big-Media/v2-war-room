# FREE POLITICAL MAP DATA SOURCES - Implementation Guide

## Overview
This document contains all the free political data API sources we researched for populating the War Room political map component with real data instead of relying solely on Mentionlytics.

## 🎯 Recommended Free APIs

### 1. Democracy Works Elections API (BEST OPTION)
**URL**: https://data.democracy.works/api-info  
**Cost**: FREE  
**Features**:
- Won Best Data API 2024
- Comprehensive election data
- Polling locations by address
- Ballot measures & districts
- Upcoming elections calendar
- Youth preregistration info
- Voting with past felony info
- Student voting guidance

**Implementation**:
```typescript
// services/democracyWorksApi.ts
const DEMOCRACY_WORKS_API = 'https://api.democracy.works';

export const getElectionData = async (state: string) => {
  const response = await fetch(`${DEMOCRACY_WORKS_API}/elections?state=${state}`, {
    headers: {
      'Authorization': `Bearer ${process.env.DEMOCRACY_WORKS_API_KEY}`
    }
  });
  return response.json();
};

export const getPollingLocations = async (address: string) => {
  const response = await fetch(`${DEMOCRACY_WORKS_API}/polling-places`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEMOCRACY_WORKS_API_KEY}`
    },
    body: JSON.stringify({ address })
  });
  return response.json();
};
```

### 2. Google Civic Information API
**URL**: https://developers.google.com/civic-information  
**Cost**: FREE  
**Features**:
- Polling locations
- Early voting locations
- Candidate data
- Election official info
- Voter registration info
- Address-specific data

**Implementation**:
```typescript
// services/googleCivicApi.ts
const GOOGLE_CIVIC_API = 'https://www.googleapis.com/civicinfo/v2';

export const getElectionInfo = async (address: string) => {
  const params = new URLSearchParams({
    key: process.env.GOOGLE_CIVIC_API_KEY,
    address: address
  });
  
  const response = await fetch(`${GOOGLE_CIVIC_API}/voterinfo?${params}`);
  return response.json();
};

export const getRepresentatives = async (address: string) => {
  const params = new URLSearchParams({
    key: process.env.GOOGLE_CIVIC_API_KEY,
    address: address
  });
  
  const response = await fetch(`${GOOGLE_CIVIC_API}/representatives?${params}`);
  return response.json();
};
```

### 3. FEC OpenFEC API
**URL**: https://api.open.fec.gov/developers/  
**Cost**: FREE  
**Features**:
- Federal campaign finance data
- Updates every 15 minutes
- Candidate spending
- Committee contributions
- Individual donations
- PAC activity

**Implementation**:
```typescript
// services/fecApi.ts
const FEC_API = 'https://api.open.fec.gov/v1';

export const getCandidateFinances = async (candidateId: string) => {
  const params = new URLSearchParams({
    api_key: process.env.FEC_API_KEY,
    candidate_id: candidateId,
    per_page: '100'
  });
  
  const response = await fetch(`${FEC_API}/candidates/?${params}`);
  return response.json();
};

export const getStateContributions = async (state: string, cycle: number = 2024) => {
  const params = new URLSearchParams({
    api_key: process.env.FEC_API_KEY,
    state: state,
    cycle: cycle.toString(),
    per_page: '100'
  });
  
  const response = await fetch(`${FEC_API}/schedules/schedule_a/?${params}`);
  return response.json();
};
```

### 4. MIT Election Lab
**URL**: https://electionlab.mit.edu/data  
**Cost**: FREE  
**Features**:
- 2024 election results (precinct level)
- Historical voting data
- Turnout statistics
- Electoral analysis data

**Implementation**:
```typescript
// services/mitElectionApi.ts
export const getElectionResults = async (state: string, year: number = 2024) => {
  // MIT Election Lab provides CSV/JSON downloads
  const response = await fetch(
    `https://electionlab.mit.edu/api/elections/${year}/${state}.json`
  );
  return response.json();
};
```

### 5. Vote Smart API
**URL**: https://votesmart.org/share/api  
**Cost**: FREE (with attribution)  
**Features**:
- Candidate bios
- Voting records
- Position statements
- Ratings from organizations
- Districts info

**Implementation**:
```typescript
// services/voteSmartApi.ts
const VOTE_SMART_API = 'https://api.votesmart.org';

export const getCandidateBio = async (candidateId: string) => {
  const params = new URLSearchParams({
    key: process.env.VOTE_SMART_API_KEY,
    o: 'JSON'
  });
  
  const response = await fetch(
    `${VOTE_SMART_API}/CandidateBio.getBio?candidateId=${candidateId}&${params}`
  );
  return response.json();
};
```

## 🗺️ Enhanced Political Map Component

### Combining All Data Sources:
```typescript
// components/political/EnhancedPoliticalMap.tsx
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { getElectionData } from '../../services/democracyWorksApi';
import { getStateContributions } from '../../services/fecApi';
import { getElectionInfo } from '../../services/googleCivicApi';

interface StateData {
  name: string;
  abbreviation: string;
  // Election data
  upcomingElections?: any[];
  pollingLocations?: any[];
  // Finance data
  totalContributions?: number;
  topDonors?: any[];
  // Sentiment data (from Mentionlytics)
  sentiment?: number;
  mentions?: number;
  // Civic data
  representatives?: any[];
  voterRegistration?: any;
}

const EnhancedPoliticalMap: React.FC = () => {
  const [stateData, setStateData] = useState<Record<string, StateData>>({});
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [dataLayer, setDataLayer] = useState<'sentiment' | 'finance' | 'elections'>('sentiment');

  useEffect(() => {
    loadStateData();
  }, []);

  const loadStateData = async () => {
    // Load data from all sources
    const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'OH', 'GA', 'NC', 'MI', 'AZ'];
    
    for (const state of states) {
      try {
        // Parallel fetch from all APIs
        const [elections, contributions, civic] = await Promise.all([
          getElectionData(state),
          getStateContributions(state),
          getElectionInfo(`${state}, USA`)
        ]);
        
        setStateData(prev => ({
          ...prev,
          [state]: {
            name: state,
            abbreviation: state,
            upcomingElections: elections.elections,
            totalContributions: contributions.results?.reduce(
              (sum: number, c: any) => sum + c.contribution_receipt_amount, 0
            ),
            representatives: civic.officials
          }
        }));
      } catch (error) {
        console.error(`Error loading data for ${state}:`, error);
      }
    }
  };

  const getStateColor = (stateCode: string) => {
    const state = stateData[stateCode];
    if (!state) return '#374151'; // Default gray
    
    switch (dataLayer) {
      case 'sentiment':
        // Color based on sentiment (existing Mentionlytics data)
        const sentiment = state.sentiment || 0;
        return sentiment > 0 ? '#10B981' : sentiment < 0 ? '#EF4444' : '#6B7280';
        
      case 'finance':
        // Color based on contribution levels
        const contributions = state.totalContributions || 0;
        if (contributions > 10000000) return '#1E40AF'; // Deep blue
        if (contributions > 5000000) return '#3B82F6';  // Medium blue
        if (contributions > 1000000) return '#93C5FD';  // Light blue
        return '#DBEAFE'; // Very light blue
        
      case 'elections':
        // Color based on number of upcoming elections
        const elections = state.upcomingElections?.length || 0;
        if (elections > 3) return '#DC2626'; // High activity
        if (elections > 1) return '#F59E0B'; // Medium activity
        return '#10B981'; // Low activity
        
      default:
        return '#374151';
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Data Layer Selector */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setDataLayer('sentiment')}
            className={`px-3 py-1 rounded ${dataLayer === 'sentiment' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Sentiment
          </button>
          <button
            onClick={() => setDataLayer('finance')}
            className={`px-3 py-1 rounded ${dataLayer === 'finance' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Finance
          </button>
          <button
            onClick={() => setDataLayer('elections')}
            className={`px-3 py-1 rounded ${dataLayer === 'elections' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Elections
          </button>
        </div>
      </div>

      {/* Map */}
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography="/us-states.json">
          {({ geographies }) =>
            geographies.map(geo => {
              const stateCode = geo.properties.STUSPS;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getStateColor(stateCode)}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#F59E0B', outline: 'none' },
                    pressed: { outline: 'none' }
                  }}
                  onClick={() => setSelectedState(stateCode)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* State Details Panel */}
      {selectedState && stateData[selectedState] && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
          <h3 className="font-bold text-lg mb-2">{selectedState}</h3>
          
          {dataLayer === 'sentiment' && (
            <div>
              <p>Sentiment Score: {stateData[selectedState].sentiment || 'N/A'}</p>
              <p>Total Mentions: {stateData[selectedState].mentions || 'N/A'}</p>
            </div>
          )}
          
          {dataLayer === 'finance' && (
            <div>
              <p>Total Contributions: ${(stateData[selectedState].totalContributions || 0).toLocaleString()}</p>
              <p>Top Donors: {stateData[selectedState].topDonors?.length || 0}</p>
            </div>
          )}
          
          {dataLayer === 'elections' && (
            <div>
              <p>Upcoming Elections: {stateData[selectedState].upcomingElections?.length || 0}</p>
              <p>Polling Locations: {stateData[selectedState].pollingLocations?.length || 'N/A'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedPoliticalMap;
```

## 📝 Environment Variables Needed

Add to your `.env` file:
```bash
# Democracy Works API
DEMOCRACY_WORKS_API_KEY=your_key_here

# Google Civic Information API
GOOGLE_CIVIC_API_KEY=your_key_here

# FEC OpenFEC API
FEC_API_KEY=your_key_here

# Vote Smart API
VOTE_SMART_API_KEY=your_key_here
```

## 🚀 Implementation Steps

1. **Register for API Keys**:
   - Democracy Works: https://data.democracy.works/api-info
   - Google Civic: https://console.cloud.google.com/
   - FEC: https://api.open.fec.gov/developers/
   - Vote Smart: https://votesmart.org/share/api

2. **Create Service Files**:
   - `/services/democracyWorksApi.ts`
   - `/services/googleCivicApi.ts`
   - `/services/fecApi.ts`
   - `/services/voteSmartApi.ts`

3. **Update Political Map Component**:
   - Add data layer selector
   - Integrate multiple API sources
   - Create rich tooltips with real data

4. **Add Caching Layer**:
   - Cache API responses for 1 hour
   - Use React Query or SWR for data fetching
   - Implement error boundaries

## 🎨 Data Visualization Options

1. **Sentiment Layer** (Mentionlytics):
   - Red/Blue gradient based on sentiment
   - Bubble size for mention volume

2. **Finance Layer** (FEC):
   - Heat map of contribution amounts
   - Top donor lists per state

3. **Elections Layer** (Democracy Works):
   - Upcoming election indicators
   - Polling location density

4. **Civic Layer** (Google Civic):
   - Representative information
   - Voter registration deadlines

## 📊 State-Level Data Aggregation

For better state-level insights, combine:
- Mentionlytics sentiment (already have)
- FEC contribution data (federal level)
- Democracy Works election calendar
- Google Civic polling locations
- MIT Election Lab historical results

This creates a comprehensive political intelligence map that goes beyond just social media sentiment!