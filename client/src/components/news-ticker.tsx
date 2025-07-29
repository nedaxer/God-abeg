import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import backgroundImage from '@assets/45553da462098b9ac2a719705695cc6b_1752783666530.jpg';

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

  // Auto-play disabled - news stays static, user navigates manually
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        nextNews();
      }, 5000); // Change news every 5 seconds
    }

    return () => clearInterval(intervalId);
  }, [isAutoPlaying, displayArticles.length]);

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

    // Resume auto-play after 3 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 3000);
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

    // Resume auto-play after 3 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const nextNews = () => {
    // Instant change without transitions
    setCurrentIndex((prev) => (prev + 1) % displayArticles.length);
  };

  const prevNews = () => {
    // Instant change without transitions
    setCurrentIndex((prev) => (prev - 1 + displayArticles.length) % displayArticles.length);
  };

  const goToNews = (index: number) => {
    // Instant change without transitions
    setCurrentIndex(index);
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
    <section className="relative py-8 overflow-hidden z-50">
      {/* Background Image for entire section */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container mx-auto px-2 sm:px-4 relative z-10">
        {/* Single News Item with Swipe */}
        <div className="relative">
          <div
            className="relative w-full h-auto min-h-80 sm:min-h-96 md:min-h-[400px] rounded-xl overflow-hidden shadow-lg cursor-pointer select-none bg-transparent"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => window.open(currentArticle.url, '_blank')}
          >

            {/* News Content */}
            <div className="relative h-full flex flex-col p-3 sm:p-4">
              {/* NEWS Label and Source Badge - Top */}
              <div className="flex items-center justify-between mb-1 sm:mb-2 flex-shrink-0">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {/* NEWS Label */}
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    NEWS
                  </div>
                </div>

                {/* Click indicator */}
                <div className="bg-black bg-opacity-60 rounded-full p-1.5 hover:bg-opacity-80">
                  <ExternalLink className="h-3 w-3 text-white" />
                </div>
              </div>

              {/* Title and Description - Full content display */}
              <div className="flex-1 flex flex-col justify-center px-6 py-4 min-h-0">
                <div className="text-white font-bold leading-tight text-center w-full">
                  <div className="break-words font-bold max-w-full mb-4 text-base sm:text-lg md:text-xl leading-snug">
                    {currentArticle.title}
                  </div>
                  {currentArticle.description && (
                    <div className="text-white/90 text-sm sm:text-base md:text-lg font-medium leading-relaxed break-words max-w-4xl mx-auto">
                      {currentArticle.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Time and Navigation - Bottom */}
              <div className="flex items-center justify-between mt-1 sm:mt-2 flex-shrink-0">
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
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextNews();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {displayArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToNews(index);
              }}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex 
                  ? 'bg-[#ff5900] scale-125 shadow-lg shadow-[#ff5900]/50' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};