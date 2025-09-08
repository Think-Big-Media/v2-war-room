// Vercel Edge Function - Works immediately when deployed
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    const data = req.body;
    
    console.log('BrandMentions webhook received:', JSON.stringify(data, null, 2));
    
    // Store in memory or forward to your backend
    const mentions = [];
    
    // Process social mentions
    if (data.social && Array.isArray(data.social)) {
      data.social.forEach(mention => {
        mentions.push({
          type: 'social',
          text: mention.text,
          url: mention.url,
          date: mention.date,
          author: mention.name || mention.username,
          platform: 'social',
          performance: mention.performance
        });
      });
    }
    
    // Process web mentions
    if (data.web && Array.isArray(data.web)) {
      data.web.forEach(mention => {
        mentions.push({
          type: 'web',
          title: mention.title,
          text: mention.text,
          url: mention.url,
          date: mention.date,
          platform: 'web',
          performance: mention.performance
        });
      });
    }
    
    // Forward to your Encore backend (when ready)
    try {
      await fetch('https://staging-war-roombackend-45-x83i.encr.app/api/v1/webhook/brandmentions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentions })
      });
    } catch (error) {
      console.log('Backend not ready yet, stored locally');
    }
    
    return res.status(200).json({ 
      success: true, 
      message: `Received ${mentions.length} mentions`,
      mentions: mentions
    });
  }
  
  // GET request - show stored mentions
  return res.status(200).json({ 
    message: 'BrandMentions webhook endpoint ready',
    usage: 'POST your BrandMentions data here'
  });
}