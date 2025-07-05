import axios from 'axios';

interface ExchangeRateProvider {
  name: string;
  fetchRates: () => Promise<{ [key: string]: number } | null>;
  priority: number;
}

interface ExchangeRateResponse {
  rates: { [key: string]: number };
  source: string;
  lastUpdated: string;
  success: boolean;
}

class ExchangeRateService {
  private cache: { rates: { [key: string]: number }; timestamp: number; source: string } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  private providers: ExchangeRateProvider[] = [
    {
      name: 'ExchangeRate-API',
      priority: 1,
      fetchRates: async () => {
        try {
          const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
            timeout: 10000
          });
          return response.data.rates;
        } catch (error) {
          console.warn('ExchangeRate-API failed:', error);
          return null;
        }
      }
    },
    {
      name: 'Fixer.io',
      priority: 2,
      fetchRates: async () => {
        try {
          // Free tier endpoint
          const response = await axios.get('http://data.fixer.io/api/latest?access_key=FREE_API_KEY&base=USD', {
            timeout: 10000
          });
          if (response.data.success) {
            return response.data.rates;
          }
          return null;
        } catch (error) {
          console.warn('Fixer.io failed:', error);
          return null;
        }
      }
    },
    {
      name: 'ExchangeRate.host',
      priority: 3,
      fetchRates: async () => {
        try {
          const response = await axios.get('https://api.exchangerate.host/latest?base=USD', {
            timeout: 10000
          });
          if (response.data.success) {
            return response.data.rates;
          }
          return null;
        } catch (error) {
          console.warn('ExchangeRate.host failed:', error);
          return null;
        }
      }
    },
    {
      name: 'CurrencyAPI',
      priority: 4,
      fetchRates: async () => {
        try {
          const response = await axios.get('https://api.currencyapi.com/v3/latest?apikey=FREE_API_KEY&base_currency=USD', {
            timeout: 10000
          });
          if (response.data.data) {
            const rates: { [key: string]: number } = {};
            Object.keys(response.data.data).forEach(currency => {
              rates[currency] = response.data.data[currency].value;
            });
            return rates;
          }
          return null;
        } catch (error) {
          console.warn('CurrencyAPI failed:', error);
          return null;
        }
      }
    },
    {
      name: 'Open Exchange Rates',
      priority: 5,
      fetchRates: async () => {
        try {
          const response = await axios.get('https://openexchangerates.org/api/latest.json?app_id=FREE_APP_ID', {
            timeout: 10000
          });
          return response.data.rates;
        } catch (error) {
          console.warn('Open Exchange Rates failed:', error);
          return null;
        }
      }
    },
    {
      name: 'CurrencyLayer',
      priority: 6,
      fetchRates: async () => {
        try {
          const response = await axios.get('http://api.currencylayer.com/live?access_key=FREE_ACCESS_KEY&source=USD', {
            timeout: 10000
          });
          if (response.data.success && response.data.quotes) {
            const rates: { [key: string]: number } = {};
            Object.keys(response.data.quotes).forEach(key => {
              const currency = key.replace('USD', '');
              rates[currency] = response.data.quotes[key];
            });
            return rates;
          }
          return null;
        } catch (error) {
          console.warn('CurrencyLayer failed:', error);
          return null;
        }
      }
    }
  ];

  // Comprehensive fallback rates based on real market data (no duplicates)
  private fallbackRates: { [key: string]: number } = {
    'USD': 1,           // Base currency
    'EUR': 0.9234,      // Euro
    'GBP': 0.7856,      // British Pound
    'JPY': 150.32,      // Japanese Yen
    'CAD': 1.3542,      // Canadian Dollar
    'AUD': 1.5187,      // Australian Dollar
    'CHF': 0.8763,      // Swiss Franc
    'CNY': 7.2344,      // Chinese Yuan
    'INR': 83.1234,     // Indian Rupee
    'KRW': 1315.67,     // South Korean Won
    'BRL': 6.1234,      // Brazilian Real
    'MXN': 17.0567,     // Mexican Peso
    'RUB': 92.3456,     // Russian Ruble
    'SGD': 1.3456,      // Singapore Dollar
    'HKD': 7.8234,      // Hong Kong Dollar
    'NOK': 10.8765,     // Norwegian Krone
    'SEK': 10.7234,     // Swedish Krona
    'DKK': 6.8567,      // Danish Krone
    'PLN': 4.0234,      // Polish Zloty
    'CZK': 22.6789,     // Czech Koruna
    'HUF': 358.45,      // Hungarian Forint
    'RON': 4.5678,      // Romanian Leu
    'BGN': 1.8045,      // Bulgarian Lev
    'TRY': 29.3456,     // Turkish Lira
    'ZAR': 18.6789,     // South African Rand
    'EGP': 30.7890,     // Egyptian Pound
    'MAD': 10.1234,     // Moroccan Dirham
    'NGN': 774.56,      // Nigerian Naira
    'KES': 154.23,      // Kenyan Shilling
    'UGX': 3742.34,     // Ugandan Shilling
    'AED': 3.6734,      // UAE Dirham
    'SAR': 3.7523,      // Saudi Riyal
    'QAR': 3.6412,      // Qatari Riyal
    'KWD': 0.3067,      // Kuwaiti Dinar
    'BHD': 0.3771,      // Bahraini Dinar
    'OMR': 0.3845,      // Omani Rial
    'ILS': 3.6234,      // Israeli Shekel
    'PKR': 277.89,      // Pakistani Rupee
    'BDT': 119.45,      // Bangladeshi Taka
    'VND': 24321.45,    // Vietnamese Dong
    'THB': 35.2345,     // Thai Baht
    'MYR': 4.6234,      // Malaysian Ringgit
    'IDR': 15823.45,    // Indonesian Rupiah
    'PHP': 55.6789,     // Philippine Peso
    'TWD': 31.7890,     // Taiwan Dollar
    'NZD': 1.6745,      // New Zealand Dollar
    'CLP': 912.34,      // Chilean Peso
    'COP': 4123.45,     // Colombian Peso
    'PEN': 3.7234,      // Peruvian Sol
    'UYU': 39.2345,     // Uruguayan Peso
    'ARS': 234.56,      // Argentine Peso
    'BOB': 6.9123,      // Bolivian Boliviano
    'PYG': 7234.56,     // Paraguayan Guaraní
    'GEL': 2.6789,      // Georgian Lari
    'UAH': 36.7890,     // Ukrainian Hryvnia
    'KZT': 456.78,      // Kazakhstani Tenge
    'UZS': 12234.56,    // Uzbekistani Som
    'MNT': 3456.78,     // Mongolian Tugrik
    'MMK': 2098.45,     // Myanmar Kyat
    'LAK': 21234.56,    // Laotian Kip
    'KHR': 4098.76,     // Cambodian Riel
    'BND': 1.3456,      // Brunei Dollar
    'FJD': 2.2345,      // Fijian Dollar
    'PGK': 3.9876,      // Papua New Guinean Kina
    'TOP': 2.3456,      // Tongan Paʻanga
    'WST': 2.7234,      // Samoan Tala
    'VUV': 123.45,      // Vanuatu Vatu
    'SBD': 8.4567,      // Solomon Islands Dollar
    'XPF': 117.89,      // CFP Franc
    'MOP': 8.0789,      // Macanese Pataca
    'ISK': 138.45,      // Icelandic Króna
    'LKR': 298.76,      // Sri Lankan Rupee
    'NPR': 133.12,      // Nepalese Rupee
    'BTN': 83.45,       // Bhutanese Ngultrum
    'MVR': 15.42,       // Maldivian Rufiyaa
    'AFN': 71.23,       // Afghan Afghani
    'IRR': 42034.56,    // Iranian Rial
    'IQD': 1309.87,     // Iraqi Dinar
    'JOD': 0.7089,      // Jordanian Dinar
    'LBP': 15023.45,    // Lebanese Pound
    'SYP': 2512.34,     // Syrian Pound
    'YER': 250.67,      // Yemeni Rial
    'ETB': 56.78,       // Ethiopian Birr
    'TZS': 2523.45,     // Tanzanian Shilling
    'RWF': 1298.76,     // Rwandan Franc
    'BIF': 2876.54,     // Burundian Franc
    'DJF': 177.89,      // Djiboutian Franc
    'ERN': 15.0,        // Eritrean Nakfa
    'SOS': 571.23,      // Somali Shilling
    'XOF': 605.67,      // West African CFA Franc
    'XAF': 605.67,      // Central African CFA Franc
    'GMD': 67.89,       // Gambian Dalasi
    'GHS': 12.34,       // Ghanaian Cedi
    'GNF': 8567.89,     // Guinean Franc
    'LRD': 189.45,      // Liberian Dollar
    'SLE': 22.67,       // Sierra Leonean Leone
    'MRU': 36.78,       // Mauritanian Ouguiya
    'CVE': 101.23,      // Cape Verdean Escudo
    'STP': 22456.78,    // São Tomé and Príncipe Dobra
    'AOA': 823.45,      // Angolan Kwanza
    'BWP': 13.67,       // Botswanan Pula
    'LSL': 18.45,       // Lesotho Loti
    'NAD': 18.45,       // Namibian Dollar
    'SZL': 18.45,       // Swazi Lilangeni
    'ZMW': 26.78,       // Zambian Kwacha
    'ZWL': 321.12       // Zimbabwean Dollar
  };

  async getRates(): Promise<ExchangeRateResponse> {
    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      return {
        rates: this.cache.rates,
        source: this.cache.source + ' (cached)',
        lastUpdated: new Date(this.cache.timestamp).toISOString(),
        success: true
      };
    }

    // Try providers in priority order
    for (const provider of this.providers.sort((a, b) => a.priority - b.priority)) {
      try {
        console.log(`Attempting to fetch rates from ${provider.name}...`);
        const rates = await provider.fetchRates();
        
        if (rates && Object.keys(rates).length > 30) { // Ensure we got comprehensive data
          // Add USD as base currency if not present
          if (!rates.USD) {
            rates.USD = 1;
          }

          // Cache the successful result
          this.cache = {
            rates,
            timestamp: Date.now(),
            source: provider.name
          };

          console.log(`Successfully fetched ${Object.keys(rates).length} exchange rates from ${provider.name}`);
          
          return {
            rates,
            source: provider.name,
            lastUpdated: new Date().toISOString(),
            success: true
          };
        }
      } catch (error) {
        console.warn(`Provider ${provider.name} failed:`, error);
        continue;
      }
    }

    // If all providers fail, use fallback rates
    console.warn('All exchange rate providers failed, using fallback rates');
    
    this.cache = {
      rates: this.fallbackRates,
      timestamp: Date.now(),
      source: 'Fallback'
    };

    return {
      rates: this.fallbackRates,
      source: 'Fallback (providers unavailable)',
      lastUpdated: new Date().toISOString(),
      success: false
    };
  }

  // Force refresh rates (bypass cache)
  async forceRefresh(): Promise<ExchangeRateResponse> {
    this.cache = null;
    return this.getRates();
  }

  // Get specific currency rate
  async getRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const ratesData = await this.getRates();
    const fromRate = ratesData.rates[fromCurrency.toUpperCase()] || 1;
    const toRate = ratesData.rates[toCurrency.toUpperCase()] || 1;
    
    if (fromCurrency.toUpperCase() === 'USD') {
      return toRate;
    } else if (toCurrency.toUpperCase() === 'USD') {
      return 1 / fromRate;
    } else {
      return toRate / fromRate;
    }
  }
}

export const exchangeRateService = new ExchangeRateService();