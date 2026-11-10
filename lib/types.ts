export interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  socials: {
    linkedin: string;
    github: string;
    instagram: string;
  };
}

export interface AIAgent {
  id: string;
  title: string;
  description: string;
  features: string[];
  pricing: string;
  comingSoon?: boolean;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}
