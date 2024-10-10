import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com/kunaldhongade",
    discord: "https://discord.com",
    homepage: "https://kunaldhongade.vercel.app",
  },

  defaultCollection: {
    name: "Job Referrals Collection",
    description: "A collection of job referrals to help you find your next opportunity.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    subTitle: "Innovative Job Referral Platform on Aptos",
    description:
      "Our platform connects job seekers with potential employers through trusted referrals. We aim to create a transparent and efficient job market. Join our community to get started!",
    discordLink: "https://discord.com",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Kunal",
        role: "Blockchain Developer",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com/kunaldhongade",
        },
      },
      {
        name: "Soham",
        role: "Marketing Specialist",
        img: Placeholder2,
      },
      {
        name: "Amrita",
        role: "Community Manager",
        img: Placeholder3,
        socials: {
          twitter: "https://twitter.com",
        },
      },
    ],
  },

  faqs: {
    title: "F.A.Q.",

    questions: [
      {
        title: "What is a job referral?",
        description:
          "A job referral is a recommendation from a current employee or someone within the industry, suggesting a candidate for a job opening.",
      },
      {
        title: "How do I get referred for a job?",
        description: `To get referred for a job, follow these steps:
        Create a profile on our platform.
        Connect with professionals in your desired industry.
        Request referrals for job openings that match your skills and experience.`,
      },
      {
        title: "What are the benefits of job referrals?",
        description:
          "Job referrals can increase your chances of getting hired, as they come with a recommendation from a trusted source. They can also help you access job openings that may not be publicly advertised.",
      },
      {
        title: "How can I refer someone for a job?",
        description: `To refer someone for a job, follow these steps:
        Navigate to the "Refer a Candidate" section in the app.
        Provide the candidate's details and the job opening information.
        Submit your referral and track its status through the app.`,
      },
      {
        title: "What should I do if I encounter an issue with my referral?",
        description: `If you encounter an issue with your referral, consider the following:
        Ensure that all details are correctly entered.
        Refresh the app and check the referral status again.
        Contact our support team for further assistance.`,
      },
      {
        title: "How can I view my referral status?",
        description: `You can view your referral status by navigating to the "My Referrals" section of the app. This section will display all your active referrals, including their current status and any feedback from employers.`,
      },
    ],
  },

  nftBanner: [Placeholder1, Placeholder2, Placeholder3],
};

export interface Config {
  socials?: {
    twitter?: string;
    discord?: string;
    homepage?: string;
  };

  defaultCollection?: {
    name: string;
    description: string;
    image: string;
  };

  ourTeam?: {
    title: string;
    members: Array<ConfigTeamMember>;
  };

  ourStory?: {
    title: string;
    subTitle: string;
    description: string;
    discordLink: string;
    images?: Array<string>;
  };

  faqs?: {
    title: string;
    questions: Array<{
      title: string;
      description: string;
    }>;
  };

  nftBanner?: Array<string>;
}

export interface ConfigTeamMember {
  name: string;
  role: string;
  img: string;
  socials?: {
    twitter?: string;
    discord?: string;
  };
}
