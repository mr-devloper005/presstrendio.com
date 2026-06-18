import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Media distribution, press releases, and newsroom updates',
      description: 'Explore media distribution campaigns, press releases, announcements, and publication-ready updates through a focused archive.',
      openGraphTitle: 'Media distribution and public updates',
      openGraphDescription: 'Discover distributed media, newsroom briefs, campaign updates, and press-ready content in one clear experience.',
      keywords: ['media distribution', 'press release', 'newsroom updates', 'public relations'],
    },
    hero: {
      badge: 'Media distribution network',
      title: ['Distribute, organize,', 'and track media updates.'],
      description: 'Publish press releases, campaign announcements, media briefs, and public updates with a clear archive designed for discovery.',
      primaryCta: { label: 'Browse media updates', href: '/media-distribution' },
      secondaryCta: { label: 'Create a release', href: '/create' },
      searchPlaceholder: 'Search releases, campaigns, outlets, and categories',
      focusLabel: 'Focus',
      featureCardBadge: 'latest cover rotation',
      featureCardTitle: 'Latest posts shape the visual identity of the homepage.',
      featureCardDescription: 'Recent images and stories stay at the center of the experience without changing any core platform behavior.',
    },
    intro: {
      badge: 'About the platform',
      title: 'Built for press-ready publishing and clean media discovery.',
      paragraphs: [
        'This site brings press releases, campaign updates, media briefs, and supporting resources into one organized distribution surface.',
        'Instead of forcing visitors through scattered posts, the layout keeps every release easy to scan, search, and open from a consistent archive.',
        'Whether someone arrives from a campaign link, newsroom update, or category search, they can keep discovering related media without friction.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Distribution-first homepage with strong campaign and release signals.',
        'Connected pages for media updates, articles, visuals, and public resources.',
        'Compact archive grids designed for fast newsroom scanning.',
        'Readable detail pages that keep calls to action close at hand.',
      ],
      primaryLink: { label: 'Browse articles', href: '/article' },
      secondaryLink: { label: 'See visuals', href: '/image' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Explore media releases, campaign stories, and public updates in one place.',
      description: 'Move between distributed media posts, supporting articles, images, and resources through one clearer visual system.',
      primaryCta: { label: 'Browse Media', href: '/media-distribution' },
      secondaryCta: { label: 'Contact Sales', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our Story',
    title: 'Media distribution with a clearer publishing rhythm.',
    description: `${slot4BrandConfig.siteName} helps teams publish, organize, and surface media distribution updates without burying important announcements.`,
    paragraphs: [
      'The platform is shaped around the way press releases and public updates are actually consumed: quickly, visually, and with context close by.',
      'Visitors can move from a campaign announcement to related coverage, source material, and contact pathways without losing the thread.',
    ],
    values: [
      {
        title: 'Release-first structure',
        description: 'We prioritize clear headlines, compact summaries, and scannable campaign context so important updates are easy to evaluate.',
      },
      {
        title: 'Connected distribution',
        description: 'Media releases, supporting articles, visuals, resources, and organization notes stay connected across the site.',
      },
      {
        title: 'Practical trust signals',
        description: 'Navigation, contact paths, and detail pages stay straightforward so visitors know where an update came from and what to do next.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Let’s discuss your media distribution needs.',
    description: 'Send campaign questions, press release details, correction requests, or partnership ideas and the right team can respond with context.',
    formTitle: 'Send a distribution request',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find releases, campaigns, sources, and updates faster.',
      description: 'Use keywords, categories, and content types to discover media distribution posts from every active section of the site.',
      placeholder: 'Search by release, campaign, company, category, or title',
    },
    resultsTitle: 'Latest media distribution content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create media updates.',
      description: 'Use your account to open the publishing workspace and prepare press releases, campaign notes, and public updates.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create press-ready distribution content.',
      description: 'Choose the content type, add source details, and prepare a clean media update with images, links, summary, and body content.',
    },
    formTitle: 'Distribution details',
    submitLabel: 'Submit media update',
    successTitle: 'Media update submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your media desk.',
      description: 'Login to continue browsing, managing submissions, and creating distribution-ready media content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start distributing.',
      description: 'Create an account to access the media workspace, save details, and submit press-ready content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
