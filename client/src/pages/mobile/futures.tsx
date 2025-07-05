import MobileLayout from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DepositRequiredModal from '@/components/deposit-required-modal';
import { 
  ChevronDown,
  Info,
  Calculator,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

export default function MobileFutures() {
  const { t } = useLanguage();
  const [orderType, setOrderType] = useState('Limit');
  const [leverage, setLeverage] = useState('10x');
  const [price, setPrice] = useState('105,816.30');
  const [quantity, setQuantity] = useState('');
  const [margin, setMargin] = useState('Cross');
  const [tpSlEnabled, setTpSlEnabled] = useState(false);
  const [postOnlyEnabled, setPostOnlyEnabled] = useState(false);
  const [reduceOnlyEnabled, setReduceOnlyEnabled] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositModalAction, setDepositModalAction] = useState<'long' | 'short'>('long');

  const orderbook = [
    { price: '105,818.30', quantity: '0.003' },
    { price: '105,818.80', quantity: '0.001' },
    { price: '105,817.80', quantity: '1.002' },
    { price: '105,817.70', quantity: '1.002' },
    { price: '105,817.60', quantity: '2.925' },
    { price: '105,817.50', quantity: '2.786' },
    { price: '105,816.60', quantity: '6.626' }
  ];

  const bottomOrderbook = [
    { price: '105,816.50', quantity: '6.653' },
    { price: '105,816.40', quantity: '0.02' },
    { price: '105,817.70', quantity: '0.002' },
    { price: '105,814.60', quantity: '0.791' },
    { price: '105,814.50', quantity: '2.3' },
    { price: '105,814.40', quantity: '0.002' },
    { price: '105,814.60', quantity: '0.056' }
  ];

  return (
    <div className="h-full bg-blue-950">
      {/* Header */}
      <div className="p-4 bg-blue-950">
        <h1 className="text-xl font-bold text-white text-center">{t('futures_trading')}</h1>
      </div>

      <div className="flex h-[calc(100vh-180px)]">
        {/* Left Panel - Trading Form */}
        <div className="w-1/2 bg-blue-950 p-4 overflow-y-auto">
          {/* Trading Pair */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-white text-lg font-bold">BTCUSDT</span>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">+0.01%</span>
            </div>
          </div>

          {/* Margin Type */}
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant={margin === 'Cross' ? 'default' : 'ghost'}
                size="sm"
                className="text-xs"
                onClick={() => setMargin('Cross')}
              >
                {t('cross')}
              </Button>
              <span className="text-white text-sm">{leverage}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-orange-500 text-xs mt-1">Funding Rate / Countdown</div>
            <div className="text-white text-sm">0.0000% /00 : 42 : 14</div>
          </div>

          {/* Available Balance */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{t('available')}</span>
              <div className="flex items-center space-x-1">
                <span className="text-white">0.0000 USDT</span>
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
                className="bg-blue-900 border-blue-700 text-white flex-1"
              />
              <span className="text-gray-400 text-sm">USDT</span>
            </div>
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
              <span className="text-gray-400 text-sm">BTC</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
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
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{t('value')}</span>
              <span className="text-green-500">0/0 USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('cost')}</span>
              <span className="text-green-500">0/0 USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('liq_price')}</span>
              <span className="text-orange-500">{t('calculator')}</span>
            </div>
          </div>

          {/* Trading Options */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="tpsl"
                checked={tpSlEnabled}
                onChange={(e) => setTpSlEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="tpsl" className="text-white text-sm">{t('tp_sl')}</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="postonly"
                checked={postOnlyEnabled}
                onChange={(e) => setPostOnlyEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="postonly" className="text-white text-sm">{t('post_only')}</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="reduceonly"
                checked={reduceOnlyEnabled}
                onChange={(e) => setReduceOnlyEnabled(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="reduceonly" className="text-white text-sm">{t('reduce_only')}</label>
            </div>
          </div>

          {/* Trading Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              onClick={() => {
                setDepositModalAction('long');
                setShowDepositModal(true);
              }}
            >
              {t('long')}
            </Button>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
              onClick={() => {
                setDepositModalAction('short');
                setShowDepositModal(true);
              }}
            >
              {t('short')}
            </Button>
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
            <div className="text-red-400 text-lg font-bold">105,816.50</div>
            <div className="text-white text-sm">105,816.60</div>
            <Button size="sm" className="mt-1 text-xs">More</Button>
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
            <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">37%</div>
            <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">63%</div>
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
        tradingType="futures"
        action={depositModalAction}
      />
    </div>
  );
}