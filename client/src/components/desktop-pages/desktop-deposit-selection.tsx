// @ts-nocheck
// TypeScript error suppression for development productivity
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Wallet, 
  CreditCard, 
  Banknote, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: any;
  processingTime: string;
  fees: string;
  minAmount: string;
  maxAmount: string;
  status: 'available' | 'maintenance' | 'coming_soon';
  features: string[];
}

export default function DesktopDepositSelection() {
  const [, navigate] = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: 'Deposit using Bitcoin, Ethereum, or other cryptocurrencies',
      icon: Wallet,
      processingTime: '1-6 confirmations',
      fees: 'Network fees only',
      minAmount: '$10',
      maxAmount: '$50,000',
      status: 'available',
      features: ['Instant processing', 'Low fees', 'Secure blockchain', 'Multiple coins supported']
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer via ACH or wire transfer',
      icon: Banknote,
      processingTime: '1-3 business days',
      fees: '$5 - $25',
      minAmount: '$50',
      maxAmount: '$100,000',
      status: 'available',
      features: ['High limits', 'Bank-grade security', 'No chargebacks', 'USD deposits']
    },
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      description: 'Instant deposits using Visa, Mastercard, or American Express',
      icon: CreditCard,
      processingTime: 'Instant',
      fees: '3.5% + $0.30',
      minAmount: '$20',
      maxAmount: '$5,000',
      status: 'coming_soon',
      features: ['Instant deposits', 'Widely accepted', 'Easy verification', 'Quick setup']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'maintenance':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'coming_soon':
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Maintenance</Badge>;
      case 'coming_soon':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Coming Soon</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unknown</Badge>;
    }
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    
    // Navigate based on selected method
    switch (methodId) {
      case 'crypto':
        navigate('#/mobile/deposit');
        break;
      case 'bank_transfer':
        // TODO: Implement bank transfer flow
        break;
      case 'credit_card':
        // TODO: Implement credit card flow
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-orange-500" />
            Deposit Funds
          </h1>
          <p className="text-gray-400">Choose your preferred deposit method to fund your account</p>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isAvailable = method.status === 'available';
          
          return (
            <Card
              key={method.id}
              className={`bg-black/20 backdrop-blur-sm border-gray-700/50 transition-all duration-300 cursor-pointer group ${
                isAvailable
                  ? 'hover:border-orange-500/50 hover:bg-black/30'
                  : 'opacity-60 cursor-not-allowed'
              } ${
                selectedMethod === method.id ? 'border-orange-500/50 bg-orange-500/5' : ''
              }`}
              onClick={() => isAvailable && handleMethodSelect(method.id)}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      isAvailable ? 'bg-orange-500/20' : 'bg-gray-500/20'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isAvailable ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        {method.name}
                        {getStatusIcon(method.status)}
                      </CardTitle>
                      <p className="text-gray-400 text-sm mt-1">{method.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(method.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Method Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Processing Time</p>
                    <p className="text-white font-medium">{method.processingTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fees</p>
                    <p className="text-white font-medium">{method.fees}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Min Amount</p>
                    <p className="text-white font-medium">{method.minAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Max Amount</p>
                    <p className="text-white font-medium">{method.maxAmount}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm font-medium">Features:</p>
                  <div className="space-y-1">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full mt-4 ${
                    isAvailable
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isAvailable}
                  onClick={() => isAvailable && handleMethodSelect(method.id)}
                >
                  {method.status === 'available' && 'Select Method'}
                  {method.status === 'maintenance' && 'Under Maintenance'}
                  {method.status === 'coming_soon' && 'Coming Soon'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-500/10 border-blue-500/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">Security & Privacy</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                All deposits are secured with bank-level encryption and multi-factor authentication. 
                Your funds are protected by industry-leading security measures and regulatory compliance. 
                We never store your payment credentials and all transactions are monitored for fraud prevention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-orange-500" />
              Deposit Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Limit:</span>
              <span className="text-white">$100,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly Limit:</span>
              <span className="text-white">$500,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Verification Level:</span>
              <span className="text-green-400">Verified</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Processing Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Crypto Deposits:</span>
              <span className="text-white">1-6 confirmations</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bank Transfers:</span>
              <span className="text-white">1-3 business days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Card Payments:</span>
              <span className="text-white">Instant (coming soon)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}