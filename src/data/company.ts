import { FounderItem } from '../types';

export const COMPANY_INFO = {
  name: 'USolve',
  tagline: 'Code Meets Creativity',
  type: 'Software development and digital solutions company',
  email: 'usolveofficial@gmail.com',
  phone: '+91 9492439986',
  phoneDisplay: '+91 94924 39986',
  instagram: 'https://www.instagram.com/usolve_official/',
  github: 'https://github.com/UdaySolutionsOfficial',
  foundedLocation: 'India',
  shortIntro:
    'USolve helps businesses turn ideas into practical digital solutions. We combine thoughtful design, reliable development, and modern technology to build websites, software, and digital experiences that serve real needs.',
  mission:
    'To engineer reliable, high-performance software and digital solutions that empower businesses to operate efficiently, expand online, and serve their users with confidence.',
  vision:
    'To be a trusted technology partner known for technical pragmatism, aesthetic clarity, and genuine client collaboration.',
  values: [
    {
      title: 'Business-Centered Pragmatism',
      description:
        'We prioritize real business outcomes over superficial trends, selecting stable technologies that solve genuine operational challenges.',
    },
    {
      title: 'Craftsmanship & Usability',
      description:
        'Every pixel, interface element, and code architecture is built with attention to performance, responsiveness, and clear usability.',
    },
    {
      title: 'Transparent Communication',
      description:
        'We believe in honest project scoping, clear milestone updates, and direct technical consultations without confusing jargon.',
    },
    {
      title: 'Continuous Improvement',
      description:
        'We build systems designed to evolve. From launch day onwards, we help businesses maintain, refine, and scale their digital products.',
    },
  ],
  workingSteps: [
    {
      step: '01',
      title: 'Understand Your Idea',
      description:
        'We review your goals, workflow requirements, and target audience to define exactly what your project needs to achieve.',
    },
    {
      step: '02',
      title: 'Plan the Right Solution',
      description:
        'We map out architecture, UI wireframes, and technology choices tailored to your budget, timeline, and business scope.',
    },
    {
      step: '03',
      title: 'Design and Develop',
      description:
        'We craft responsive, light-theme interfaces and clean, scalable code that adheres to industry standards and modern practices.',
    },
    {
      step: '04',
      title: 'Test, Launch, and Improve',
      description:
        'We rigorously verify functionality across screen sizes, deploy to production, and provide ongoing support to refine performance.',
    },
  ],
  founders: [
    {
      name: 'Uday Kiran Tippani',
      role: 'Founder & CEO',
      image: '/assets/founder/founder-uday-kiran.png',
      initials: 'UK',
      bio: 'Leading USolve with a focus on full-stack software development, web systems architecture, and turning real-world business challenges into practical digital products.',
      focusAreas: ['Software Architecture', 'Full-Stack Development', 'Product Direction'],
    },
    {
      name: 'Jabeed Shaik',
      role: 'Co-founder',
      initials: 'JS',
      bio: 'Directing strategic growth, client partnerships, and collaborative execution to ensure every solution delivered creates tangible business value.',
      focusAreas: ['Business Strategy', 'Client Partnerships', 'Operational Growth'],
    },
  ] as FounderItem[],
};
