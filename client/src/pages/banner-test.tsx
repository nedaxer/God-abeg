import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { showSuccessBanner, showErrorBanner, showWarningBanner, showInfoBanner } from '@/hooks/use-bottom-banner';
import { CheckCircle, XCircle, AlertTriangle, Info, TestTube } from 'lucide-react';

export default function BannerTestPage() {
  return (
    <div className="min-h-screen bg-[#0a0a2e] p-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-[#1a1a40] border-gray-700 p-6">
          <h1 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center">
            <TestTube className="w-5 h-5 mr-2 text-orange-400" />
            Banner Test Page
          </h1>
          
          <div className="space-y-4">
            <Button 
              onClick={() => showSuccessBanner('Success Test', 'This is a success banner with smooth slide-up animation!')}
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Test Success Banner
            </Button>
            
            <Button 
              onClick={() => showErrorBanner('Error Test', 'This is an error banner with smooth slide-up animation!')}
              className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Test Error Banner
            </Button>
            
            <Button 
              onClick={() => showWarningBanner('Warning Test', 'This is a warning banner with smooth slide-up animation!')}
              className="w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Test Warning Banner
            </Button>
            
            <Button 
              onClick={() => showInfoBanner('Info Test', 'This is an info banner with smooth slide-up animation!')}
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
            >
              <Info className="w-4 h-4 mr-2" />
              Test Info Banner
            </Button>
            
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-semibold text-white mb-2">Test Instructions:</h3>
              <p className="text-xs text-gray-300">
                Tap each button to see the corresponding banner slide up from the bottom with smooth animations. 
                Each banner will auto-dismiss after 3 seconds or you can manually close them using the X button.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}