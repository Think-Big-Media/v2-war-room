import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../shared/Card';
import { mentionlyticsService } from '../../services/mentionlytics/mentionlyticsService';

export const PhraseCloud: React.FC = () => {
  const navigate = useNavigate();
  const [campaignData, setCampaignData] = useState<any>(null);
  const [trendingPhrases, setTrendingPhrases] = useState<string[]>([]);
  const [topKeywords, setTopKeywords] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('warRoomCampaignSetup');
    let parsedCampaignData = null;
    if (stored) {
      parsedCampaignData = JSON.parse(stored);
      setCampaignData(parsedCampaignData);
      
      // Extract competitors from campaign data
      if (parsedCampaignData?.competitors) {
        setCompetitors(parsedCampaignData.competitors);
      }
      
      // Extract keywords from campaign data
      if (parsedCampaignData?.keywords) {
        setTopKeywords(parsedCampaignData.keywords.slice(0, 3)); // Top 3 keywords
      }
    }

    // Load actual mentions from the feed (BrandMentions from Slack)
    mentionlyticsService.getMentionsFeed().then((response) => {
      console.log('🔍 [PhraseCloud] Raw response from backend:', response);
      
      if (response?.mentions && response.mentions.length > 0) {
        // Filter to only recent mentions (last 2 months)
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        
        const recentMentions = response.mentions.filter((mention: any) => {
          const mentionDate = new Date(mention.timestamp);
          const isRecent = mentionDate >= twoMonthsAgo;
          console.log(`📅 [PhraseCloud] Mention date: ${mentionDate.toLocaleDateString()}, Recent: ${isRecent}`);
          return isRecent;
        });
        
        console.log(`🕐 [PhraseCloud] Filtered to ${recentMentions.length} recent mentions from last 2 months`);
        
        // Extract actual mention texts for phrase cloud - SHOW REAL DATA!
        const realPhrases = recentMentions
          .map((mention: any) => {
            // Truncate long texts to fit in the phrase cloud
            const text = mention.text;
            if (text.length > 80) {
              return text.substring(0, 77) + '...';
            }
            return text;
          })
          .filter((text: string) => text && text.length > 10) // Filter out short texts
          .slice(0, 10); // Take first 10 real mentions
        
        console.log('🎯 [PhraseCloud] REAL PHRASES FROM BACKEND:', realPhrases);
        setTrendingPhrases(realPhrases);
        
        // Extract keywords from actual mentions for brand monitoring
        console.log('🔍 [PhraseCloud] Extracting keywords from real BrandMentions data...');
        const keywordSet = new Set<string>();
        const phraseFirstLetters = new Set<string>();
        
        recentMentions.forEach((mention: any) => {
          if (mention.text) {
            console.log('📝 [PhraseCloud] Processing mention:', mention.text);
            
            // Extract meaningful keywords from mention text
            const words = mention.text
              .toLowerCase()
              .split(/\W+/)
              .filter((word: string) => word.length > 4 && !['that', 'this', 'with', 'from', 'they', 'were', 'been', 'have', 'will', 'would', 'could', 'should'].includes(word));
            
            // Take first characters from phrases as user requested
            const phrases = mention.text.split(/[.!?]+/).filter(phrase => phrase.trim().length > 10);
            phrases.forEach(phrase => {
              const trimmed = phrase.trim();
              if (trimmed.length > 0) {
                const firstChars = trimmed.substring(0, Math.min(6, trimmed.length)); // First 6 characters
                phraseFirstLetters.add(firstChars);
              }
            });
            
            words.slice(0, 3).forEach((word: string) => keywordSet.add(word));
          }
        });
        
        if (keywordSet.size > 0 && !parsedCampaignData?.keywords) {
          const extractedKeywords = Array.from(keywordSet).slice(0, 3);
          const phraseStarters = Array.from(phraseFirstLetters).slice(0, 2); // Add 2 phrase starters
          
          const allKeywords = [
            ...extractedKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
            ...phraseStarters.map(p => p.charAt(0).toUpperCase() + p.slice(1) + '...')
          ].slice(0, 3);
          
          console.log('🎯 [PhraseCloud] Extracted keywords from real data:', allKeywords);
          setTopKeywords(allKeywords);
        }
      } else {
        // Fallback to trending topics if no real mentions
        return mentionlyticsService.getTrendingTopics();
      }
    }).then((topics) => {
      if (topics && trendingPhrases.length === 0) {
        const phrases = topics.map((t: any) => t.topic);
        setTrendingPhrases(phrases);
        
        // If no campaign keywords, use trending topics as fallback
        if (!parsedCampaignData?.keywords && topics.length > 0) {
          const fallbackKeywords = topics.slice(0, 3).map((t: any) => t.topic);
          setTopKeywords(fallbackKeywords);
        }
      }
    }).catch(err => {
      console.log('Using fallback keywords due to:', err);
      // Fallback keywords if everything fails
      if (!parsedCampaignData?.keywords) {
        setTopKeywords(['Brand Mentions', 'Social Media', 'Public Sentiment']);
      }
    });
  }, [trendingPhrases.length]);

  // BrandMentions-style fallback phrases (when no real mentions available)
  const defaultPhrases = [
    'Great progress on recent initiatives',
    'Positive momentum in public sentiment',
    'Strong community engagement trends',
    'Meaningful dialogue on key issues',
    'Building bridges across communities',
    'Focused leadership delivering results',
    'Innovation driving positive change',
    'Collaborative approach shows promise',
    'Transparent communication builds trust',
    'Commitment to sustainable solutions',
  ];

  // BrandMentions-style social media phrases 
  const socialMediaPhrases = [
    'Excited to see positive coverage of our recent community outreach efforts',
    'Grateful for the supportive response to our transparency initiatives',
    'Encouraging feedback on our approach to stakeholder engagement',
    'Meaningful dialogue emerging around our policy framework',
    'Strong public support for our collaborative leadership style',
    'Positive sentiment growing around our innovation initiatives',
    'Community leaders praising our commitment to inclusive solutions',
    'Media highlighting our track record of delivering results',
    'Public appreciation for our evidence-based decision making',
    'Growing recognition of our sustainable approach to governance',
  ];

  // Use REAL phrases from backend, not mock data!
  const phrases = trendingPhrases.length > 0 ? trendingPhrases : [
    // Only use these if NO real data available
    'Loading real mentions from BrandMentions...',
    'Fetching Jack Harrison updates...',
    'Getting Sarah Mitchell mentions...',
    'Loading Faye Langford coverage...'
  ];
  
  console.log('📊 [PhraseCloud] Final phrases being displayed:', phrases);

  // Handle phrase click - navigate to live monitoring with keyword filter
  const handlePhraseClick = (phrase: string) => {
    navigate(`/real-time-monitoring?keyword=${encodeURIComponent(phrase)}`);
  };

  // Handle keyword click - navigate to intelligence hub with search
  const handleKeywordClick = (keyword: string) => {
    navigate(`/intelligence-hub?search=${encodeURIComponent(keyword)}&filter=mentions`);
  };

  // Handle competitor click - navigate to intelligence hub with competitor filter  
  const handleCompetitorClick = (competitorName: string) => {
    navigate(`/intelligence-hub?competitor=${encodeURIComponent(competitorName)}&filter=competitor`);
  };

  return (
    <Card
      variant="glass"
      padding="sm"
      className="phrase-cloud hoverable hover:scale-[1.02] transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-condensed font-semibold text-white text-sm uppercase tracking-wider">BRAND MONITORING</h3>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>

      <div className="flex" style={{ height: '140px' }}>
        <div className="flex-shrink-0" style={{ width: '120px', paddingRight: '10px' }}>
          <div className="space-y-1">
            {/* Dynamic Keywords */}
            {topKeywords.map((keyword, index) => {
              const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500'];
              return (
                <div
                  key={keyword}
                  onClick={() => handleKeywordClick(keyword)}
                  className="text-white/90 text-[10px] font-barlow cursor-pointer hover:text-cyan-300 transition-colors flex items-center"
                >
                  <span className={`w-2 h-2 ${colors[index % colors.length]} rounded-full mr-2 flex-shrink-0`}></span>
                  {keyword.length > 15 ? `${keyword.substring(0, 15)}...` : keyword}
                </div>
              );
            })}
            
            {/* Dynamic Opponents */}
            {competitors.length > 0 && (
              <>
                <div className="text-[9px] text-white/60 uppercase font-semibold tracking-wider font-jetbrains mt-4 mb-1">
                  OPPONENTS
                </div>
                {competitors.slice(0, 2).map((competitor, index) => {
                  const colors = ['bg-indigo-500', 'bg-green-500', 'bg-orange-500'];
                  const competitorName = typeof competitor === 'string' ? competitor : competitor.name;
                  return (
                    <div
                      key={competitorName}
                      onClick={() => handleCompetitorClick(competitorName)}
                      className="text-white/90 text-[10px] font-barlow cursor-pointer hover:text-cyan-300 transition-colors flex items-center"
                    >
                      <span className={`w-2 h-2 ${colors[index % colors.length]} rounded-full mr-2 flex-shrink-0`}></span>
                      {competitorName.length > 15 ? `${competitorName.substring(0, 15)}...` : competitorName}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        <div className="flex-1 relative phrase-3d" style={{ height: '100%', overflow: 'hidden' }}>
          <div className="phrase-carousel">
            {phrases.map((phrase: string, index: number) => (
              <div
                key={index}
                className="phrase-item cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handlePhraseClick(phrase)}
                style={{
                  animationDelay: `${index * -3}s`,
                  zIndex: phrases.length - index,
                }}
                title={phrase}
              >
                {phrase.length > 55 ? `${phrase.substring(0, 55)}...` : phrase}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
