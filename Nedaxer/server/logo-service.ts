// Logo service for news sources - provides actual logos from uploaded brand assets
export const getNewsSourceLogo = (sourceName: string): string | null => {
  const logoUrls: { [key: string]: string } = {
    'CoinDesk': '/logos/coindesk.png',
    'CoinTelegraph': 'https://cointelegraph.com/favicon.ico',
    'Decrypt': 'https://decrypt.co/favicon.ico', 
    'CryptoSlate': '/logos/cryptoslate.jpg',
    'CryptoBriefing': '/logos/cryptobriefing.png',
    'BeInCrypto': '/logos/beincrypto.jpg',
    'CryptoNews': 'https://cryptonews.com/favicon.ico',
    'Google News - Crypto': '/logos/google-news.jpg',
    'Google News - Bitcoin': '/logos/google-news.jpg',
    'Reuters': 'https://www.reuters.com/favicon.ico',
    'Bloomberg': 'https://www.bloomberg.com/favicon.ico',
    'CNBC': 'https://www.cnbc.com/favicon.ico',
    'CNN': 'https://www.cnn.com/favicon.ico',
    'BBC': 'https://www.bbc.com/favicon.ico'
  };

  return logoUrls[sourceName] || null;
};

// Generate SVG logo placeholders for news sources
export const generateLogoSVG = (sourceName: string): string => {
  const colors: { [key: string]: { bg: string; text: string } } = {
    'CoinDesk': { bg: '#FF6B35', text: '#FFFFFF' },
    'CoinTelegraph': { bg: '#1E88E5', text: '#FFFFFF' },
    'Decrypt': { bg: '#7B1FA2', text: '#FFFFFF' },
    'CryptoSlate': { bg: '#4CAF50', text: '#FFFFFF' },
    'CryptoBriefing': { bg: '#F44336', text: '#FFFFFF' },
    'BeInCrypto': { bg: '#FFC107', text: '#000000' },
    'CryptoNews': { bg: '#3F51B5', text: '#FFFFFF' },
    'Google News - Crypto': { bg: '#4285F4', text: '#FFFFFF' },
    'Google News - Bitcoin': { bg: '#4285F4', text: '#FFFFFF' },
    'Reuters': { bg: '#D32F2F', text: '#FFFFFF' },
    'Bloomberg': { bg: '#000000', text: '#FFFFFF' },
    'CNBC': { bg: '#1976D2', text: '#FFFFFF' },
    'CNN': { bg: '#C62828', text: '#FFFFFF' },
    'BBC': { bg: '#C8102E', text: '#FFFFFF' }
  };

  const color = colors[sourceName] || { bg: '#9E9E9E', text: '#FFFFFF' };
  const initials = sourceName.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();

  return `
    <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(color.bg, -20)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill="url(#grad)" rx="8"/>
      <text x="40" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${color.text}">${initials}</text>
    </svg>
  `;
};

function adjustBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}