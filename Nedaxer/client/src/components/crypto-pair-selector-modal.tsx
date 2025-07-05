import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Star } from 'lucide-react';
import { CRYPTO_PAIRS, CryptoPair, getPairDisplayName } from '@/lib/crypto-pairs';
import { hapticLight } from '@/lib/haptics';

interface CryptoPairSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPair: (pair: CryptoPair) => void;
  currentPair?: CryptoPair;
}

export default function CryptoPairSelectorModal({
  isOpen,
  onClose,
  onSelectPair,
  currentPair
}: CryptoPairSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT']);

  const filteredPairs = CRYPTO_PAIRS.filter(pair => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      pair.symbol.toLowerCase().includes(query) ||
      pair.name.toLowerCase().includes(query) ||
      pair.baseAsset.toLowerCase().includes(query)
    );
  });

  const favoritePairs = CRYPTO_PAIRS.filter(pair => favorites.includes(pair.symbol));

  const handlePairSelect = (pair: CryptoPair) => {
    hapticLight();
    onSelectPair(pair);
    onClose();
  };

  const toggleFavorite = (symbol: string) => {
    hapticLight();
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const PairItem = ({ pair }: { pair: CryptoPair }) => (
    <div
      className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
      onClick={() => handlePairSelect(pair)}
    >
      <div className="flex items-center space-x-3">
        <div>
          <div className="text-white font-medium">{getPairDisplayName(pair)}</div>
          <div className="text-gray-400 text-sm">{pair.name}</div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(pair.symbol);
          }}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <Star 
            className={`w-4 h-4 ${
              favorites.includes(pair.symbol) 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-400'
            }`} 
          />
        </button>
        {currentPair?.symbol === pair.symbol && (
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto h-[80vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-0">
          <DialogTitle className="text-xl font-bold">Select Trading Pair</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="flex-shrink-0 relative mb-4 px-6">
          <Search className="absolute left-9 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search pairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {!searchQuery && favoritePairs.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2 px-1 sticky top-0 bg-gray-900 py-1">Favorites</h3>
              <div className="space-y-1 mb-4">
                {favoritePairs.map(pair => (
                  <PairItem key={pair.symbol} pair={pair} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2 px-1 sticky top-0 bg-gray-900 py-1">
              {searchQuery ? 'Search Results' : 'All Pairs'}
            </h3>
            <div className="space-y-1 pb-6">
              {filteredPairs.map(pair => (
                <PairItem key={pair.symbol} pair={pair} />
              ))}
            </div>
            
            {filteredPairs.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No pairs found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}