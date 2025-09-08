import React, { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { getStateElections as getElectionData, getPollingLocations } from '../../services/political/democracyWorksApi';
import { getCandidateFinancials as getCandidateFinances, getStateContributionStats as getStateContributions } from '../../services/political/fecApi';
import { getElections as getElectionInfo, getRepresentatives } from '../../services/political/googleCivicApi';
import { useGeographicMentions } from '../../hooks/useMentionlytics';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

interface StateData {
  name: string;
  abbreviation: string;
  // Election data from Democracy Works
  upcomingElections?: any[];
  pollingLocations?: any[];
  // Finance data from FEC
  totalContributions?: number;
  topDonors?: any[];
  contributionTrend?: 'up' | 'down' | 'stable';
  // Civic data from Google
  representatives?: any[];
  voterRegistration?: any;
  // Sentiment data from Mentionlytics
  sentiment?: number;
  mentions?: number;
  sentimentScore?: number;
  // Calculated metrics
  politicalActivity?: number; // Combined score
}

type DataLayer = 'sentiment' | 'finance' | 'elections' | 'activity';

const EnhancedPoliticalMap: React.FC = () => {
  const [stateData, setStateData] = useState<Record<string, StateData>>({});
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [dataLayer, setDataLayer] = useState<DataLayer>('activity');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get Mentionlytics data
  const { data: mentionlyticsData, dataMode } = useGeographicMentions();

  // List of states to load data for (focus on swing states first)
  const priorityStates = [
    'PA', 'MI', 'WI', 'AZ', 'GA', 'NV', 'NC',
    'FL', 'TX', 'OH', 'VA', 'NH', 'IA', 'CO'
  ];

  useEffect(() => {
    loadStateData();
  }, []);

  const loadStateData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load data for priority states
      for (const state of priorityStates) {
        try {
          // Parallel fetch from all APIs with error handling
          const [elections, contributions, civic] = await Promise.allSettled([
            getElectionData(state).catch(() => null),
            getStateContributions(state).catch(() => null),
            getElectionInfo(`${state}, USA`).catch(() => null)
          ]);
          
          const electionData = elections.status === 'fulfilled' ? elections.value : null;
          const contributionData = contributions.status === 'fulfilled' ? contributions.value : null;
          const civicData = civic.status === 'fulfilled' ? civic.value : null;
          
          // Calculate total contributions
          const totalContributions = contributionData?.results?.reduce(
            (sum: number, c: any) => sum + (c.contribution_receipt_amount || 0), 
            0
          ) || 0;
          
          // Calculate political activity score (0-100)
          const activityScore = calculateActivityScore({
            elections: electionData?.elections?.length || 0,
            contributions: totalContributions,
            representatives: civicData?.officials?.length || 0
          });
          
          setStateData(prev => ({
            ...prev,
            [state]: {
              name: getStateName(state),
              abbreviation: state,
              upcomingElections: electionData?.elections || [],
              totalContributions,
              representatives: civicData?.officials || [],
              voterRegistration: civicData?.voterRegistration,
              politicalActivity: activityScore,
              // Mentionlytics data will be merged later
              sentiment: 0,
              mentions: 0
            }
          }));
        } catch (error) {
          console.error(`Error loading data for ${state}:`, error);
        }
      }
    } catch (error) {
      console.error('Error loading state data:', error);
      setError('Failed to load political data. Using cached data.');
    } finally {
      setLoading(false);
    }
  };

  // Merge Mentionlytics data with API data
  const mergedStateData = useMemo(() => {
    const merged = { ...stateData };
    
    if (mentionlyticsData?.geographic) {
      Object.entries(mentionlyticsData.geographic).forEach(([state, data]: [string, any]) => {
        const stateAbbr = getStateAbbreviation(state);
        if (stateAbbr && merged[stateAbbr]) {
          merged[stateAbbr] = {
            ...merged[stateAbbr],
            sentiment: data.sentiment || 0,
            mentions: data.mentions || 0,
            sentimentScore: data.sentimentScore || 0
          };
        }
      });
    }
    
    return merged;
  }, [stateData, mentionlyticsData]);

  const getStateColor = (geo: any) => {
    const stateAbbr = geo.properties.STUSPS || geo.id;
    const state = mergedStateData[stateAbbr];
    
    if (!state) return '#1F2937'; // Default dark gray
    
    switch (dataLayer) {
      case 'sentiment': {
        const sentiment = state.sentimentScore || state.sentiment || 0;
        if (sentiment > 10) return '#10B981'; // Positive - green
        if (sentiment < -10) return '#EF4444'; // Negative - red
        return '#6B7280'; // Neutral - gray
      }
      
      case 'finance': {
        const contributions = state.totalContributions || 0;
        const scale = scaleLinear<string>()
          .domain([0, 1000000, 5000000, 10000000])
          .range(['#DBEAFE', '#93C5FD', '#3B82F6', '#1E40AF']);
        return scale(contributions);
      }
      
      case 'elections': {
        const elections = state.upcomingElections?.length || 0;
        if (elections > 3) return '#DC2626'; // High activity - red
        if (elections > 1) return '#F59E0B'; // Medium - yellow
        if (elections > 0) return '#10B981'; // Low - green
        return '#6B7280'; // None - gray
      }
      
      case 'activity': {
        const activity = state.politicalActivity || 0;
        const scale = scaleLinear<string>()
          .domain([0, 25, 50, 75, 100])
          .range(['#F3F4F6', '#9CA3AF', '#6B7280', '#4B5563', '#1F2937']);
        return scale(activity);
      }
      
      default:
        return '#1F2937';
    }
  };

  const calculateActivityScore = (data: {
    elections: number;
    contributions: number;
    representatives: number;
  }) => {
    // Normalize each metric to 0-100 scale
    const electionScore = Math.min(data.elections * 20, 100);
    const contributionScore = Math.min((data.contributions / 10000000) * 100, 100);
    const repScore = Math.min(data.representatives * 5, 100);
    
    // Weighted average
    return (electionScore * 0.3 + contributionScore * 0.5 + repScore * 0.2);
  };

  const getStateName = (abbr: string): string => {
    const stateNames: Record<string, string> = {
      'PA': 'Pennsylvania', 'MI': 'Michigan', 'WI': 'Wisconsin',
      'AZ': 'Arizona', 'GA': 'Georgia', 'NV': 'Nevada',
      'NC': 'North Carolina', 'FL': 'Florida', 'TX': 'Texas',
      'OH': 'Ohio', 'VA': 'Virginia', 'NH': 'New Hampshire',
      'IA': 'Iowa', 'CO': 'Colorado'
    };
    return stateNames[abbr] || abbr;
  };

  const getStateAbbreviation = (name: string): string => {
    const abbrs: Record<string, string> = {
      'Pennsylvania': 'PA', 'Michigan': 'MI', 'Wisconsin': 'WI',
      'Arizona': 'AZ', 'Georgia': 'GA', 'Nevada': 'NV',
      'North Carolina': 'NC', 'Florida': 'FL', 'Texas': 'TX',
      'Ohio': 'OH', 'Virginia': 'VA', 'New Hampshire': 'NH',
      'Iowa': 'IA', 'Colorado': 'CO'
    };
    return abbrs[name] || '';
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Data Layer Selector */}
      <div className="absolute top-4 right-4 z-10 bg-gray-800 rounded-lg shadow-lg p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setDataLayer('activity')}
            className={`px-3 py-1 rounded transition-colors ${
              dataLayer === 'activity' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setDataLayer('sentiment')}
            className={`px-3 py-1 rounded transition-colors ${
              dataLayer === 'sentiment' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Sentiment
          </button>
          <button
            onClick={() => setDataLayer('finance')}
            className={`px-3 py-1 rounded transition-colors ${
              dataLayer === 'finance' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Finance
          </button>
          <button
            onClick={() => setDataLayer('elections')}
            className={`px-3 py-1 rounded transition-colors ${
              dataLayer === 'elections' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Elections
          </button>
        </div>
      </div>

      {/* Data Source Indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-gray-800 rounded-lg px-3 py-1 text-xs text-gray-400">
          {dataMode === 'MOCK' ? '🔧 Mock Data' : '🚀 Live APIs'}
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-20">
          <div className="text-white">Loading political data...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg z-10">
          {error}
        </div>
      )}

      {/* Map */}
      <ComposableMap 
        projection="geoAlbersUsa"
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getStateColor(geo)}
                stroke="#374151"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { 
                    fill: '#F59E0B', 
                    outline: 'none',
                    cursor: 'pointer'
                  },
                  pressed: { outline: 'none' }
                }}
                onClick={() => {
                  const stateAbbr = geo.properties.STUSPS || geo.id;
                  setSelectedState(stateAbbr);
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      {/* State Details Panel */}
      {selectedState && mergedStateData[selectedState] && (
        <div className="absolute bottom-4 left-4 bg-gray-800 rounded-lg shadow-xl p-4 max-w-md text-white">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg">
              {mergedStateData[selectedState].name} ({selectedState})
            </h3>
            <button
              onClick={() => setSelectedState(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {dataLayer === 'sentiment' && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-400">Sentiment Score:</span>{' '}
                <span className={`font-semibold ${
                  (mergedStateData[selectedState].sentimentScore || 0) > 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {mergedStateData[selectedState].sentimentScore?.toFixed(1) || 'N/A'}%
                </span>
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Total Mentions:</span>{' '}
                {mergedStateData[selectedState].mentions?.toLocaleString() || 'N/A'}
              </p>
            </div>
          )}
          
          {dataLayer === 'finance' && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-400">Total Contributions:</span>{' '}
                <span className="font-semibold text-green-400">
                  ${(mergedStateData[selectedState].totalContributions || 0).toLocaleString()}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Data Source:</span> FEC OpenFEC API
              </p>
            </div>
          )}
          
          {dataLayer === 'elections' && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-400">Upcoming Elections:</span>{' '}
                <span className="font-semibold">
                  {mergedStateData[selectedState].upcomingElections?.length || 0}
                </span>
              </p>
              {mergedStateData[selectedState].upcomingElections?.slice(0, 3).map((election: any, idx: number) => (
                <p key={idx} className="text-xs text-gray-400">
                  • {election.name || 'Election'} - {election.date || 'Date TBD'}
                </p>
              ))}
              <p className="text-sm">
                <span className="text-gray-400">Data Source:</span> Democracy Works API
              </p>
            </div>
          )}
          
          {dataLayer === 'activity' && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-400">Political Activity Score:</span>{' '}
                <span className="font-semibold text-blue-400">
                  {mergedStateData[selectedState].politicalActivity?.toFixed(0) || 0}/100
                </span>
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Elections:</span>{' '}
                {mergedStateData[selectedState].upcomingElections?.length || 0}
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Total Contributions:</span>{' '}
                ${(mergedStateData[selectedState].totalContributions || 0).toLocaleString()}
              </p>
              <p className="text-sm">
                <span className="text-gray-400">Representatives:</span>{' '}
                {mergedStateData[selectedState].representatives?.length || 0}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg p-3">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">
          {dataLayer === 'sentiment' && 'Sentiment'}
          {dataLayer === 'finance' && 'Contribution Level'}
          {dataLayer === 'elections' && 'Election Activity'}
          {dataLayer === 'activity' && 'Political Activity'}
        </h4>
        <div className="space-y-1">
          {dataLayer === 'sentiment' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-400">Positive</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span className="text-xs text-gray-400">Neutral</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-400">Negative</span>
              </div>
            </>
          )}
          {dataLayer === 'finance' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-900 rounded"></div>
                <span className="text-xs text-gray-400">&gt;$10M</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-xs text-gray-400">$5-10M</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-300 rounded"></div>
                <span className="text-xs text-gray-400">&lt;$5M</span>
              </div>
            </>
          )}
          {dataLayer === 'elections' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span className="text-xs text-gray-400">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs text-gray-400">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-400">Low</span>
              </div>
            </>
          )}
          {dataLayer === 'activity' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-900 rounded"></div>
                <span className="text-xs text-gray-400">Very High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-600 rounded"></div>
                <span className="text-xs text-gray-400">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded"></div>
                <span className="text-xs text-gray-400">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <span className="text-xs text-gray-400">Low</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPoliticalMap;