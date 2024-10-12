import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com",
    discord: "https://discord.com",
    homepage: "https://loyaltyplatform.vercel.app",
  },

  defaultCollection: {
    name: "Loyalty Points Collection",
    description: "A collection of loyalty points to reward our valued customers.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    subTitle: "Revolutionizing Customer Loyalty on Aptos",
    description:
      "Our platform rewards loyal customers with points that can be redeemed for exclusive benefits. Join our community and start earning rewards today!",
    discordLink: "https://discord.com",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Alex",
        role: "Blockchain Developer",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com",
        },
      },
      {
        name: "Jordan",
        role: "Marketing Specialist",
        img: Placeholder2,
      },
      {
        name: "Taylor",
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
        title: "What are loyalty points?",
        description:
          "Loyalty points are rewards given to customers for their continued patronage. These points can be redeemed for various benefits and discounts.",
      },
      {
        title: "How do I earn loyalty points?",
        description: `To earn loyalty points, follow these steps:
        Create an account on our platform.
        Make purchases or engage with our services.
        Accumulate points with each transaction.`,
      },
      {
        title: "What can I redeem with my loyalty points?",
        description:
          "You can redeem your loyalty points for discounts, exclusive products, and special offers available on our platform.",
      },
      {
        title: "How can I check my loyalty points balance?",
        description: `To check your loyalty points balance, follow these steps:
        Log in to your account.
        Navigate to the "My Points" section.
        View your current points balance and transaction history.`,
      },
      {
        title: "What should I do if I encounter an issue with my points?",
        description: `If you encounter an issue with your points, consider the following:
        Ensure that all transactions are correctly recorded.
        Refresh the app and check your points balance again.
        Contact our support team for further assistance.`,
      },
      {
        title: "How can I refer a friend to the loyalty program?",
        description: `To refer a friend to the loyalty program, follow these steps:
        Navigate to the "Refer a Friend" section in the app.
        Provide your friend's details and send the referral.
        Earn bonus points when your friend joins and makes a purchase.`,
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
