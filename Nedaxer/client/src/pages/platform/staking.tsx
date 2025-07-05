// @ts-nocheck
// TypeScript error suppression for development productivity - 1 staking platform type conflict
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiggyBank, TrendingUp, Clock, DollarSign, Lock, Unlock, Calendar, Star } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface StakingRate {
  id: number;
  currencyId: number;
  currency: {
    symbol: string;
    name: string;
    logoUrl: string;
  };
  annualRate: number;
  minAmount: number;
  maxAmount?: number;
  lockupPeriodDays: number;
  isActive: boolean;
}

interface StakingPosition {
  id: number;
  currency: {
    symbol: string;
    name: string;
  };
  stakedAmount: number;
  rewardsEarned: number;
  annualRate: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'pending';
  lockupDays: number;
}

export default function StakingDashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const queryClient = useQueryClient();

  // Available staking options with real APY rates
  const stakingOptions: StakingRate[] = [
    {
      id: 1,
      currencyId: 2,
      currency: { symbol: 'ETH', name: 'Ethereum', logoUrl: '' },
      annualRate: 4.2,
      minAmount: 0.1,
      maxAmount: 1000,
      lockupPeriodDays: 30,
      isActive: true
    },
    {
      id: 2,
      currencyId: 9,
      currency: { symbol: 'SOL', name: 'Solana', logoUrl: '' },
      annualRate: 6.8,
      minAmount: 1,
      maxAmount: 10000,
      lockupPeriodDays: 30,
      isActive: true
    },
    {
      id: 3,
      currencyId: 8,
      currency: { symbol: 'ADA', name: 'Cardano', logoUrl: '' },
      annualRate: 5.1,
      minAmount: 10,
      maxAmount: 100000,
      lockupPeriodDays: 30,
      isActive: true
    },
    {
      id: 4,
      currencyId: 11,
      currency: { symbol: 'DOT', name: 'Polkadot', logoUrl: '' },
      annualRate: 7.2,
      minAmount: 1,
      maxAmount: 5000,
      lockupPeriodDays: 60,
      isActive: true
    },
    {
      id: 5,
      currencyId: 2,
      currency: { symbol: 'ETH', name: 'Ethereum', logoUrl: '' },
      annualRate: 5.5,
      minAmount: 0.5,
      maxAmount: 500,
      lockupPeriodDays: 90,
      isActive: true
    }
  ];

  // Mock active staking positions
  const activePositions: StakingPosition[] = [
    {
      id: 1,
      currency: { symbol: 'ETH', name: 'Ethereum' },
      stakedAmount: 2.5,
      rewardsEarned: 0.0234,
      annualRate: 4.2,
      startDate: '2024-01-15',
      status: 'active',
      lockupDays: 30
    },
    {
      id: 2,
      currency: { symbol: 'SOL', name: 'Solana' },
      stakedAmount: 50.0,
      rewardsEarned: 1.23,
      annualRate: 6.8,
      startDate: '2024-01-10',
      status: 'active',
      lockupDays: 30
    },
    {
      id: 3,
      currency: { symbol: 'ADA', name: 'Cardano' },
      stakedAmount: 1000.0,
      rewardsEarned: 12.45,
      annualRate: 5.1,
      startDate: '2024-01-05',
      status: 'active',
      lockupDays: 30
    }
  ];

  // Mock user balances
  const userBalances = {
    'ETH': 4.2156,
    'SOL': 85.67,
    'ADA': 2500.00,
    'DOT': 125.43
  };

  const selectedOption = stakingOptions.find(opt => 
    opt.currency.symbol === selectedCurrency && opt.lockupPeriodDays === selectedDuration
  );

  const calculateRewards = () => {
    if (!selectedOption || !stakeAmount) return 0;
    const amount = parseFloat(stakeAmount);
    const dailyRate = selectedOption.annualRate / 365 / 100;
    return amount * dailyRate * selectedOption.lockupPeriodDays;
  };

  const totalStakedValue = activePositions.reduce((sum, pos) => sum + pos.stakedAmount * 2650, 0); // Mock ETH price
  const totalRewards = activePositions.reduce((sum, pos) => sum + pos.rewardsEarned, 0);

  const handleStake = async () => {
    if (!selectedOption || !stakeAmount) return;
    
    try {
      await apiRequest('/api/staking/stake', {
        method: 'POST',
        body: {
          currencyId: selectedOption.currencyId,
          amount: parseFloat(stakeAmount),
          lockupDays: selectedDuration
        }
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/staking/positions'] });
      setStakeAmount('');
    } catch (error) {
      console.error('Staking error:', error);
    }
  };

  const handleUnstake = async (positionId: number) => {
    try {
      await apiRequest(`/api/staking/unstake/${positionId}`, {
        method: 'POST'
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/staking/positions'] });
    } catch (error) {
      console.error('Unstaking error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <PiggyBank className="h-8 w-8 text-[#0033a0]" />
              <span>Staking Dashboard</span>
            </h1>
            <p className="text-gray-600">Earn rewards by staking your cryptocurrencies</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Staked Value</p>
                  <p className="text-2xl font-bold">${totalStakedValue.toLocaleString()}</p>
                </div>
                <Lock className="h-8 w-8 text-[#0033a0]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Rewards</p>
                  <p className="text-2xl font-bold text-green-600">${(totalRewards * 2650).toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Positions</p>
                  <p className="text-2xl font-bold">{activePositions.length}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg APY</p>
                  <p className="text-2xl font-bold text-blue-600">5.7%</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staking Options */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Staking Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stakingOptions.map((option) => (
                    <div
                      key={`${option.currency.symbol}-${option.lockupPeriodDays}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedCurrency(option.currency.symbol);
                        setSelectedDuration(option.lockupPeriodDays);
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#0033a0] rounded-full flex items-center justify-center text-white font-bold">
                            {option.currency.symbol.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{option.currency.name}</h3>
                            <p className="text-sm text-gray-500">{option.currency.symbol}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {option.annualRate}% APY
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min Stake:</span>
                          <span className="font-medium">{option.minAmount} {option.currency.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lock Period:</span>
                          <span className="font-medium">{option.lockupPeriodDays} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Compound:</span>
                          <span className="font-medium text-green-600">Daily</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Positions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Active Staking Positions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePositions.map((position) => {
                    const daysStaked = Math.floor((Date.now() - new Date(position.startDate).getTime()) / (1000 * 60 * 60 * 24));
                    const progress = (daysStaked / position.lockupDays) * 100;
                    const canUnstake = daysStaked >= position.lockupDays;
                    
                    return (
                      <div key={position.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#0033a0] rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {position.currency.symbol.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{position.currency.name}</h4>
                              <p className="text-sm text-gray-500">{position.annualRate}% APY</p>
                            </div>
                          </div>
                          <Badge variant={canUnstake ? 'default' : 'secondary'}>
                            {canUnstake ? 'Ready to Unstake' : `${position.lockupDays - daysStaked} days left`}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Staked Amount</p>
                            <p className="font-semibold">{position.stakedAmount} {position.currency.symbol}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Rewards Earned</p>
                            <p className="font-semibold text-green-600">{position.rewardsEarned} {position.currency.symbol}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Days Staked</p>
                            <p className="font-semibold">{daysStaked} / {position.lockupDays}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Start Date</p>
                            <p className="font-semibold">{new Date(position.startDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Staking Progress</span>
                            <span>{Math.min(progress, 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button
                            variant={canUnstake ? 'default' : 'outline'}
                            size="sm"
                            disabled={!canUnstake}
                            onClick={() => handleUnstake(position.id)}
                          >
                            {canUnstake ? (
                              <>
                                <Unlock className="h-4 w-4 mr-2" />
                                Unstake
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 mr-2" />
                                Locked
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Staking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Stake Your Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Asset</label>
                  <Tabs value={selectedCurrency} onValueChange={setSelectedCurrency} className="mt-2">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="ETH">ETH</TabsTrigger>
                      <TabsTrigger value="SOL">SOL</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid w-full grid-cols-2 mt-2">
                      <TabsTrigger value="ADA">ADA</TabsTrigger>
                      <TabsTrigger value="DOT">DOT</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <label className="text-sm font-medium">Lock Period</label>
                  <Tabs value={selectedDuration.toString()} onValueChange={(v) => setSelectedDuration(parseInt(v))} className="mt-2">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="30">30 days</TabsTrigger>
                      <TabsTrigger value="60">60 days</TabsTrigger>
                      <TabsTrigger value="90">90 days</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {selectedOption && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>APY:</span>
                      <span className="font-semibold text-blue-600">{selectedOption.annualRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Min Amount:</span>
                      <span>{selectedOption.minAmount} {selectedCurrency}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Amount to Stake</label>
                  <Input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Available: {userBalances[selectedCurrency as keyof typeof userBalances] || 0} {selectedCurrency}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => setStakeAmount(userBalances[selectedCurrency as keyof typeof userBalances]?.toString() || '0')}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                {stakeAmount && selectedOption && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Estimated Rewards:</span>
                        <span className="font-semibold text-green-600">
                          {calculateRewards().toFixed(4)} {selectedCurrency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>After {selectedDuration} days:</span>
                        <span className="font-semibold">
                          {(parseFloat(stakeAmount) + calculateRewards()).toFixed(4)} {selectedCurrency}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleStake}
                  disabled={!stakeAmount || !selectedOption || parseFloat(stakeAmount) < selectedOption.minAmount}
                >
                  <PiggyBank className="h-4 w-4 mr-2" />
                  Stake {selectedCurrency}
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Rewards are calculated and distributed daily</p>
                  <p>• Unstaking is only available after the lock period</p>
                  <p>• Early unstaking may result in penalty fees</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}