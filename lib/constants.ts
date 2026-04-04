import { TeamMember, AIAgent, Service } from './types';

export const TEAM: TeamMember[] = [
  {
    name: "Alex Rivers",
    role: "Business Management Lead",
    description: "Strategic visionary with 10+ years in scaling tech startups and optimizing business operations through AI.",
    image: "https://picsum.photos/seed/alex/400/400",
    socials: {
      linkedin: "#",
      github: "#",
      instagram: "#"
    }
  },
  {
    name: "Sarah Chen",
    role: "Lead Engineer",
    description: "Expert in LLM architecture and neural networks. Previously led AI infrastructure at major tech firms.",
    image: "https://picsum.photos/seed/sarah/400/400",
    socials: {
      linkedin: "#",
      github: "#",
      instagram: "#"
    }
  },
  {
    name: "Marcus Thorne",
    role: "Software Engineer",
    description: "Full-stack specialist focused on seamless AI integrations and high-performance automation pipelines.",
    image: "https://picsum.photos/seed/marcus/400/400",
    socials: {
      linkedin: "#",
      github: "#",
      instagram: "#"
    }
  }
];

export const SERVICES: Service[] = [
  {
    title: "Workflow Automation",
    description: "Streamline repetitive tasks with intelligent triggers and actions that learn from your business data.",
    icon: "Zap"
  },
  {
    title: "Custom AI Agents",
    description: "Bespoke digital workers tailored to your specific industry needs, from customer support to data analysis.",
    icon: "Bot"
  },
  {
    title: "Data Intelligence",
    description: "Turn raw data into actionable insights using advanced machine learning models and predictive analytics.",
    icon: "BarChart"
  }
];

export const PREBUILT_AGENTS: AIAgent[] = [
  {
    id: "1",
    title: "Customer Support Pro",
    description: "24/7 intelligent support agent that handles queries, resolves issues, and escalates complex cases.",
    features: ["Natural Language Processing", "Multi-language Support", "CRM Integration"],
    pricing: "$199/mo",
    type: "subscription"
  },
  {
    id: "2",
    title: "Lead Gen Automator",
    description: "Finds and qualifies leads across social platforms and web directories automatically.",
    features: ["Automated Prospecting", "Email Verification", "Meeting Scheduling"],
    pricing: "$499",
    type: "one-time"
  },
  {
    id: "3",
    title: "Content Strategist AI",
    description: "Generates SEO-optimized content plans and drafts based on trending industry topics.",
    features: ["Trend Analysis", "SEO Optimization", "Multi-format Generation"],
    pricing: "$299/mo",
    type: "subscription"
  },
  {
    id: "4",
    title: "E-commerce Optimizer",
    description: "Analyzes store performance and automatically adjusts pricing and inventory alerts.",
    features: ["Dynamic Pricing", "Inventory Forecasting", "Competitor Tracking"],
    pricing: "$349/mo",
    type: "subscription"
  },
  {
    id: "5",
    title: "Social Media Manager",
    description: "Creates, schedules, and engages with your audience across all major platforms.",
    features: ["Auto-scheduling", "Sentiment Analysis", "Image Generation"],
    pricing: "$149/mo",
    type: "subscription"
  },
  {
    id: "6",
    title: "Data Entry Specialist",
    description: "Extracts data from documents and populates your databases with 99.9% accuracy.",
    features: ["OCR Technology", "Error Correction", "Bulk Processing"],
    pricing: "$799",
    type: "one-time"
  },
  {
    id: "7",
    title: "HR Assistant AI",
    description: "Screens resumes, schedules interviews, and handles employee onboarding queries.",
    features: ["Resume Parsing", "Interview Coordination", "Policy Q&A"],
    pricing: "$249/mo",
    type: "subscription"
  },
  {
    id: "8",
    title: "Financial Analyst Bot",
    description: "Real-time monitoring of financial markets and automated portfolio rebalancing.",
    features: ["Risk Assessment", "Market Prediction", "Portfolio Management"],
    pricing: "$999",
    type: "one-time"
  }
];
