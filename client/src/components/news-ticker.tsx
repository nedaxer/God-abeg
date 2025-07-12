import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
  urlToImage?: string;
}

export const NewsTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  // Fetch real crypto news from your mobile app API
  const { data: newsData, error } = useQuery<NewsArticle[]>({
    queryKey: ['/api/crypto/news'],
    queryFn: async () => {
      const response = await fetch('/api/crypto/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return response.json();
    },
    retry: 2,
    retryDelay: 3000,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for fresh news
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  // Fallback news articles if API fails
  const fallbackNews = [
    {
      title: "Bitcoin reaches new all-time high as institutional adoption continues",
      description: "Major financial institutions continue to embrace cryptocurrency as a legitimate asset class",
      source: { name: "Crypto News" },
      url: "#",
      publishedAt: new Date().toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1518183214770-9cffbec72538?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Ethereum's network upgrades drive increased DeFi activity",
      description: "Latest protocol improvements enhance scalability and reduce transaction costs",
      source: { name: "DeFi Today" },
      url: "#",
      publishedAt: new Date().toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Major corporations announce crypto treasury strategies",
      description: "Fortune 500 companies increasingly adopt Bitcoin and Ethereum for corporate treasuries",
      source: { name: "Finance Weekly" },
      url: "#",
      publishedAt: new Date().toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const displayArticles = newsData && newsData.length > 0 ? newsData.slice(0, 8) : fallbackNews;

  // Auto-scroll through headlines with smooth slide transitions
  useEffect(() => {
    if (displayArticles.length > 0 && isAutoPlaying) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % displayArticles.length);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 300); // Slower transition back to normal
        }, 100); // Quick slide out
      }, 4000); // Change headline every 4 seconds

      return () => clearInterval(interval);
    }
  }, [displayArticles.length, isAutoPlaying]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe left - next news
        nextNews();
      } else {
        // Swipe right - previous news
        prevNews();
      }
    }
    
    isDragging.current = false;
    touchStartX.current = 0;
    touchEndX.current = 0;
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Mouse handlers for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    setIsAutoPlaying(false);
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        nextNews();
      } else {
        prevNews();
      }
    }
    
    isDragging.current = false;
    touchStartX.current = 0;
    touchEndX.current = 0;
    
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextNews = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % displayArticles.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevNews = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + displayArticles.length) % displayArticles.length);
      setIsTransitioning(false);
    }, 150);
  };

  const goToNews = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Format text in 4-words-per-line grid layout with dynamic sizing
  const formatTextInGrid = (text: string) => {
    const words = text.split(' ');
    const lines = [];
    
    for (let i = 0; i < words.length; i += 4) {
      const line = words.slice(i, i + 4).join(' ');
      lines.push(line);
    }
    
    return lines;
  };

  // Calculate dynamic text size based on content length
  const getDynamicTextSize = (text: string) => {
    const words = text.split(' ');
    const totalWords = words.length;
    
    if (totalWords <= 8) return 'text-base sm:text-lg'; // Short text - larger
    if (totalWords <= 12) return 'text-sm sm:text-base'; // Medium text - medium
    return 'text-sm'; // Long text - still readable
  };

  // Get news provider logo URL with working logos
  const getProviderLogo = (sourceName: string) => {
    const logoMap = {
      'CoinDesk': 'https://logo.clearbit.com/coindesk.com',
      'CoinTelegraph': 'https://logo.clearbit.com/cointelegraph.com',
      'Decrypt': 'https://logo.clearbit.com/decrypt.co',
      'CryptoSlate': 'https://logo.clearbit.com/cryptoslate.com',
      'BeInCrypto': 'https://logo.clearbit.com/beincrypto.com',
      'CryptoNews': 'https://logo.clearbit.com/cryptonews.com',
      'CryptoBriefing': 'https://logo.clearbit.com/cryptobriefing.com',
      'Google News': 'https://logo.clearbit.com/google.com',
      'Crypto News': 'https://logo.clearbit.com/cryptonews.com',
      'DeFi Today': 'https://logo.clearbit.com/defitoday.com',
      'Finance Weekly': 'https://logo.clearbit.com/financeweekly.com'
    };
    
    return logoMap[sourceName as keyof typeof logoMap] || 'https://logo.clearbit.com/bitcoin.org';
  };

  if (displayArticles.length === 0) {
    return null;
  }

  const currentArticle = displayArticles[currentIndex];

  // Get news source logo as fallback
  const getSourceLogo = (sourceName: string) => {
    const logoMap: { [key: string]: string } = {
      'CoinDesk': 'https://logo.clearbit.com/coindesk.com',
      'CryptoSlate': 'https://logo.clearbit.com/cryptoslate.com',
      'CryptoBriefing': 'https://logo.clearbit.com/cryptobriefing.com',
      'BeInCrypto': 'https://logo.clearbit.com/beincrypto.com',
      'Google News - Crypto': 'https://logo.clearbit.com/google.com',
      'Google News - Bitcoin': 'https://logo.clearbit.com/google.com',
      'CoinTelegraph': 'https://logo.clearbit.com/cointelegraph.com',
      'Decrypt': 'https://logo.clearbit.com/decrypt.co',
      'CryptoNews': 'https://logo.clearbit.com/cryptonews.com'
    };
    return logoMap[sourceName] || `https://logo.clearbit.com/${sourceName.toLowerCase().replace(/\s+/g, '')}.com`;
  };

  // Better image fallback with news source logos
  const getImageUrl = (article: NewsArticle) => {
    // First try to use the original article image
    if (article.urlToImage && article.urlToImage.startsWith('http')) {
      return article.urlToImage;
    }
    
    // Use news source logos as fallback when no image is available
    return getSourceLogo(article.source.name);
  };

  // Create a background style with proper fallback
  const getBackgroundStyle = (article: NewsArticle) => {
    const hasNewsImage = article.urlToImage && article.urlToImage.startsWith('http');
    const primaryImage = hasNewsImage ? article.urlToImage : getSourceLogo(article.source.name);
    
    return {
      backgroundImage: `url(${primaryImage})`,
      backgroundSize: 'cover', // Always use cover to fill the entire banner
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundColor: hasNewsImage ? 'transparent' : '#1a1a40' // Dark background for logos
    };
  };

  return (
    <section className="relative py-6 overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4 relative z-10">
        {/* Single News Item with Swipe */}
        <div className="relative">
          <div
            className={`relative w-full h-40 sm:h-44 rounded-xl overflow-hidden shadow-lg cursor-pointer select-none transform transition-all duration-500 ease-in-out ${
              isTransitioning ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => window.open(currentArticle.url, '_blank')}
          >
            {/* Background Image with fallback */}
            <div 
              className="absolute inset-0 transition-all duration-500 ease-in-out"
              style={getBackgroundStyle(currentArticle)}
            >
              {/* Hidden image for error detection and fallback */}
              <img 
                src={getImageUrl(currentArticle)} 
                alt=""
                className="hidden"
                onError={(e) => {
                  const backgroundDiv = e.currentTarget.parentElement;
                  if (backgroundDiv && currentArticle.urlToImage) {
                    // If original image fails, use the news source logo
                    const fallbackUrl = getSourceLogo(currentArticle.source.name);
                    backgroundDiv.style.backgroundImage = `url(${fallbackUrl})`;
                    backgroundDiv.style.backgroundSize = 'cover'; // Keep cover for consistency
                    backgroundDiv.style.backgroundRepeat = 'no-repeat';
                    backgroundDiv.style.backgroundPosition = 'center';
                  }
                }}
              />
            </div>
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 transition-opacity duration-500" />
            
            {/* News Content */}
            <div className="relative h-full flex flex-col p-3 sm:p-4 transition-all duration-500">
              {/* Source Badge - Top */}
              <div className="flex items-center justify-between mb-1 sm:mb-2 flex-shrink-0 transform transition-all duration-500">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-full p-1.5 flex items-center shadow-lg">
                    <img 
                      src={getProviderLogo(currentArticle.source.name)} 
                      alt={currentArticle.source.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        // If logo fails to load, show first letter of source name
                        const target = e.target as HTMLImageElement;
                        const container = target.parentElement;
                        if (container) {
                          container.innerHTML = `<span class="text-[#ff5900] font-bold text-sm w-8 h-8 flex items-center justify-center">${currentArticle.source.name.charAt(0)}</span>`;
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-1 bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-2 py-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-xs font-medium">LIVE</span>
                  </div>
                </div>
                
                {/* Click indicator */}
                <div className="bg-black bg-opacity-60 rounded-full p-1.5 transition-all duration-300 hover:bg-opacity-80">
                  <ExternalLink className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Title - Dynamic sizing with smooth transitions, positioned away from navigation buttons */}
              <div className="flex-1 flex items-center justify-center px-12 py-2 min-h-0">
                <div className={`text-white font-black leading-tight text-center w-full transition-all duration-500 ${getDynamicTextSize(currentArticle.title)}`} style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 1px 1px 2px rgba(0, 0, 0, 0.6)' }}>
                  <div className="break-words font-black max-w-full">
                    {currentArticle.title}
                  </div>
                </div>
              </div>

              {/* Time and Navigation - Bottom */}
              <div className="flex items-center justify-between mt-1 sm:mt-2 flex-shrink-0 transform transition-all duration-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-white/90" />
                  <span className="text-white/90 text-xs font-medium">{formatTimeAgo(currentArticle.publishedAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-white/80 text-xs font-medium">
                    {currentIndex + 1} / {displayArticles.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevNews();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextNews();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {displayArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToNews(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-500 ease-in-out hover:scale-150 ${
                index === currentIndex 
                  ? 'bg-[#ff5900] scale-125 shadow-lg shadow-[#ff5900]/50' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0033a0] via-[#0033a0]/90 to-[#ff5900] opacity-95" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
    </section>
  );
};