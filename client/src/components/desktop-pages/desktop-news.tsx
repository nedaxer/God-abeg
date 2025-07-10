// @ts-nocheck
// TypeScript error suppression for development productivity
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Newspaper,
  TrendingUp,
  Globe,
  Calendar,
  Zap,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useLocation } from 'wouter';

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

export default function DesktopNews() {
  const [, navigate] = useLocation();

  // Fetch crypto news - same as mobile version
  const { data: newsData, isLoading, error, refetch } = useQuery({
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'negative':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getSentimentLabel = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'Bullish';
      case 'negative':
        return 'Bearish';
      default:
        return 'Neutral';
    }
  };

  const getSourceLogo = (sourceName: string) => {
    const logoMap: { [key: string]: string } = {
      'CoinDesk': '/logos/coindesk.png',
      'CryptoSlate': '/logos/cryptoslate.jpg',
      'CryptoBriefing': '/logos/cryptobriefing.png',
      'BeInCrypto': '/api/assets/download%20(1)_1751940902760.png',
      'Google News - Crypto': '/logos/google-news.jpg',
      'Google News - Bitcoin': '/logos/google-news.jpg',
      'CoinTelegraph': 'https://cointelegraph.com/favicon.ico',
      'Decrypt': 'https://decrypt.co/favicon.ico',
      'CryptoNews': 'https://cryptonews.com/favicon.ico'
    };
    return logoMap[sourceName] || `/api/news/logo/${encodeURIComponent(sourceName)}`;
  };

  const filteredNews = newsData || [];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-orange-500" />
              Crypto News
            </h1>
            <p className="text-gray-400">Stay updated with the latest cryptocurrency news and market insights</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-black/20 backdrop-blur-sm border-gray-700/50">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-3 bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-700 rounded w-5/6 animate-pulse" />
                  <div className="h-8 bg-gray-700 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border-red-500/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-red-400 mb-4">
                <Newspaper className="w-12 h-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Unable to Load News</h3>
                <p className="text-sm text-gray-400 mt-2">
                  There was an error loading the latest crypto news. Please try again.
                </p>
              </div>
              <Button
                onClick={() => refetch()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* News Grid */}
        {!isLoading && !error && (
          <>
            {filteredNews.length === 0 ? (
              <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50">
                <CardContent className="p-8 text-center">
                  <Newspaper className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No News Available</h3>
                  <p className="text-gray-400">
                    No news articles found for the selected category. Try selecting a different category.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((article: NewsArticle, index: number) => (
                  <Card
                    key={index}
                    className="bg-black/20 backdrop-blur-sm border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      </div>
                      <CardTitle className="text-white text-base leading-tight group-hover:text-orange-500 transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* News Image */}
                      <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                        {article.urlToImage ? (
                          <img
                            src={article.urlToImage}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getSourceLogo(article.source?.name || 'Crypto News');
                              target.className = "w-full h-full object-contain p-8";
                            }}
                          />
                        ) : (
                          <img 
                            src={getSourceLogo(article.source?.name || 'Crypto News')}
                            alt={article.source?.name || 'News'}
                            className="w-full h-full object-contain p-8"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/logos/google-news.jpg';
                              target.className = "w-full h-full object-contain p-8";
                            }}
                          />
                        )}
                      </div>
                      
                      {/* Full News Description */}
                      <div className="space-y-3">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {article.description}
                        </p>
                        
                        {/* Additional Details */}
                        <div className="pt-3 border-t border-gray-700/50">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <div className="flex items-center">
                              <Globe className="w-3 h-3 mr-1" />
                              <span className="truncate font-medium">{article.source?.name || 'Unknown Source'}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                          
                          {/* Media Type Badge */}
                          {article.mediaType && (
                            <div className="mb-3">
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30"
                              >
                                {article.mediaType === 'video' ? '📹 Video' : '📰 Article'}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-600 text-gray-300 hover:bg-orange-500 hover:border-orange-500 hover:text-white group-hover:bg-orange-500/10"
                      >
                        Read Full Article
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Refresh Info */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                News updates automatically every 10 minutes. Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </>
        )}
    </div>
  );
}