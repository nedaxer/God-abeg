import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, ArrowRight, Newspaper, FileText, Award, Clock, ExternalLink, RefreshCw, Globe, Zap, TrendingUp } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
  urlToImage?: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
}

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [liveNewsData, setLiveNewsData] = useState<NewsArticle[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch real crypto news from your mobile app API
  const { data: newsData, isLoading, error, refetch } = useQuery<NewsArticle[]>({
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
    gcTime: 15 * 60 * 1000 // Keep in cache for 15 minutes
  });

  // Use live news data if available, otherwise fall back to regular API data
  const displayNewsData = liveNewsData.length > 0 ? liveNewsData : newsData;

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}h ago`;
      } else {
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
      }
    } catch {
      return 'Recently';
    }
  };

  // Get source logo
  const getSourceLogo = (sourceName: string) => {
    const logoMap: { [key: string]: string } = {
      'CoinDesk': '/logos/coindesk.png',
      'CryptoSlate': '/logos/cryptoslate.jpg',
      'CryptoBriefing': '/logos/cryptobriefing.png',
      'BeInCrypto': '/api/assets/download_1751940923486.jpeg',
      'Google News - Crypto': '/logos/google-news.jpg',
      'Google News - Bitcoin': '/logos/google-news.jpg',
      'CoinTelegraph': 'https://cointelegraph.com/favicon.ico',
      'Decrypt': 'https://decrypt.co/favicon.ico',
      'CryptoNews': 'https://cryptonews.com/favicon.ico'
    };
    return logoMap[sourceName] || `/api/news/logo/${encodeURIComponent(sourceName)}`;
  };

  // Get category for news source
  const getCategory = (sourceName: string) => {
    const categoryMap: { [key: string]: string } = {
      'CoinDesk': 'Market News',
      'CoinTelegraph': 'Breaking News',
      'Decrypt': 'Technology',
      'CryptoSlate': 'Analysis',
      'CryptoBriefing': 'Research',
      'BeInCrypto': 'Market Update',
      'CryptoNews': 'General News',
      'Google News - Crypto': 'Trending',
      'Google News - Bitcoin': 'Bitcoin News'
    };
    return categoryMap[sourceName] || 'Crypto News';
  };

  const categories = ['All', 'Market News', 'Breaking News', 'Technology', 'Analysis', 'Research'];

  const filteredNews = displayNewsData?.filter(article => {
    if (selectedCategory === 'All') return true;
    return getCategory(article.source.name) === selectedCategory;
  }) || [];

  const pressReleases = [
    {
      title: "Nedaxer Announces Strategic Partnership with Blockchain Data Provider",
      date: "March 20, 2025",
      link: "#",
    },
    {
      title: "Nedaxer Receives Industry Award for Crypto Trading Innovation",
      date: "February 5, 2025",
      link: "#",
    },
    {
      title: "Nedaxer Appoints New Head of Cryptocurrency Markets",
      date: "January 12, 2025",
      link: "#",
    },
  ];



  return (
    <PageLayout 
      title="Live Crypto News & Market Updates" 
      subtitle="Real-time cryptocurrency news from CoinDesk, CoinTelegraph, Decrypt, and other leading sources"
      bgColor="#0033a0"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-[#0033a0]" />
              <h2 className="text-3xl font-bold text-[#0033a0]">Live Crypto News</h2>
            </div>
            {isConnected && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            )}
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center space-x-2 border-[#0033a0] text-[#0033a0] hover:bg-[#0033a0] hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#0033a0] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-[#0033a0]" />
              <span className="text-lg text-gray-900">Loading latest crypto news...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 mb-4">Failed to load news. Please try again.</p>
              <Button
                onClick={() => refetch()}
                className="bg-[#0033a0] hover:bg-opacity-90 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* News Grid */}
        {filteredNews && filteredNews.length > 0 && (
          <div className="mb-12">
            {/* Featured News Item */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full relative">
                      {filteredNews[0].urlToImage ? (
                        <img 
                          src={filteredNews[0].urlToImage} 
                          alt={filteredNews[0].title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getSourceLogo(filteredNews[0].source.name);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0033a0] to-[#ff5900] flex items-center justify-center">
                          <img 
                            src={getSourceLogo(filteredNews[0].source.name)} 
                            alt={filteredNews[0].source.name}
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6 md:w-1/2">
                    <div className="flex items-center mb-3">
                      <span className="bg-[#0033a0] text-white text-xs px-3 py-1 rounded-full font-medium">
                        {getCategory(filteredNews[0].source.name)}
                      </span>
                      <div className="flex items-center ml-3 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDate(filteredNews[0].publishedAt)}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 line-clamp-2">
                      {filteredNews[0].title}
                    </h3>
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {filteredNews[0].description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={getSourceLogo(filteredNews[0].source.name)} 
                          alt={filteredNews[0].source.name}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {filteredNews[0].source.name}
                        </span>
                      </div>
                      <a 
                        href={filteredNews[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
                      >
                        Read Full Article <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other News Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.slice(1, 13).map((article, index) => (
                <article key={`${article.url}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    {article.urlToImage ? (
                      <img 
                        src={article.urlToImage} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getSourceLogo(article.source.name);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <img 
                          src={getSourceLogo(article.source.name)} 
                          alt={article.source.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-[#0033a0] text-white text-xs px-2 py-1 rounded-full font-medium">
                        {getCategory(article.source.name)}
                      </span>
                      <div className="flex items-center ml-3 text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-700 mb-3 line-clamp-2 text-sm">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={getSourceLogo(article.source.name)} 
                          alt={article.source.name}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {article.source.name}
                        </span>
                      </div>
                      <a 
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0033a0] hover:text-[#ff5900] font-semibold text-sm flex items-center"
                      >
                        Read <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        
        {/* News Sources Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Trusted Crypto News Sources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: 'CoinDesk', logo: '/logos/coindesk.png' },
              { name: 'CoinTelegraph', logo: 'https://cointelegraph.com/favicon.ico' },
              { name: 'Decrypt', logo: 'https://decrypt.co/favicon.ico' },
              { name: 'CryptoSlate', logo: '/logos/cryptoslate.jpg' },
              { name: 'CryptoBriefing', logo: '/logos/cryptobriefing.png' },
              { name: 'BeInCrypto', logo: '/api/assets/download_1751940923486.jpeg' },
              { name: 'CryptoNews', logo: 'https://cryptonews.com/favicon.ico' },
              { name: 'Google News', logo: '/logos/google-news.jpg' }
            ].map((source, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow text-center">
                <img 
                  src={source.logo} 
                  alt={source.name}
                  className="w-12 h-12 object-contain mx-auto mb-2"
                />
                <p className="text-sm font-medium text-gray-900">{source.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nedaxer Press Releases */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Nedaxer Press Releases</h2>
          
          <div className="space-y-4 mb-8">
            {pressReleases.map((release, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <FileText className="text-[#0033a0] mt-1 mr-3 h-6 w-6 flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="flex items-center mb-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{release.date}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900">{release.title}</h3>
                    <Link 
                      href={release.link} 
                      className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center text-sm"
                    >
                      Download Press Release <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="#" 
              className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center justify-center"
            >
              View All Press Releases <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Cryptocurrency Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Cryptocurrency Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Newspaper className="text-[#0033a0] h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold text-[#0033a0]">Market Reports</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Weekly and monthly cryptocurrency market reports, trend analysis, and blockchain data insights.
              </p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Download Reports <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <Award className="text-[#0033a0] h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold text-[#0033a0]">Trading Guides</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Comprehensive guides to cryptocurrency trading, technical analysis, and strategy development.
              </p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                View Guides <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <FileText className="text-[#0033a0] h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold text-[#0033a0]">Research Papers</h3>
              </div>
              <p className="text-gray-700 mb-4">
                In-depth research on blockchain technology, cryptocurrency markets, and emerging digital asset trends.
              </p>
              <Link 
                href="#" 
                className="text-[#0033a0] hover:text-[#ff5900] font-semibold flex items-center"
              >
                Browse Research <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-[#0033a0] to-[#ff5900] text-white rounded-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Zap className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Stay Ahead of the Markets</h2>
              <p className="text-lg opacity-90">Get the latest crypto news, market analysis, and trading opportunities delivered to your inbox.</p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                />
                <Button
                  className="bg-white text-[#0033a0] hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg"
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}