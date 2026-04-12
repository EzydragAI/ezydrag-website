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
    title: "AI SEO Employee",
    description: "Generates SEO-optimized content plans and drafts based on trending industry topics.",
    features: ["Trend Analysis", "SEO Optimization", "Multi-format Generation"],
    pricing: "₹999/mo",
    comingSoon: true
  },
  {
    id: "2",
    title: "AI Lead Generator for small businesses",
    description: "Finds and qualifies leads across social platforms and web directories automatically.",
    features: ["Automated Prospecting", "Email Verification", "Meeting Scheduling"],
    pricing: "₹499/mo",
    comingSoon: true
  },
  {
    id: "3",
    title: "AI Instagram auto responser",
    description: "Creates, schedules, and engages with your audience across all major platforms.",
    features: ["Auto-scheduling", "Sentiment Analysis", "Image Generation"],
    pricing: "₹299/mo",
    comingSoon: true
  }
];
