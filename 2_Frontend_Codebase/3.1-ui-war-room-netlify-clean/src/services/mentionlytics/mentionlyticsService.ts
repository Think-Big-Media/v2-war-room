/**
 * Mentionlytics Service with Mock/Live Data Support
 * Follows the War Room pattern: Mock data for testing, Live data for production
 */

import axios from 'axios';
import { getAPIEndpoints, getEnvironmentConfig } from '../../config/apiConfig';

// Import mock data
import {
  mockSentimentData,
  mockGeographicData,
  mockMentionsFeed,
  mockInfluencers,
  mockShareOfVoice,
  mockSentimentTrend,
  generateLiveMention,
  type MentionlyticsSentiment,
  type MentionlyticsLocation,
  type MentionlyticsMention,
  type MentionlyticsInfluencer,
  type ShareOfVoiceData,
} from './mockData';

class MentionlyticsService {
  private isMockMode: boolean;
  private endpoints: ReturnType<typeof getAPIEndpoints>;
  private config: ReturnType<typeof getEnvironmentConfig>;

  constructor() {
    this.config = getEnvironmentConfig();
    this.endpoints = getAPIEndpoints();
    // Check localStorage first, then fall back to config
    const localStorageMode = localStorage.getItem('VITE_USE_MOCK_DATA');
    if (localStorageMode !== null) {
      this.isMockMode = localStorageMode === 'true';
    } else {
      // Default to LIVE mode if localStorage not set
      // Only use mock if explicitly set in config
      this.isMockMode = this.config.features.mockMode === true;
      // Set localStorage to prevent flip-flopping
      localStorage.setItem('VITE_USE_MOCK_DATA', 'false');
    }
    
    // 🔍 DIAGNOSTIC: Log the actual mode being used
    console.log('🔍 [DIAGNOSTIC] MentionlyticsService initialized:');
    console.log('   - localStorage VITE_USE_MOCK_DATA:', localStorageMode);
    console.log('   - Final isMockMode:', this.isMockMode);
    console.log('   - Backend URL:', this.endpoints.data.mentionlytics.feed);
    console.log('   - Config mockMode:', this.config.features.mockMode);
    console.log('   - API Token exists:', !!this.config.mentionlytics.apiToken);
  }

  // Toggle between mock and live data
  setDataMode(useMock: boolean) {
    this.isMockMode = useMock;
    localStorage.setItem('VITE_USE_MOCK_DATA', useMock.toString());
  }

  getDataMode() {
    return this.isMockMode ? 'MOCK' : 'LIVE';
  }

