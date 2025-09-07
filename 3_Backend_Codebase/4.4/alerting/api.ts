import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

// Get notification service credentials from secrets
const twilioAccountSid = secret("TWILIO_ACCOUNT_SID");
const twilioAuthToken = secret("TWILIO_AUTH_TOKEN");
const emailApiKey = secret("EMAIL_API_KEY");

// Response types
interface CrisisAlert {
  id: string;
  type: "sentiment_drop" | "viral_negative" | "media_crisis" | "security_breach" | "data_anomaly";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  source: string;
  triggers: string[];
  affectedMetrics: string[];
  recommendedActions: string[];
  estimatedImpact: {
    reach: number;
    timeline: string;
    riskLevel: number;
  };
  detectedAt: string;
  status: "active" | "acknowledged" | "resolved";
}

interface CrisisDetectionResponse {
  alerts: CrisisAlert[];
  riskLevel: "low" | "medium" | "high" | "critical";
  summary: {
    totalAlerts: number;
    criticalAlerts: number;
    newAlerts: number;
  };
  timestamp: string;
}

interface QueuedAlert {
  id: string;
  type: "email" | "sms" | "push" | "webhook";
  recipient: string;
  subject?: string;
  message: string;
  priority: "low" | "normal" | "high" | "urgent";
  scheduledFor?: string;
  status: "pending" | "sending" | "sent" | "failed";
  createdAt: string;
  sentAt?: string;
  error?: string;
}

interface AlertQueueResponse {
  alerts: QueuedAlert[];
  summary: {
    pending: number;
    sending: number;
    sent: number;
    failed: number;
  };
  timestamp: string;
}

interface SendAlertRequest {
  type: "email" | "sms" | "push" | "webhook";
  recipients: string[];
  subject?: string;
  message: string;
  priority?: "low" | "normal" | "high" | "urgent";
  scheduleFor?: string;
}

interface SendAlertResponse {
  alertIds: string[];
  status: "queued" | "sent" | "error";
  message: string;
  timestamp: string;
}

// In-memory storage for demo purposes (replace with database in production)
let alertQueue: QueuedAlert[] = [];
let crisisAlerts: CrisisAlert[] = [
  {
    id: "crisis_001",
    type: "sentiment_drop",
    severity: "medium",
    title: "Significant Sentiment Drop Detected",
    description: "Public sentiment has dropped 15% in the past 4 hours across social media platforms",
    source: "Social Media Monitoring",
    triggers: ["sentiment_threshold", "volume_spike"],
    affectedMetrics: ["twitter_sentiment", "facebook_sentiment", "overall_sentiment"],
    recommendedActions: [
      "Review recent public statements",
      "Prepare clarifying communication",
      "Monitor competitor activity",
      "Engage with key influencers"
    ],
    estimatedImpact: {
      reach: 250000,
      timeline: "4-8 hours",
      riskLevel: 6
    },
    detectedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "active"
  },
  {
    id: "crisis_002",
    type: "viral_negative",
    severity: "high",
    title: "Viral Negative Content Detected",
    description: "Negative content about healthcare policy gaining rapid traction on TikTok",
    source: "TikTok Monitoring",
    triggers: ["viral_threshold", "negative_sentiment", "rapid_growth"],
    affectedMetrics: ["tiktok_mentions", "youth_demographic", "healthcare_sentiment"],
    recommendedActions: [
      "Create response video content",
      "Engage healthcare advocates",
      "Fact-check viral claims",
      "Coordinate counter-narrative"
    ],
    estimatedImpact: {
      reach: 500000,
      timeline: "2-6 hours",
      riskLevel: 8
    },
    detectedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: "acknowledged"
  }
];

// GET /api/v1/alerting/crisis - crisis detection
export const getCrisisDetection = api<{}, CrisisDetectionResponse>(
  { expose: true, method: "GET", path: "/api/v1/alerting/crisis" },
  async () => {
    console.log("Fetching crisis detection alerts...");
    
    // In real implementation, this would analyze real-time data for crisis indicators
    const activeAlerts = crisisAlerts.filter(alert => alert.status === "active");
    const criticalAlerts = crisisAlerts.filter(alert => alert.severity === "critical");
    const recentAlerts = crisisAlerts.filter(alert => {
      const detectedTime = new Date(alert.detectedAt).getTime();
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      return detectedTime > oneHourAgo;
    });

    // Determine overall risk level
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    if (criticalAlerts.length > 0) {
      riskLevel = "critical";
    } else if (activeAlerts.filter(a => a.severity === "high").length > 0) {
      riskLevel = "high";
    } else if (activeAlerts.length > 0) {
      riskLevel = "medium";
    }

    return {
      alerts: crisisAlerts,
      riskLevel,
      summary: {
        totalAlerts: crisisAlerts.length,
        criticalAlerts: criticalAlerts.length,
        newAlerts: recentAlerts.length
      },
      timestamp: new Date().toISOString()
    };
  }
);

// GET /api/v1/alerting/queue - alert queue
export const getAlertQueue = api<{ status?: string; limit?: number }, AlertQueueResponse>(
  { expose: true, method: "GET", path: "/api/v1/alerting/queue" },
  async ({ status, limit = 50 }) => {
    console.log("Fetching alert queue...");
    
    let filteredAlerts = alertQueue;
    if (status) {
      filteredAlerts = alertQueue.filter(alert => alert.status === status);
    }

    const alerts = filteredAlerts.slice(0, limit);

    return {
      alerts,
      summary: {
        pending: alertQueue.filter(a => a.status === "pending").length,
        sending: alertQueue.filter(a => a.status === "sending").length,
        sent: alertQueue.filter(a => a.status === "sent").length,
        failed: alertQueue.filter(a => a.status === "failed").length
      },
      timestamp: new Date().toISOString()
    };
  }
);

// POST /api/v1/alerting/send - send alerts
export const sendAlert = api<SendAlertRequest, SendAlertResponse>(
  { expose: true, method: "POST", path: "/api/v1/alerting/send" },
  async ({ type, recipients, subject, message, priority = "normal", scheduleFor }) => {
    console.log(`Sending ${type} alert to ${recipients.length} recipients...`);
    
    const alertIds: string[] = [];
    
    for (const recipient of recipients) {
      const alertId = generateAlertId();
      const queuedAlert: QueuedAlert = {
        id: alertId,
        type,
        recipient,
        subject,
        message,
        priority: priority as "low" | "normal" | "high" | "urgent",
        scheduledFor: scheduleFor,
        status: scheduleFor ? "pending" : "sending",
        createdAt: new Date().toISOString()
      };

      alertQueue.push(queuedAlert);
      alertIds.push(alertId);

      // Simulate sending process
      if (!scheduleFor) {
        setTimeout(() => {
          const alert = alertQueue.find(a => a.id === alertId);
          if (alert) {
            // 90% success rate for demo
            if (Math.random() > 0.1) {
              alert.status = "sent";
              alert.sentAt = new Date().toISOString();
            } else {
              alert.status = "failed";
              alert.error = "Delivery failed";
            }
          }
        }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
      }
    }

    return {
      alertIds,
      status: scheduleFor ? "queued" : "sent",
      message: `${type} alert${recipients.length > 1 ? 's' : ''} ${scheduleFor ? 'queued' : 'sent'} to ${recipients.length} recipient${recipients.length > 1 ? 's' : ''}`,
      timestamp: new Date().toISOString()
    };
  }
);

// Helper function
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}