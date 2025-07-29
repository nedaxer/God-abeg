import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneIcon, ChevronDownIcon, SearchIcon, MapPinIcon } from "lucide-react";

interface Country {
  code: string;
  name: string;
  flag: string;
  countryCode: string; // ISO country code for geolocation
}

interface CountryPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const countries: Country[] = [
  { code: "+1", name: "United States", flag: "🇺🇸", countryCode: "US" },
  { code: "+1", name: "Canada", flag: "🇨🇦", countryCode: "CA" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", countryCode: "GB" },
  { code: "+49", name: "Germany", flag: "🇩🇪", countryCode: "DE" },
  { code: "+33", name: "France", flag: "🇫🇷", countryCode: "FR" },
  { code: "+39", name: "Italy", flag: "🇮🇹", countryCode: "IT" },
  { code: "+34", name: "Spain", flag: "🇪🇸", countryCode: "ES" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱", countryCode: "NL" },
  { code: "+46", name: "Sweden", flag: "🇸🇪", countryCode: "SE" },
  { code: "+47", name: "Norway", flag: "🇳🇴", countryCode: "NO" },
  { code: "+45", name: "Denmark", flag: "🇩🇰", countryCode: "DK" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭", countryCode: "CH" },
  { code: "+43", name: "Austria", flag: "🇦🇹", countryCode: "AT" },
  { code: "+32", name: "Belgium", flag: "🇧🇪", countryCode: "BE" },
  { code: "+351", name: "Portugal", flag: "🇵🇹", countryCode: "PT" },
  { code: "+30", name: "Greece", flag: "🇬🇷", countryCode: "GR" },
  { code: "+48", name: "Poland", flag: "🇵🇱", countryCode: "PL" },
  { code: "+7", name: "Russia", flag: "🇷🇺", countryCode: "RU" },
  { code: "+86", name: "China", flag: "🇨🇳", countryCode: "CN" },
  { code: "+81", name: "Japan", flag: "🇯🇵", countryCode: "JP" },
  { code: "+82", name: "South Korea", flag: "🇰🇷", countryCode: "KR" },
  { code: "+91", name: "India", flag: "🇮🇳", countryCode: "IN" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬", countryCode: "NG" },
  { code: "+61", name: "Australia", flag: "🇦🇺", countryCode: "AU" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿", countryCode: "NZ" },
  { code: "+27", name: "South Africa", flag: "🇿🇦", countryCode: "ZA" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", countryCode: "BR" },
  { code: "+52", name: "Mexico", flag: "🇲🇽", countryCode: "MX" },
  { code: "+54", name: "Argentina", flag: "🇦🇷", countryCode: "AR" },
  { code: "+56", name: "Chile", flag: "🇨🇱", countryCode: "CL" },
  { code: "+57", name: "Colombia", flag: "🇨🇴", countryCode: "CO" },
  { code: "+51", name: "Peru", flag: "🇵🇪", countryCode: "PE" },
  { code: "+58", name: "Venezuela", flag: "🇻🇪", countryCode: "VE" },
  { code: "+20", name: "Egypt", flag: "🇪🇬", countryCode: "EG" },
  { code: "+254", name: "Kenya", flag: "🇰🇪", countryCode: "KE" },
  { code: "+90", name: "Turkey", flag: "🇹🇷", countryCode: "TR" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", countryCode: "SA" },
  { code: "+971", name: "UAE", flag: "🇦🇪", countryCode: "AE" },
  { code: "+972", name: "Israel", flag: "🇮🇱", countryCode: "IL" },
  { code: "+65", name: "Singapore", flag: "🇸🇬", countryCode: "SG" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", countryCode: "MY" },
  { code: "+66", name: "Thailand", flag: "🇹🇭", countryCode: "TH" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳", countryCode: "VN" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩", countryCode: "ID" },
  { code: "+63", name: "Philippines", flag: "🇵🇭", countryCode: "PH" },
];

// Phone number formatting function for different countries
const formatPhoneNumber = (value: string, countryCode: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  switch (countryCode) {
    case "+1": // US/Canada - format: 123 456 7890
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    
    case "+44": // UK - format: 20 7946 0958
      if (digits.length <= 2) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    
    case "+49": // Germany - format: 30 12345678
      if (digits.length <= 2) return digits;
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    
    case "+33": // France - format: 1 42 34 56 78
      if (digits.length <= 1) return digits;
      if (digits.length <= 3) return `${digits.slice(0, 1)} ${digits.slice(1)}`;
      if (digits.length <= 5) return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3)}`;
      if (digits.length <= 7) return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
      return `${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
    
    case "+234": // Nigeria - format: 802 123 4567
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    
    default: // Default formatting: group by 3s with spaces
      const formatted = digits.match(/.{1,3}/g)?.join(' ') || digits;
      return formatted;
  }
};

function CountryPhoneInput({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  required = false,
  placeholder = "Enter phone number",
  disabled = false
}: CountryPhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [detectedCountry, setDetectedCountry] = useState<Country | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => 
    countries.find(country => country.code === countryCode) || countries[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Update selectedCountry when countryCode prop changes
  useEffect(() => {
    const newSelectedCountry = countries.find(country => country.code === countryCode) || countries[0];
    setSelectedCountry(newSelectedCountry);
    console.log('Updated selectedCountry from prop change:', newSelectedCountry);
  }, [countryCode]);
  
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  );

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect user's location on component mount
  useEffect(() => {
    const detectLocation = async () => {
      setIsDetecting(true);
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code) {
          const foundCountry = countries.find(c => c.countryCode === data.country_code);
          if (foundCountry) {
            setDetectedCountry(foundCountry);
            // Always set the detected country as default if no specific country was pre-selected
            if (countryCode === "+1") {
              onCountryCodeChange(foundCountry.code);
            }
          }
        }
      } catch (error) {
        console.log('Location detection failed:', error);
        // Fallback to US
        const usCountry = countries.find(c => c.countryCode === 'US');
        if (usCountry) {
          setDetectedCountry(usCountry);
        }
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocation();
  }, [onCountryCodeChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    console.log('Country selected:', country);
    console.log('Updating country code from', countryCode, 'to', country.code);
    
    // Update local state first
    setSelectedCountry(country);
    
    // Call the parent callback to update the form state
    onCountryCodeChange(country.code);
    
    // Close modal/dropdown
    setIsOpen(false);
    setSearchTerm("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input, countryCode);
    onChange(formatted);
  };

  return (
    <div className="space-y-3">
      <Label className="text-gray-800 font-semibold text-sm">
        Phone Number
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {/* Country Code Selector - Top */}
      <div className="space-y-2">
        <Label className="text-gray-700 text-xs font-medium">Select Country</Label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 hover:border-yellow-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{selectedCountry.flag}</span>
              <div className="flex flex-col text-left">
                <span className="text-gray-900 font-medium text-sm">{selectedCountry.name}</span>
                <span className="text-gray-600 text-xs">{selectedCountry.code}</span>
              </div>
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Dropdown */}
          {isOpen && isMobile && (
            <div className="absolute top-full mt-1 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-100"
                  />
                </div>
              </div>
              
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.map((country, index) => (
                  <button
                    key={`${country.code}-${country.name}-${index}`}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-yellow-50 transition-colors duration-150 text-left"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{country.name}</div>
                      <div className="text-xs text-gray-500">{country.code}</div>
                    </div>
                  </button>
                ))}
                
                {filteredCountries.length === 0 && (
                  <div className="px-3 py-4 text-center text-gray-500 text-sm">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phone Number Input - Bottom */}
      <div className="space-y-2">
        <Label className="text-gray-700 text-xs font-medium">Phone Number</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PhoneIcon className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="absolute inset-y-0 left-10 pl-1 flex items-center pointer-events-none border-r border-gray-300 pr-2">
            <span className="text-sm font-medium text-gray-700">{selectedCountry.code}</span>
          </div>
          <Input
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            className="w-full pl-20 py-3 bg-gray-50 border-2 border-gray-200 focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-gray-900 placeholder:text-gray-500 rounded-xl text-sm font-medium transition-all duration-200"
            required={required}
            disabled={disabled}
          />
        </div>
      </div>



      {/* Desktop Modal */}
      {isOpen && !isMobile && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl border max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Country</h3>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredCountries.map((country, index) => (
                  <button
                    key={`${country.code}-${country.name}-${index}`}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center space-x-4 px-6 py-3 hover:bg-yellow-50 transition-colors duration-150 text-left border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{country.name}</div>
                      <div className="text-sm text-gray-500">{country.code}</div>
                    </div>
                    {selectedCountry.code === country.code && (
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    )}
                  </button>
                ))}
                
                {filteredCountries.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CountryPhoneInput;