  // Sentiment Analysis - NOW CALLS BRANDMENTIONS DIRECTLY
  async getSentimentAnalysis(period: string = '7days'): Promise<MentionlyticsSentiment> {
    if (this.isMockMode) {
      console.log('🔍 [getSentimentAnalysis] Returning mock data:', mockSentimentData);
      return {
        ...mockSentimentData,
        period,
      };
    }

    // LIVE DATA: Call BrandMentions API directly
    try {
      const apiKey = import.meta.env.VITE_BRANDMENTIONS_API_KEY;
      const projectId = import.meta.env.VITE_BRANDMENTIONS_PROJECT_ID;
      
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ [getSentimentAnalysis] BrandMentions API key not set, using mock');
        return mockSentimentData;
      }

      console.log('🚀 [getSentimentAnalysis] CALLING BRANDMENTIONS API DIRECTLY');
      console.log('   - Project ID:', projectId);
      
      const response = await axios.get('https://api.brandmentions.com/command.php', {
        params: {
          api_key: apiKey,
          command: 'GetMentions',
          project_id: projectId,
          limit: 100
        },
        timeout: 10000,
      });
      
      console.log('✅ [getSentimentAnalysis] BrandMentions raw response:', response.data);
      
      // Parse BrandMentions response into our format
      const mentions = response.data.mentions || [];
      const positive = mentions.filter((m: any) => m.sentiment === 'positive').length;
      const negative = mentions.filter((m: any) => m.sentiment === 'negative').length;
      const neutral = mentions.filter((m: any) => m.sentiment === 'neutral').length;
      const total = mentions.length;
      
      const sentimentData = {
        positive,
        negative,
        neutral,
        total,
        period,
      };
      
      console.log('🎯 [getSentimentAnalysis] LIVE BRANDMENTIONS DATA:', sentimentData);
      return sentimentData;
      
    } catch (error) {
      console.error('❌ [getSentimentAnalysis] BrandMentions API error:', error);
      console.log('🔄 [getSentimentAnalysis] Using mock data as fallback');
      return {
        ...mockSentimentData,
        period,
      };
    }
  }

  // Geographic Distribution
  async getGeographicMentions(): Promise<MentionlyticsLocation[]> {
    if (this.isMockMode) {
      // Add slight variations to mock data
      return mockGeographicData.map((location) => ({
        ...location,
        mentions: location.mentions + Math.floor(Math.random() * 20 - 10),
      }));
    }

    try {
      const response = await axios.get(this.endpoints.data.mentionlytics.geo);
      return response.data;
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      return mockGeographicData;
    }
  }

  // Live Mentions Feed
  async getMentionsFeed(limit: number = 10): Promise<MentionlyticsMention[]> {
    console.log('[MentionlyticsService] getMentionsFeed - Mode:', this.isMockMode ? 'MOCK' : 'LIVE');
    
    if (this.isMockMode) {
      console.log('[MentionlyticsService] Returning MOCK data');
      const newMentions = Array(2)
        .fill(null)
        .map(() => generateLiveMention());
      return [...newMentions, ...mockMentionsFeed].slice(0, limit);
    }

    // LIVE DATA: Call our backend which has BrandMentions data from Slack webhook
    try {
      console.log('🚀 [getMentionsFeed] CALLING BACKEND WITH REAL BRANDMENTIONS DATA');
      console.log('   - Backend URL:', this.endpoints.data.mentionlytics.feed);
      console.log('   - Request limit:', limit);
      console.log('   - Current data mode:', this.getDataMode());
      
      const response = await axios.get(this.endpoints.data.mentionlytics.feed, {
        params: { limit },
        timeout: 10000,
      });
      
      console.log('✅ [getMentionsFeed] Backend response:', response.data);
      console.log('   - Mentions count:', response.data.mentions?.length || 0);
      console.log('   - Has more data:', response.data.hasMore);
      
      // Backend returns data in the correct format already
      const backendData = response.data;
      const mentions: MentionlyticsMention[] = (backendData.mentions || []).map((mention: any) => ({
        id: mention.id,
        text: mention.text,
        author: mention.author,
        platform: this.mapPlatform(mention.platform),
        sentiment: mention.sentiment || 'neutral',
        reach: mention.reach || 0,
        engagement: mention.engagement || 0,
        timestamp: mention.timestamp,
        url: mention.url || '#',
        location: mention.location || ''
      }));
      
      console.log('🎯 [getMentionsFeed] REAL BRANDMENTIONS DATA FROM BACKEND:', mentions);
      return { mentions: mentions.slice(0, limit), hasMore: backendData.hasMore };
      
    } catch (error) {
      console.error('❌ [getMentionsFeed] Backend API error:', error);
      console.log('🔄 [getMentionsFeed] Using mock data as fallback');
      return mockMentionsFeed.slice(0, limit);
    }
  }

  private mapPlatform(platform: string): 'twitter' | 'facebook' | 'instagram' | 'news' | 'blog' {
    const platformMap: { [key: string]: 'twitter' | 'facebook' | 'instagram' | 'news' | 'blog' } = {
      'twitter': 'twitter',
      'x': 'twitter', 
      'facebook': 'facebook',
      'instagram': 'instagram',
      'news': 'news',
      'blog': 'blog',
      'web': 'news',
      'reddit': 'blog'
    };
    return platformMap[platform?.toLowerCase()] || 'news';
  }

  // Influencers
  async getTopInfluencers(limit: number = 10): Promise<MentionlyticsInfluencer[]> {
    if (this.isMockMode) {
      return mockInfluencers.slice(0, limit);
    }

    try {
      const response = await axios.get(this.endpoints.data.mentionlytics.influencers, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching influencers:', error);
      return mockInfluencers.slice(0, limit);
    }
  }

  // Share of Voice
  async getShareOfVoice(): Promise<ShareOfVoiceData[]> {
    if (this.isMockMode) {
      // Add slight variations to percentages
      const total = 100;
      const data = [...mockShareOfVoice];
      const variance = Math.random() * 5;
      data[0].percentage += variance;
      data[1].percentage -= variance;
      return data;
    }

    try {
      const response = await axios.get(this.endpoints.data.mentionlytics.shareOfVoice);
      // Backend returns {data: ShareOfVoiceItem[]}, we need ShareOfVoiceData[]
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching share of voice:', error);
      return mockShareOfVoice;
    }
  }

  // Sentiment Trends
  async getSentimentTrends(days: number = 7): Promise<typeof mockSentimentTrend> {
    if (this.isMockMode) {
      return mockSentimentTrend.slice(-days);
    }

    try {
      const response = await axios.get(this.endpoints.data.mentionlytics.sentiment, {
        params: { trend: true, days },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sentiment trends:', error);
      return mockSentimentTrend.slice(-days);
    }
  }

  // Trending Topics
  async getTrendingTopics(period: string = '24hours'): Promise<any> {
    if (this.isMockMode) {
      return [
        { topic: 'War Room Platform', mentions: 342, sentiment: 'positive', growth: '+23%' },
        { topic: 'Campaign Management', mentions: 289, sentiment: 'neutral', growth: '+12%' },
        { topic: 'Political Technology', mentions: 267, sentiment: 'positive', growth: '+45%' },
        { topic: 'Real-time Analytics', mentions: 198, sentiment: 'positive', growth: '+18%' },
        { topic: 'Strategy Tools', mentions: 176, sentiment: 'neutral', growth: '+5%' },
      ];
    }

    try {
      const response = await axios.get(this.endpoints.data.mentionlytics.trending, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return [];
    }
  }

  // Available Keywords for Campaign Setup
  async getAvailableKeywords(): Promise<string[]> {
    if (this.isMockMode) {
      return [
        'War Room Platform',
        'Campaign Management',
        'Political Technology',
        'Real-time Analytics',
        'Strategy Tools',
        'Campaign Intelligence',
        'Political Dashboard',
        'Voter Analytics',
        'Campaign Strategy',
        'Political Software',
        'Election Technology',
        'Digital Campaigns',
        'Data Visualization',
        'Political Consulting',
        'Campaign Optimization',
      ];
    }

    try {
      const response = await axios.get(`${this.endpoints.data.mentionlytics.mentions}/keywords`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available keywords:', error);
      // Fallback to trending topics as keywords
      const topics = await this.getTrendingTopics();
      return topics.map((t: any) => t.topic);
    }
  }

  // WebSocket for real-time updates (simulated in mock mode)
  subscribeToLiveFeed(callback: (mention: MentionlyticsMention) => void): () => void {
    if (this.isMockMode) {
      // Simulate live updates every 30-60 seconds (much less frequent)
      const interval = setInterval(
        () => {
          const newMention = generateLiveMention();
          callback(newMention);
        },
        Math.random() * 30000 + 30000 // 30-60 seconds instead of 5-15
      );

      return () => clearInterval(interval);
    }

    // In live mode, would set up WebSocket connection
    // For now, poll the API
    const interval = setInterval(async () => {
      const mentions = await this.getMentionsFeed(1);
      if (mentions.length > 0) {
        callback(mentions[0]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }

  // Crisis Detection
  async getCrisisAlerts(): Promise<any> {
    if (this.isMockMode) {
      return {
        hasActiveCrisis: Math.random() > 0.8,
        alerts: [
          {
            id: '1',
            severity: 'medium',
            topic: 'Negative sentiment spike',
            description: 'Negative mentions increased by 45% in the last hour',
            timestamp: new Date().toISOString(),
            affected_states: ['Pennsylvania', 'Michigan'],
          },
        ],
      };
    }

    try {
      const response = await axios.get(`${this.endpoints.data.mentionlytics.mentions}/crisis`);
      return response.data;
    } catch (error) {
      console.error('Error fetching crisis alerts:', error);
      return { hasActiveCrisis: false, alerts: [] };
    }
  }
}

// Export singleton instance
export const mentionlyticsService = new MentionlyticsService();

// Export mock data for UI component development
export * from './mockData';
