import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage, Language } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';

export default function LanguageSelection() {
  const [, setLocation] = useLocation();
  const { currentLanguage, languages, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return languages;
    
    const query = searchQuery.toLowerCase();
    return languages.filter(lang => 
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query)
    );
  }, [languages, searchQuery]);

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    toast({
      title: t('language') + ' ' + t('save').toLowerCase(),
      description: `${t('language')} ${language.nativeName}`,
    });
    setLocation('/mobile/settings');
  };

  return (
    <div className="min-h-screen bg-blue-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-800 sticky top-0 bg-blue-950 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/mobile/settings')}
          className="text-white hover:bg-blue-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{t('select_language')}</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t('search_languages')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-blue-900 border-blue-700 text-white placeholder-gray-400 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Language List */}
      <div className="px-4 pb-4">
        <div className="space-y-2">
          {filteredLanguages.map((language) => (
            <Button
              key={language.code}
              variant="ghost"
              onClick={() => handleLanguageSelect(language)}
              className="w-full justify-between p-4 h-auto text-left hover:bg-blue-900 border border-blue-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{language.flag}</span>
                <div>
                  <div className="text-white font-medium">{language.name}</div>
                  <div className="text-gray-400 text-sm">{language.nativeName}</div>
                </div>
              </div>
              {currentLanguage.code === language.code && (
                <Check className="h-5 w-5 text-orange-500" />
              )}
            </Button>
          ))}
        </div>

        {/* No results message */}
        {filteredLanguages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400">
              No languages found matching "{searchQuery}"
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-6 border-t border-blue-800 mt-8">
        <div className="text-gray-400 text-sm text-center">
          Language changes will apply to all pages and interface elements
        </div>
      </div>
    </div>
  );
}