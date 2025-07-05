
import MobileLayout from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/language-context';

interface CurrencySelectionProps {
  onSelectCurrency?: (currency: string) => void;
  currentCurrency?: string;
}

export default function CurrencySelection({ onSelectCurrency, currentCurrency = 'USD' }: CurrencySelectionProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  // Most used currencies
  const mostUsedCurrencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' }
  ];

  // Additional currencies with names
  const additionalCurrenciesData = [
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'VND', name: 'Vietnamese Dong' },
    { code: 'TWD', name: 'Taiwan Dollar' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },
    { code: 'ISK', name: 'Icelandic Krona' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'QAR', name: 'Qatari Riyal' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'OMR', name: 'Omani Rial' },
    { code: 'ILS', name: 'Israeli Shekel' },
    { code: 'JOD', name: 'Jordanian Dinar' },
    { code: 'LBP', name: 'Lebanese Pound' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'ETB', name: 'Ethiopian Birr' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'PEN', name: 'Peruvian Sol' },
    { code: 'UYU', name: 'Uruguayan Peso' },
    { code: 'BOB', name: 'Bolivian Boliviano' },
    { code: 'PYG', name: 'Paraguayan Guarani' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'FJD', name: 'Fijian Dollar' }
  ].sort((a, b) => a.code.localeCompare(b.code));

  // All currencies combined
  const allCurrencies = [...mostUsedCurrencies, ...additionalCurrenciesData];

  // Filter currencies based on search
  const filteredMostUsed = mostUsedCurrencies.filter(currency =>
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOther = additionalCurrenciesData.filter(currency =>
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    if (onSelectCurrency) {
      onSelectCurrency(currency);
    }
    // Store in localStorage for persistence
    localStorage.setItem('selectedCurrency', currency);
    
    // Navigate back to settings if no parent handler
    if (!onSelectCurrency) {
      // Small delay to show selection feedback
      setTimeout(() => {
        window.history.back();
      }, 300);
    }
  };

  return (
    <MobileLayout hideBottomNav={true}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-950 border-b border-blue-700">
        <button onClick={() => window.history.back()}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">{t('currency_selection')}</h1>
        <div className="w-6 h-6" /> {/* Spacer */}
      </div>

      <div className="px-4 py-4 bg-blue-950 min-h-screen">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search currencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-blue-900 border-gray-600 text-white placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Most Used Section */}
        {filteredMostUsed.length > 0 && (
          <div className="mb-4">
            <h2 className="text-gray-400 text-xs mb-2">Most Used</h2>
            <div className="space-y-2">
              {filteredMostUsed.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency.code)}
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    selectedCurrency === currency.code
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-600 bg-blue-900 hover:bg-blue-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-white text-sm font-medium">{currency.code}</div>
                      <div className="text-gray-400 text-xs">{currency.name}</div>
                    </div>
                    {selectedCurrency === currency.code && (
                      <Check className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Currencies Section */}
        {(searchQuery === '' || filteredOther.length > 0) && (
          <div>
            <h2 className="text-gray-400 text-xs mb-2">
              {searchQuery === '' ? 'All Currencies' : 'More Results'}
            </h2>
            <div className="space-y-1">
              {(searchQuery === '' ? additionalCurrenciesData : filteredOther).map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency.code)}
                  className={`w-full p-2 rounded-lg text-left transition-colors ${
                    selectedCurrency === currency.code
                      ? 'bg-orange-500 text-white'
                      : 'bg-blue-800 text-gray-300 hover:bg-blue-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{currency.code}</span>
                      <span className="text-xs text-gray-400 ml-2">{currency.name}</span>
                    </div>
                    {selectedCurrency === currency.code && (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery !== '' && filteredMostUsed.length === 0 && filteredOther.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No currencies found</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
