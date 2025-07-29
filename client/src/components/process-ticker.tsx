import React from 'react';
import { UserPlus, Wallet, BarChart3, Receipt } from 'lucide-react';

const ProcessTicker = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create an account in less than 1 minute."
    },
    {
      icon: Wallet,
      title: "Fund",
      description: "Deposit funds into your account and select preferred plan."
    },
    {
      icon: BarChart3,
      title: "Invest", 
      description: "Invest Preferred amount from your funded wallet."
    },
    {
      icon: Receipt,
      title: "Withdraw",
      description: "Easily withdraw your profits as soon as it reaches the planned profit target."
    }
  ];

  return (
    <div 
      className="py-4 relative"
      style={{
        backgroundColor: '#000d2e',
        backgroundImage: `url('/attached_assets/afa6f2bb667fc21e47a33f30e6a8da21_1753011776454.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Deep blue overlay for transparency effect */}
      <div className="absolute inset-0 bg-[#000d2e] bg-opacity-70 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        {/* 2x2 grid on mobile, horizontal on desktop */}
        <div className="grid grid-cols-2 gap-4 md:flex md:justify-center md:items-start md:gap-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex flex-col items-center text-white md:flex-1 md:max-w-sm">
                {/* Icon container - smaller size */}
                <div className="bg-black rounded-md w-8 h-8 md:w-10 md:h-10 flex items-center justify-center mb-2">
                  <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                {/* Title text - smaller font */}
                <span className="font-semibold text-xs md:text-sm mb-1 text-center">{step.title}</span>
                {/* Orange line divider to match theme - smaller */}
                <div className="w-6 md:w-8 h-0.5 bg-[#ff8c00] mb-2"></div>
                {/* Description text - smaller font */}
                <p className="text-[10px] md:text-xs text-center leading-tight px-1">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessTicker;