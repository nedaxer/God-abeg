import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/language-context';

export default function NotificationSettings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    latestEvents: true,
    announcement: true,
    rewards: true,
    tradingViewAlerts: true,
    news: true,
    strategySignal: true,
    accountChanges: true,
    campaigns: true,
    marketAlerts: true,
    priceAlerts: true,
    newContractAlerts: true
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1a1a40]">
        <Link href="/mobile/notifications">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-lg font-semibold">{t('notificationSettings')}</h1>
        <div className="w-6 h-6" />
      </div>

      {/* Description */}
      <div className="px-4 py-6">
        <p className="text-gray-400 text-sm leading-relaxed">
          In order to safeguard your assets and account, you will be automatically 
          notified of any system or trade alerts.
        </p>
      </div>

      {/* In-App Messages Section */}
      <div className="px-4 pb-6">
        <h2 className="text-white font-medium text-lg mb-4">{t('inAppMessages')}</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <span className="text-white text-base">{t('latestEvents')}</span>
            <Switch
              checked={settings.latestEvents}
              onCheckedChange={() => handleToggle('latestEvents')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-white text-base">{t('announcement')}</span>
            <Switch
              checked={settings.announcement}
              onCheckedChange={() => handleToggle('announcement')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-white text-base">{t('rewards')}</span>
            <Switch
              checked={settings.rewards}
              onCheckedChange={() => handleToggle('rewards')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-white text-base">{t('tradingViewAlerts')}</span>
            <Switch
              checked={settings.tradingViewAlerts}
              onCheckedChange={() => handleToggle('tradingViewAlerts')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-white text-base">{t('news')}</span>
            <Switch
              checked={settings.news}
              onCheckedChange={() => handleToggle('news')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-white text-base">{t('strategySignal')}</span>
            <Switch
              checked={settings.strategySignal}
              onCheckedChange={() => handleToggle('strategySignal')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-2">
              <span className="text-white text-base">{t('accountChanges')}</span>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
            <Switch
              checked={settings.accountChanges}
              onCheckedChange={() => handleToggle('accountChanges')}
            />
          </div>
        </div>
      </div>

      {/* Push Notifications Section */}
      <div className="px-4 pb-6">
        <h2 className="text-white font-medium text-lg mb-4">Push Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <span className="text-white text-base">Campaigns</span>
            <Switch
              checked={settings.campaigns}
              onCheckedChange={() => handleToggle('campaigns')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-white text-base">Market Alerts</span>
            <Switch
              checked={settings.marketAlerts}
              onCheckedChange={() => handleToggle('marketAlerts')}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-blue-800 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-white text-base">Price Alerts</span>
            </div>
            <Switch
              checked={settings.priceAlerts}
              onCheckedChange={() => handleToggle('priceAlerts')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-white text-base">New Contract Alerts</span>
            </div>
            <Switch
              checked={settings.newContractAlerts}
              onCheckedChange={() => handleToggle('newContractAlerts')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}