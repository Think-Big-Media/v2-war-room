/**
 * Democracy Works Elections API Service
 * Free API for comprehensive election data
 * Documentation: https://data.democracy.works/api-info
 */

import { useAppSelector } from '../../hooks/redux';

const API_BASE = 'https://api.democracy.works/v1';

// Note: You'll need to register for a free API key at https://data.democracy.works
const API_KEY = import.meta.env.VITE_DEMOCRACY_WORKS_API_KEY || '';

interface ElectionData {
  id: string;
  name: string;
  electionDay: string;
  state: string;
  ocdDivisionId: string;
}

interface PollingLocation {
  address: {
    locationName?: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  notes?: string;
  pollingHours?: string;
  sources?: Array<{ name: string; official: boolean }>;
}

interface StateElectionInfo {
  state: string;
  elections: ElectionData[];
  pollingLocations?: PollingLocation[];
  earlyVoteSites?: PollingLocation[];
  dropOffLocations?: PollingLocation[];
  voterRegistrationMethods?: string[];
  absenteeVotingMethods?: string[];
}

/**
 * Get upcoming elections for a specific state
 */
export const getStateElections = async (state: string): Promise<StateElectionInfo> => {
  // Check if we're in MOCK mode
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    // Return mock data for demo/testing
    return {
      state,
      elections: [
        {
          id: 'mock-2024-general',
          name: '2024 General Election',
          electionDay: '2024-11-05',
          state,
          ocdDivisionId: `ocd-division/country:us/state:${state.toLowerCase()}`
        },
        {
          id: 'mock-2024-primary',
          name: '2024 Primary Election',
          electionDay: '2024-03-05',
          state,
          ocdDivisionId: `ocd-division/country:us/state:${state.toLowerCase()}`
        }
      ],
      voterRegistrationMethods: ['online', 'by-mail', 'in-person'],
      absenteeVotingMethods: ['no-excuse', 'by-mail']
    };
  }

  try {
    const response = await fetch(`${API_BASE}/elections?state=${state}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Democracy Works API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Democracy Works data:', error);
    // Return empty real data structure on error
    return {
      state,
      elections: [],
      pollingLocations: [],
      voterRegistrationMethods: [],
      absenteeVotingMethods: []
    };
  }
};

/**
 * Get polling locations for a specific address
 */
export const getPollingLocations = async (
  address: string,
  state: string
): Promise<PollingLocation[]> => {
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    // Return mock polling locations
    return [
      {
        address: {
          locationName: 'Community Center',
          line1: '123 Main St',
          city: 'Springfield',
          state,
          zip: '12345'
        },
        pollingHours: '7:00 AM - 8:00 PM',
        sources: [{ name: 'State Election Office', official: true }]
      },
      {
        address: {
          locationName: 'Public Library',
          line1: '456 Oak Ave',
          city: 'Springfield',
          state,
          zip: '12345'
        },
        pollingHours: '7:00 AM - 8:00 PM',
        notes: 'Early voting location'
      }
    ];
  }

  try {
    const response = await fetch(`${API_BASE}/polling-locations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        address,
        includeEarlyVoteSites: true,
        includeDropOffLocations: true
      })
    });

    if (!response.ok) {
      throw new Error(`Democracy Works API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.pollingLocations || [];
  } catch (error) {
    console.error('Error fetching polling locations:', error);
    return [];
  }
};

/**
 * Get ballot information for an address
 */
export const getBallotInfo = async (address: string): Promise<any> => {
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    return {
      contests: [
        {
          type: 'General',
          office: 'President',
          level: ['country'],
          candidates: [
            { name: 'Candidate A', party: 'Party A' },
            { name: 'Candidate B', party: 'Party B' }
          ]
        },
        {
          type: 'General',
          office: 'U.S. Senate',
          level: ['country', 'state'],
          candidates: [
            { name: 'Senator A', party: 'Party A' },
            { name: 'Senator B', party: 'Party B' }
          ]
        }
      ],
      referendums: [
        {
          title: 'Proposition 1',
          subtitle: 'Infrastructure Bond',
          brief: 'Authorize $1B in bonds for infrastructure improvements'
        }
      ]
    };
  }

  try {
    const response = await fetch(`${API_BASE}/ballot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ address })
    });

    if (!response.ok) {
      throw new Error(`Democracy Works API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ballot info:', error);
    return { contests: [], referendums: [] };
  }
};

/**
 * Get voter registration status and requirements
 */
export const getVoterRegistrationInfo = async (state: string): Promise<any> => {
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    return {
      online: true,
      onlineUrl: `https://${state.toLowerCase()}.gov/register`,
      byMailDeadline: '30 days before election',
      inPersonDeadline: 'Election day',
      requirements: [
        'Valid state ID or driver\'s license',
        'Social Security Number',
        'Proof of residency'
      ],
      checkRegistrationUrl: `https://vote.${state.toLowerCase()}.gov/check`
    };
  }

  try {
    const response = await fetch(`${API_BASE}/registration/${state}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Democracy Works API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching registration info:', error);
    return {
      online: false,
      requirements: [],
      deadlines: {}
    };
  }
};

/**
 * Batch fetch election data for multiple states
 */
export const getMultiStateElections = async (
  states: string[]
): Promise<Record<string, StateElectionInfo>> => {
  const results: Record<string, StateElectionInfo> = {};
  
  // Fetch in parallel with rate limiting
  const batchSize = 5;
  for (let i = 0; i < states.length; i += batchSize) {
    const batch = states.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(state => getStateElections(state))
    );
    
    batch.forEach((state, index) => {
      results[state] = batchResults[index];
    });
    
    // Rate limiting delay
    if (i + batchSize < states.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
};