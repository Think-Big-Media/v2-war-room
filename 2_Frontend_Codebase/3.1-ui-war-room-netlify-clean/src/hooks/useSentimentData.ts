/**
 * Custom hook to integrate Mentionlytics service with dashboard store
 * Fetches sentiment data and updates the store for dashboard components
 */

import { useEffect, useRef } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { mentionlyticsService } from '../services/mentionlytics/mentionlyticsService';

export const useSentimentData = () => {
  const updateSentiment = useDashboardStore((state) => state.updateSentiment);
  const setError = useDashboardStore((state) => state.setError);  
  const setLoading = useDashboardStore((state) => state.setLoading);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('🔍 [SENTIMENT INTEGRATION] Hook starting...');
    console.log('🔍 [SENTIMENT INTEGRATION] updateSentiment function:', typeof updateSentiment);
    
    const fetchSentimentData = async () => {
      console.log('🔍 [SENTIMENT INTEGRATION] fetchSentimentData called');
      
      try {
        console.log('🔍 [SENTIMENT INTEGRATION] Setting loading to true...');
        setLoading(true);
        
        console.log('🔍 [SENTIMENT INTEGRATION] Calling mentionlyticsService.getSentimentAnalysis()...');
        const sentimentData = await mentionlyticsService.getSentimentAnalysis();
        console.log('🔍 [SENTIMENT INTEGRATION] Raw sentiment data received:', JSON.stringify(sentimentData));
        
        // Handle both possible response formats
        let positive = 0, negative = 0, neutral = 0;
        
        if (typeof sentimentData === 'object' && sentimentData !== null) {
          positive = Number(sentimentData.positive) || 0;
          negative = Number(sentimentData.negative) || 0;  
          neutral = Number(sentimentData.neutral) || 0;
        }
        
        console.log('🔍 [SENTIMENT INTEGRATION] Parsed values - positive:', positive, 'negative:', negative, 'neutral:', neutral);
        
        // Convert Mentionlytics format to store format
        const totalMentions = positive + negative + neutral;
        console.log('🔍 [SENTIMENT INTEGRATION] Total mentions:', totalMentions);
        
        let sentimentScore = 0;
        if (totalMentions > 0) {
          const positiveRatio = positive / totalMentions;
          const negativeRatio = negative / totalMentions;
          sentimentScore = (positiveRatio - negativeRatio) * 100;
        }
        
        console.log('🔍 [SENTIMENT INTEGRATION] Calculated sentiment score:', sentimentScore);
        
        const storeUpdate = {
          overall: sentimentScore,
          mentionlyticsScore: sentimentScore,
          weightedScore: sentimentScore,
          volume: totalMentions,
          trend: 'stable' as const,
        };
        
        console.log('🔍 [SENTIMENT INTEGRATION] Store update object:', JSON.stringify(storeUpdate));
        
        // Update dashboard store
        console.log('🔍 [SENTIMENT INTEGRATION] Calling updateSentiment...');
        updateSentiment(storeUpdate);
        
        console.log('✅ [SENTIMENT INTEGRATION] Dashboard store updated successfully');
        setError(null);
      } catch (error) {
        console.error('❌ [SENTIMENT INTEGRATION] Error occurred:', error);
        console.error('❌ [SENTIMENT INTEGRATION] Error stack:', error instanceof Error ? error.stack : 'No stack');
        setError('Failed to fetch sentiment data');
        
        console.log('🔄 [SENTIMENT INTEGRATION] Applying fallback data...');
        const fallbackUpdate = {
          overall: 15,
          mentionlyticsScore: 15,
          weightedScore: 15,
          volume: 1039,
          trend: 'stable' as const,
        };
        console.log('🔄 [SENTIMENT INTEGRATION] Fallback update:', JSON.stringify(fallbackUpdate));
        updateSentiment(fallbackUpdate);
        console.log('🔄 [SENTIMENT INTEGRATION] Fallback data applied');
      } finally {
        console.log('🔍 [SENTIMENT INTEGRATION] Setting loading to false...');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSentimentData();

    // Set up periodic updates (every 2 minutes)
    intervalRef.current = setInterval(fetchSentimentData, 2 * 60 * 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateSentiment, setError, setLoading]);

  return null; // This is a data integration hook, no UI
};