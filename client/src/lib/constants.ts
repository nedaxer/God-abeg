// Navigation menu items
export const navItems = [
  {
    title: "Markets",
    items: [
      { label: "Cryptocurrencies", href: "/markets/commodities" },
      { label: "Crypto Events", href: "/markets/events" },
      { label: "Market Data", href: "/markets/market-data" },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "Binary Options", href: "/products/binary-options" },
      { label: "Call Spreads", href: "/products/call-spreads" },
      { label: "Touch Brackets", href: "/products/touch-brackets" },
      { label: "Knock-Outs", href: "/products/knock-outs" },
      { label: "Pricing", href: "/products/pricing" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Web Platform", href: "/platform/web-platform" },
      { label: "Mobile App", href: "/platform/mobile-app" },
      { label: "Funding", href: "/platform/funding" },
      { label: "Security", href: "/platform/security" },
    ],
  },
  {
    title: "Learn",
    items: [
      { label: "Getting Started", href: "/learn/getting-started" },
      { label: "Trading Strategies", href: "/learn/trading-strategies" },
      { label: "Webinars", href: "/learn/webinars" },
      { label: "Trading Guides", href: "/learn/trading-guides" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Nedaxer", href: "/company/about" },
      { label: "Regulations", href: "/company/regulations" },
      { label: "News", href: "/company/news" },
      { label: "Careers", href: "/company/careers" },
      { label: "Contact Us", href: "/company/contact" },
    ],
  },
];

// Hero slider items
export const heroSlides = [
  {
    id: 1,
    title: "Trade Cryptocurrencies Your Way",
    description: "Bitcoin, Ethereum, and altcoins with limited risk on a regulated exchange",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80",
    alt: "Cryptocurrency trading",
    primaryButton: { label: "Open Account", href: "/account/register" },
    secondaryButton: { label: "Login", href: "/account/login" },
  },
  {
    id: 2,
    title: "Advanced Crypto Trading Platform",
    description: "Powerful blockchain analytics, technical indicators, and real-time order execution",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80",
    alt: "Crypto trading platform",
    primaryButton: { label: "Open Account", href: "/account/register" },
    secondaryButton: { label: "Learn More", href: "/markets/commodities" },
  },
  {
    id: 3,
    title: "Trade Crypto 24/7",
    description: "Access digital asset markets from our mobile app with the same powerful features",
    image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80",
    alt: "Mobile crypto trading",
    primaryButton: { label: "Download App", href: "https://play.google.com/store/apps/details?id=com.nedaxer.touch" },
    secondaryButton: { label: "iOS App", href: "https://apps.apple.com/us/app/nedaxer" },
  },
];

// Trade options info
export const tradeOptions = [
  {
    title: "Binary Options",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=200&q=80",
    description: "Limited risk contracts based on a simple yes/no market proposition.",
    features: [
      "Know your maximum risk and reward before you trade",
      "Short-term expiries from 5 minutes to 1 day",
      "Trade Bitcoin, Ethereum, and other cryptocurrencies",
    ],
    learnMoreLink: "/products/binary-options",
  },
  {
    title: "Call Spreads",
    image: "https://images.unsplash.com/photo-1639815188549-c291ad9a86fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=200&q=80",
    description: "Limited risk alternative to traditional call options with built-in floor and ceiling levels.",
    features: [
      "Known maximum risk and profit potential",
      "Intraday, daily, and weekly expirations",
      "Perfect for volatile crypto market conditions",
    ],
    learnMoreLink: "/products/call-spreads",
  },
  {
    title: "Knock-Outs",
    image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=200&q=80",
    description: "Trade with leverage while maintaining limited risk with innovative floor and ceiling levels.",
    features: [
      "Built-in risk management with knockout levels",
      "Trade with leverage on popular cryptocurrencies",
      "Trade crypto 24/7 in global digital asset markets",
    ],
    learnMoreLink: "/products/knock-outs",
  },
];

// Market features
export const marketFeatures = [
  {
    title: "Bitcoin",
    icon: "currency-bitcoin",
    description: "Trade the original cryptocurrency and largest digital asset by market capitalization.",
    link: { label: "View Bitcoin Markets", href: "/markets/commodities" },
  },
  {
    title: "Ethereum",
    icon: "currency-ethereum",
    description: "Trade the second-largest cryptocurrency powering thousands of decentralized applications.",
    link: { label: "View Ethereum Markets", href: "/markets/commodities" },
  },
  {
    title: "Altcoins",
    icon: "coins",
    description: "Trade alternative cryptocurrencies including Solana, Cardano, Ripple, and more.",
    link: { label: "View Altcoin Markets", href: "/markets/commodities" },
  },
  {
    title: "Crypto Events",
    icon: "calendar-event",
    description: "Trade cryptocurrency events like protocol upgrades, halvings, and regulatory announcements.",
    link: { label: "View Crypto Events", href: "/markets/events" },
  },
];

// Platform features
export const platformFeatures = [
  {
    icon: "shield-check",
    title: "Regulated US Exchange",
    description: "Trade with confidence on a CFTC-regulated exchange with member funds held in segregated US bank accounts.",
  },
  {
    icon: "secure-payment",
    title: "Limited Risk by Design",
    description: "Know your maximum potential profit and loss before you enter a trade. Never lose more than you put in.",
  },
  {
    icon: "dashboard-3",
    title: "Powerful Trading Platform",
    description: "Advanced charting with technical indicators, custom watchlists, and fast reliable execution.",
  },
];

// Learning resources
export const learningResources = [
  {
    title: "Crypto Trading Guides",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    description: "Comprehensive guides on cryptocurrency trading strategies, blockchain analytics, and digital asset tutorials.",
    link: { label: "View Guides", href: "https://youtu.be/MYnkNaBMjlg?si=k8U0SMQ4BEU0Q7lx" },
  },
  {
    title: "Crypto Webinars",
    image: "https://images.unsplash.com/photo-1639322537133-5fcead339c5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80",
    description: "Live and on-demand webinars hosted by cryptocurrency experts covering trading strategies and market analysis.",
    link: { label: "Register Now", href: "#" },
  },
];

// Footer links
export const footerLinks = {
  markets: [
    { label: "Cryptocurrencies", href: "/markets/commodities" },
    { label: "Crypto Events", href: "/markets/events" },
    { label: "Market Data", href: "/markets/market-data" },
  ],
  products: [
    { label: "Binary Options", href: "/products/binary-options" },
    { label: "Call Spreads", href: "/products/call-spreads" },
    { label: "Touch Brackets", href: "/products/touch-brackets" },
    { label: "Knock-Outs", href: "/products/knock-outs" },
    { label: "Pricing", href: "/products/pricing" },
  ],
  platform: [
    { label: "Web Platform", href: "/platform/web-platform" },
    { label: "Mobile App", href: "/platform/mobile-app" },
    { label: "Funding", href: "/platform/funding" },
    { label: "Security", href: "/platform/security" },
  ],
  company: [
    { label: "About Nedaxer", href: "/company/about" },
    { label: "Regulations", href: "/company/regulations" },
    { label: "News", href: "/company/news" },
    { label: "Careers", href: "/company/careers" },
    { label: "Contact Us", href: "/company/contact" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Risk Disclosure", href: "/legal/risk" },
    { label: "CFTC Rule 4.41", href: "/legal/cftc" },
    { label: "Site Map", href: "/site-map" },
  ],
  account: [
    { label: "Login", href: "/account/login" },
    { label: "Register", href: "/account/register" },
    { label: "Forgot Password", href: "/account/forgot-password" },
    { label: "Download App", href: "https://play.google.com/store/apps/details?id=com.nedaxer.touch" },
  ],
};
