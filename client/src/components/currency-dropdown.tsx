import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';

interface CurrencyDropdownProps {
  selectedCurrency: string;
  onSelectCurrency: (currency: string) => void;
  className?: string;
}

export default function CurrencyDropdown({ selectedCurrency, onSelectCurrency, className = '' }: CurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Most used currencies
  const mostUsedCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  // Additional currencies
  const additionalCurrencies = [
    { code: 'CHF', name: 'Swiss Franc', symbol: '₣' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
    { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
    { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
    { code: 'LAK', name: 'Laotian Kip', symbol: '₭' },
    { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$' },
    { code: 'BND', name: 'Brunei Dollar', symbol: 'B$' },
    { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'WST', name: 'Samoan Tala', symbol: 'T' },
    { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$' },
    { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT' },
    { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$' },
    { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K' }
  ];

  const allCurrencies = [...mostUsedCurrencies, ...additionalCurrencies];

  // Filter currencies based on search
  const filteredCurrencies = allCurrencies.filter(currency =>
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMostUsed = mostUsedCurrencies.filter(currency =>
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOther = additionalCurrencies.filter(currency =>
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencySelect = (currency: string) => {
    onSelectCurrency(currency);
    setIsOpen(false);
    setSearchQuery('');
  };

  const selectedCurrencyData = allCurrencies.find(c => c.code === selectedCurrency);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
      >
        <span>{selectedCurrency}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-blue-950 border border-blue-800 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-blue-800">
            <h3 className="text-lg font-semibold text-white mb-3">Select Currency</h3>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search currencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-blue-900 border-blue-700 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Currency List */}
          <div className="max-h-80 overflow-y-auto">
            {searchQuery ? (
              // Show all filtered results when searching
              <div className="p-2">
                {filteredCurrencies.length > 0 ? (
                  filteredCurrencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency.code)}
                      className="w-full flex items-center justify-between p-3 hover:bg-blue-900 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{currency.symbol}</span>
                        <div className="text-left">
                          <div className="text-white font-medium">{currency.code}</div>
                          <div className="text-gray-400 text-sm">{currency.name}</div>
                        </div>
                      </div>
                      {selectedCurrency === currency.code && (
                        <Check className="w-5 h-5 text-orange-500" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-400">
                    No currencies found matching "{searchQuery}"
                  </div>
                )}
              </div>
            ) : (
              // Show organized sections when not searching
              <>
                {/* Most Used Section */}
                <div className="p-2">
                  <h4 className="text-sm font-medium text-gray-400 px-3 py-2 uppercase tracking-wider">
                    Most Used
                  </h4>
                  {filteredMostUsed.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency.code)}
                      className="w-full flex items-center justify-between p-3 hover:bg-blue-900 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{currency.symbol}</span>
                        <div className="text-left">
                          <div className="text-white font-medium">{currency.code}</div>
                          <div className="text-gray-400 text-sm">{currency.name}</div>
                        </div>
                      </div>
                      {selectedCurrency === currency.code && (
                        <Check className="w-5 h-5 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-blue-800 my-2" />

                {/* Other Currencies Section */}
                <div className="p-2">
                  <h4 className="text-sm font-medium text-gray-400 px-3 py-2 uppercase tracking-wider">
                    Other Currencies
                  </h4>
                  {filteredOther.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency.code)}
                      className="w-full flex items-center justify-between p-3 hover:bg-blue-900 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{currency.symbol}</span>
                        <div className="text-left">
                          <div className="text-white font-medium">{currency.code}</div>
                          <div className="text-gray-400 text-sm">{currency.name}</div>
                        </div>
                      </div>
                      {selectedCurrency === currency.code && (
                        <Check className="w-5 h-5 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}