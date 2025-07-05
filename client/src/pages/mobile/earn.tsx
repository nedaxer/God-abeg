import MobileLayout from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DepositActivationModal } from '@/components/deposit-activation-modal';
import { DepositModal } from '@/components/deposit-modal';
import { 
  Gift,
  TrendingUp,
  Clock,
  Percent,
  ChevronRight,
  Star,
  Users,
  Coins,
  Target,
  Calendar,
  Wallet
} from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/language-context';
import { useState } from 'react';

export default function MobileEarn() {
  const { t } = useLanguage();
  const [depositActivationOpen, setDepositActivationOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  const handleFeatureClick = () => {
    setDepositActivationOpen(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setDepositModalOpen(false);
    // Handle payment method selection
  };

  const earnProducts = [
    {
      title: t('flexibleSavings'),
      subtitle: t('startEarningAnytime'),
      apy: '0.0%',
      icon: Percent,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10'
    },
    {
      title: t('fixedSavings'),
      subtitle: t('higherReturnsLocked'),
      apy: '0.0%',
      icon: Clock,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10'
    },
    {
      title: t('staking'),
      subtitle: t('stakeEarnRewards'),
      apy: '0.0%',
      icon: Coins,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10'
    },
    {
      title: t('defiMining'),
      subtitle: t('liquidityMiningRewards'),
      apy: '0.0%',
      icon: Target,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10'
    }
  ];

  // Empty popular coins array to show zero records
  const popularCoins: any[] = [];

  // Empty events array to show zero records
  const events: any[] = [];

  return (
    <MobileLayout>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-950">
        <h1 className="text-xl font-bold text-white">Earnings</h1>
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-gray-400" />
          <Gift className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Total Earnings */}
      <div className="px-4 pb-6">
        <Card className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm opacity-90">{t('total_earnings')}</div>
              <div className="text-2xl font-bold">$0.00</div>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>{t('yesterday')}: +$0.00</span>
            <Button 
              size="sm" 
              className="bg-white/20 hover:bg-white/30 backdrop-blur"
              onClick={handleFeatureClick}
            >
              {t('view_details')}
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {earnProducts.map((product, index) => (
            <Card 
              key={index} 
              className="bg-blue-900 border-blue-700 p-4 cursor-pointer"
              onClick={handleFeatureClick}
            >
              <div className={`w-12 h-12 ${product.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                <product.icon className={`w-6 h-6 ${product.color}`} />
              </div>
              <div className="mb-2">
                <div className="text-white font-medium">{product.title}</div>
                <div className="text-gray-400 text-sm">{product.subtitle}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${product.color}`}>{t('apy')} {product.apy}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      

      {/* Popular Savings */}
      <div className="px-4 pb-6">
        <h3 className="text-white font-medium mb-4">Popular Savings</h3>
        
        <Card className="bg-blue-900 border-blue-700 p-8 text-center">
          <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <div className="text-lg font-semibold text-gray-400 mb-2">No Savings Available</div>
          <div className="text-sm text-gray-500 mb-4">Make a deposit to unlock earning opportunities</div>
          <Button 
            onClick={handleFeatureClick}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Make Deposit
          </Button>
        </Card>
      </div>

      

      {/* My Products */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">My Products</h3>
          <button onClick={handleFeatureClick}>
            <span className="text-orange-500 text-sm">View All</span>
          </button>
        </div>
        
        <Card className="bg-blue-900 border-blue-700 p-4 text-center">
          <div className="text-gray-400 mb-2">{t('no_active_products')}</div>
          <div className="text-gray-500 text-sm mb-4">{t('start_earning_flexible')}</div>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleFeatureClick}
          >
            {t('start_earning')}
          </Button>
        </Card>
      </div>

      {/* Modals */}
      <DepositActivationModal
        isOpen={depositActivationOpen}
        onClose={() => setDepositActivationOpen(false)}
        onMakeDeposit={() => setDepositModalOpen(true)}
      />

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSelectMethod={handlePaymentMethodSelect}
      />
    </MobileLayout>
  );
}