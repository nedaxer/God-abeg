import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, Shield, Lock, UserCheck, Database, Server } from "lucide-react";

export default function Security() {
  const securityFeatures = [
    {
      title: "Regulated US Exchange",
      description: "Nedaxer is regulated by the US Commodity Futures Trading Commission (CFTC), ensuring compliance with strict financial standards.",
      icon: <Shield className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Segregated Funds",
      description: "Your funds are held in segregated bank accounts, separate from Nedaxer's operating funds, for added protection.",
      icon: <Database className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account with optional two-factor authentication.",
      icon: <Lock className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "ID Verification",
      description: "All accounts undergo thorough identity verification to prevent fraud and ensure compliance with regulations.",
      icon: <UserCheck className="h-10 w-10 text-[#0033a0]" />,
    },
    {
      title: "Secure Infrastructure",
      description: "Advanced encryption and security protocols protect your personal information and trading activity.",
      icon: <Server className="h-10 w-10 text-[#0033a0]" />,
    },
  ];

  const securityBestPractices = [
    {
      title: "Use a Strong Password",
      description: "Create a unique password that includes a mix of letters, numbers, and symbols. Avoid using the same password across multiple websites.",
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security to your account by enabling 2FA in your account settings.",
    },
    {
      title: "Keep Your Contact Information Updated",
      description: "Ensure your email and phone number are current so we can reach you regarding important account notifications.",
    },
    {
      title: "Be Alert for Phishing Attempts",
      description: "Nedaxer will never ask for your password via email or phone. Always log in directly through our official website or app.",
    },
    {
      title: "Monitor Your Account Activity",
      description: "Regularly review your account activity and report any suspicious transactions immediately.",
    },
  ];

  return (
    <PageLayout 
      title="Account Security" 
      subtitle="Protecting your information and funds with industry-leading security measures"
      bgColor="#0033a0"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Our Security Commitment</h2>
          
          <p className="mb-6">
            At Nedaxer, we take the security of your account and personal information seriously. 
            As a regulated US exchange, we implement rigorous security measures to protect your 
            data and funds while providing a safe trading environment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {securityFeatures.map((feature, i) => (
              <div key={i} className="flex items-start p-6 bg-[#f5f5f5] rounded-lg">
                <div className="mr-4">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#0033a0]">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Regulatory Protection</h2>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">CFTC Regulation</h3>
            <p className="mb-4">
              Nedaxer is regulated by the US Commodity Futures Trading Commission (CFTC), which 
              oversees the US derivatives markets, including futures, options, and swaps. 
              This regulation requires us to:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Maintain adequate capital reserves</span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Keep member funds in segregated accounts</span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Submit to regular financial audits</span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Implement anti-money laundering procedures</span>
              </li>
              <li className="flex items-start">
                <Check className="text-[#ff5900] mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                <span>Provide fair and transparent pricing</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-[#0033a0]">Segregated Funds</h3>
            <p className="mb-4">
              Your funds are held in segregated bank accounts with top-tier US banks, separate 
              from Nedaxer's operating funds. This ensures that your money is protected and used 
              only for your trading activities.
            </p>
            <p>
              Nedaxer maintains detailed records of all member funds and undergoes regular audits 
              to ensure compliance with regulatory requirements for fund segregation and protection.
            </p>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Technical Security Measures</h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Data Encryption</h3>
              <p className="mb-3">
                We use industry-standard SSL/TLS encryption to protect all data transmitted between your 
                device and our servers. This ensures that your personal information and trading activity 
                remain private and secure.
              </p>
              <p>
                Our web and mobile platforms implement 256-bit encryption, the same level used by major 
                financial institutions and banks.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Two-Factor Authentication (2FA)</h3>
              <p className="mb-3">
                Add an extra layer of security to your account by enabling two-factor authentication. 
                This requires a verification code from your mobile device in addition to your password 
                when logging in from unrecognized devices.
              </p>
              <p>
                We recommend all traders enable 2FA for maximum account security.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-[#0033a0]">Secure Infrastructure</h3>
              <p className="mb-3">
                Our trading infrastructure is hosted in secure data centers with redundant systems, 
                firewalls, and 24/7 monitoring to prevent unauthorized access and ensure platform stability.
              </p>
              <p>
                We perform regular security audits and penetration testing to identify and address 
                potential vulnerabilities.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[#0033a0]">Security Best Practices</h2>
          
          <p className="mb-6">
            While we implement robust security measures, keeping your account secure is a shared responsibility. 
            Follow these best practices to help protect your account:
          </p>
          
          <div className="space-y-4">
            {securityBestPractices.map((practice, i) => (
              <div key={i} className="bg-[#f5f5f5] p-4 rounded-lg">
                <h3 className="font-bold mb-2 text-[#0033a0]">{practice.title}</h3>
                <p className="text-gray-700">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0033a0] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Trade with confidence on a secure platform</h2>
          <p className="mb-6">Open an account today with a CFTC-regulated US exchange.</p>
          <Button
            asChild
            className="bg-[#ff5900] hover:bg-opacity-90 text-white font-semibold px-8 py-3"
          >
            <Link href="#">Open Account</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="ml-4 bg-transparent border border-white hover:bg-white hover:bg-opacity-20 text-white font-semibold px-8 py-3"
          >
            <Link href="/company/regulations">Learn About Regulations</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}