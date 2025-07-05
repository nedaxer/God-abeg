import MobileLayout from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DepositRequiredModal from '@/components/deposit-required-modal';
import { 
  ChevronDown,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

export default function MobileSpot() {
  const { t } = useLanguage();
  const [orderType, setOrderType] = useState('Limit');
  const [marginEnabled, setMarginEnabled] = useState(false);
  const [price, setPrice] = useState('2573.59');
  const [quantity, setQuantity] = useState('');
  const [orderValue, setOrderValue] = useState('');
  const [maxBuy, setMaxBuy] = useState('0.00000 ETH');
  const [tpSlEnabled, setTpSlEnabled] = useState(false);
  const [postOnlyEnabled, setPostOnlyEnabled] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositModalAction, setDepositModalAction] = useState<'buy' | 'sell'>('buy');

  const orderbook = [
    { price: '2,573.80', quantity: '0.1314' },
    { price: '2,573.76', quantity: '0.1830' },
    { price: '2,573.75', quantity: '0.1941' },
    { price: '2,573.70', quantity: '0.1000' },
    { price: '2,573.68', quantity: '0.0080' },
    { price: '2,573.65', quantity: '1.2307' },
    { price: '2,573.64', quantity: '0.0040' },
    { price: '2,573.62', quantity: '0.0040' },
    { price: '2,573.61', quantity: '13.159' },
    { price: '2,573.60', quantity: '19.142' }
  ];

  const bottomOrderbook = [
    { price: '2,573.59', quantity: '22.765' },
    { price: '2,573.58', quantity: '11.928' },
    { price: '2,573.57', quantity: '0.0040' },
    { price: '2,573.56', quantity: '60.506' },
    { price: '2,573.55', quantity: '1.4839' },
    { price: '2,573.51', quantity: '0.0080' },
    { price: '2,573.44', quantity: '7.7741' },
    { price: '2,573.43', quantity: '0.0160' },
    { price: '2,573.42', quantity: '0.3000' },
    { price: '2,573.40', quantity: '0.2259' }
  ];

  const tradingPairs = [
    { pair: 'ETH/USDT', change: '-2.68%', volume: '100%' },
    { pair: 'ETH/USDT', change: '-10.14%', volume: '' },
    { pair: 'ETH35/USDT', change: '', volume: '' }
  ];

  return (
    <div className="h-full bg-blue-950">
      {/* Header */}
      <div className="p-4 bg-blue-950">
        <h1 className="text-xl font-bold text-white text-center">{t('spot_trading')}</h1>
      </div>

      <div className="flex h-[calc(100vh-180px)]">
        {/* Left Panel - Trading Form */}
        <div className="w-1/2 bg-blue-950 p-4 overflow-y-auto">
          {/* Trading Pair */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-white text-lg font-bold">ETH/USDT</span>
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded">-2.71%</span>
            </div>
          </div>

          {/* Margin Toggle */}
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">{t('margin')}</span>
              <button 
                onClick={() => setMarginEnabled(!marginEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  marginEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  marginEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </div>

          {/* Buy/Sell Toggle */}
          <div className="mb-4">
            <div className="flex bg-blue-900 rounded p-1">
              <button className="flex-1 bg-green-600 text-white py-2 rounded font-medium">
                {t('buy')}
              </button>
              <button className="flex-1 text-gray-400 py-2 font-medium">
                {t('sell')}
              </button>
            </div>
          </div>

          {/* Available Balance */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{t('available')}</span>
              <div className="flex items-center space-x-1">
                <span className="text-white">0 USDT</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Order Type */}
          <div className="mb-4">
            <div className="flex items-center justify-between bg-blue-900 rounded p-2">
              <span className="text-white">{orderType}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Price Input */}
          <div className="mb-4">
            <div className="text-gray-400 text-sm mb-1">{t('price_label')}</div>
            <div className="flex items-center space-x-2">
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-blue-900 border-blue-700 text-white flex-1 text-lg font-bold"
              />
              <span className="text-gray-400 text-sm">USDT</span>
            </div>
            <div className="text-green-500 text-sm mt-1">≈2,573.59 USD</div>
          </div>

          {/* Quantity Input */}
          <div className="mb-4">
            <div className="text-gray-400 text-sm mb-1">{t('quantity')}</div>
            <div className="flex items-center space-x-2">
              <Input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-blue-900 border-blue-700 text-white flex-1"
              />
              <span className="text-gray-400 text-sm">ETH</span>
            </div>
          </div>

          {/* Percentage Slider */}
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="flex-1 bg-blue-800 h-1 rounded">
                  <div className="w-0 h-1 bg-orange-500 rounded"></div>
                </div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Order Value */}
          <div className="mb-4">
            <div className="text-gray-400 text-sm mb-1">{t('order_value')}</div>
            <div className="flex items-center space-x-2">
              <Input
                value={orderValue}
                onChange={(e) => setOrderValue(e.target.value)}
                className="bg-blue-900 border-blue-700 text-white flex-1"
              />
              <span className="text-gray-400 text-sm">USDT</span>
            </div>
          </div>

          {/* Max Buy */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{t('max_buy')}</span>
              <span className="text-white text-sm">{maxBuy}</span>
            </div>
          </div>

          {/* Trading Options */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="tpsl-spot"
                checked={tpSlEnabled}
                onChange={(e) => setTpSlEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="tpsl-spot" className="text-white text-sm">{t('tp_sl')}</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="postonly-spot"
                checked={postOnlyEnabled}
                onChange={(e) => setPostOnlyEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="postonly-spot" className="text-white text-sm">{t('post_only')}</label>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">{t('gtc')}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Buy Button */}
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold mb-6"
            onClick={() => {
              setDepositModalAction('buy');
              setShowDepositModal(true);
            }}
          >
            {t('buy')}
          </Button>

          {/* Trading Pairs */}
          <div className="space-y-2">
            {tradingPairs.map((pair, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-blue-800">
                <span className="text-white text-sm">{pair.pair}</span>
                <div className="flex items-center space-x-2">
                  {pair.change && (
                    <span className={`text-sm ${pair.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                      {pair.change}
                    </span>
                  )}
                  {pair.volume && (
                    <span className="text-green-500 text-sm">{pair.volume}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Order Book */}
        <div className="w-1/2 bg-blue-950 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">{t('price')}</span>
              <span className="text-gray-400 text-sm">(USDT)</span>
            </div>
            <div className="text-gray-400 text-sm">{t('quantity')}</div>
          </div>

          {/* Sell Orders */}
          <div className="space-y-1 mb-4">
            {orderbook.map((order, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-red-400">{order.price}</span>
                <span className="text-white">{order.quantity}</span>
              </div>
            ))}
          </div>

          {/* Current Price */}
          <div className="text-center mb-4 py-2 bg-blue-900 rounded">
            <div className="text-red-400 text-lg font-bold">2,573.59</div>
            <div className="text-white text-sm">≈2,573.59 USD</div>
          </div>

          {/* Buy Orders */}
          <div className="space-y-1">
            {bottomOrderbook.map((order, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-green-400">{order.price}</span>
                <span className="text-white">{order.quantity}</span>
              </div>
            ))}
          </div>

          {/* Order Book Controls */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">95%</div>
            <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">5%</div>
          </div>

          {/* Order Book Footer */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>0.01</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="bg-blue-900 border-t border-blue-700">
        <div className="flex">
          <button className="flex-1 py-3 text-orange-500 border-b-2 border-orange-500 text-sm font-medium">
            {t('orders')}(0)
          </button>
          <button className="flex-1 py-3 text-gray-400 text-sm">
            {t('positions')}(0)
          </button>
          <button className="flex-1 py-3 text-gray-400 text-sm">
            {t('assets')}
          </button>
          <button className="flex-1 py-3 text-gray-400 text-sm">
            {t('borrowings')}(0)
          </button>
          <button className="flex-1 py-3 text-gray-400 text-sm">
            {t('tools')}(0)
          </button>
        </div>
      </div>

      {/* Deposit Required Modal */}
      <DepositRequiredModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        tradingType="spot"
        action={depositModalAction}
      />
    </div>
  );
}